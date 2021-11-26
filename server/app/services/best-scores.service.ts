import { BestScores } from '@app/classes/best-scores';
import { Collection, MongoClient } from 'mongodb';
import { Service } from 'typedi';
// import { DatabaseService } from "./database.service";
const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = 'BestScore';
export const DATABASE_COLLECTION = ['ClassicMode', 'Log2990Mode'];

const MAX_SCORE = 100000000000;
@Service()
export class BestScoresService {
    private client: MongoClient;
    defaultClassicBestScoresValue: BestScores[];
    defaultLog2990BestScoresValue: BestScores[];
    classicCollection: Collection<BestScores>;
    log2990Collection: Collection<BestScores>;
    dbUrl: string

    constructor(url: string = DATABASE_URL) {
        this.dbUrl = url;
        this.defaultClassicBestScoresValue = [
            {
                playerName: 'Erika',
                score: 1,
            },
            {
                playerName: 'Sara',
                score: 8,
            },
            {
                playerName: 'Etienne',
                score: 2,
            },
            {
                playerName: 'Ariane',
                score: 10,
            },
            {
                playerName: 'Kevin',
                score: 20,
            },
        ];

        this.defaultLog2990BestScoresValue = [
            {
                playerName: 'Dieyba',
                score: 4,
            },
            {
                playerName: 'Lévis',
                score: 14,
            },
            {
                playerName: 'Nikolay',
                score: 8,
            },
            {
                playerName: 'Guillaume',
                score: 1,
            },
            {
                playerName: 'Augustin',
                score: 3,
            },
        ];
        // this.connectClient();

    }

    async connectClient(url?: string): Promise<void> {
        console.log('In connect client')
        return MongoClient.connect(this.dbUrl)
            .then(async (client: MongoClient) => {
                console.log('Client conected')
                this.client = client;
                this.classicCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]);
                this.log2990Collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]);
                await this.populateDB(this.defaultClassicBestScoresValue, DATABASE_COLLECTION[0]);
                // console.log(await this.classicCollection.find({}).toArray())
                await this.populateDB(this.defaultLog2990BestScoresValue, DATABASE_COLLECTION[1]);
            })
            .catch((error) => {
                console.error(error)
                throw error;
            });
    }

    async getBestScores(collectionType: Collection<BestScores>): Promise<BestScores[]> {
        return collectionType
            .find({})
            .sort({ score: -1 })
            .toArray()
            .then((bestScores: BestScores[]) => {
                console.log(bestScores);
                return bestScores;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async postBestScore(collectionType: Collection<BestScores>, bestScore: BestScores): Promise<void> {
        // // if (await this.canSetInDb(collectionType, bestScore)) {
        // try {
        //     if (await this.canSetInDb(collectionType, bestScore)) {
        //         console.log('insert')
        //         await collectionType.insertOne(bestScore)
        //     }
        // } catch (error) {
        //     throw error;
        // }
        if (await this.canSetInDb(collectionType, bestScore)) {
            collectionType
                .insertOne(bestScore)
                .then(() => {
                    /* do nothing */
                })
                .catch((error: Error) => {
                    throw error;
                });
        }

        // .then(() => {
        //     /* do nothing */
        // })
        // .catch((error: Error) => {
        //     throw error;
        // });
        // }
    }

    async checkingIfAlreadyInDb(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        let haveToChange = false;
        console.log('newScore', newScore);
        await tabScore.find({}).forEach((score) => {
            if (score.score <= newScore.score && score.playerName === newScore.playerName) {
                tabScore.findOneAndDelete(score);
                console.log('deleted');
                haveToChange = true;
            }
        });
        // // console.log(tabs);
        // console.log(newScore);
        // for (let score of tabs) {
        //     if (score.score < newScore.score && score.playerName === newScore.playerName) {
        //         await tabScore.findOneAndDelete(score);
        //         console.log('delete');
        //         haveToChange = true;
        //     }
        // }

        // forEach(async (score) => {
        //     if (score.score < newScore.score && score.playerName === newScore.playerName) {
        //         await tabScore.findOneAndDelete(score);
        //         haveToChange = true;
        //     }
        // });
        console.log('haveToChange', haveToChange)
        return haveToChange;
    }

    async isTwoSameBestScores(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        let twoSameBestScore = false;
        const sameNameSameScore = await this.checkingIfAlreadyInDb(tabScore, newScore);
        if (!sameNameSameScore) {
            await tabScore.find({}).forEach((score) => {
                if (score.score === newScore.score) {
                    twoSameBestScore = true;
                }
            });
        }
        console.log('twoSameBestScore', twoSameBestScore)
        return twoSameBestScore;
    }

    async isScoreHigh(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        let valid = false;
        const deleteMinScore: BestScores = { playerName: '', score: MAX_SCORE };
        const sameNameSameScore = await this.checkingIfAlreadyInDb(tabScore, newScore);
        const twoBestScores = await this.isTwoSameBestScores(tabScore, newScore);
        if (!sameNameSameScore && !twoBestScores) {
            console.log('high')
            await tabScore.find({}).forEach((score) => {
                if (score.score < deleteMinScore.score) {
                    deleteMinScore.playerName = score.playerName;
                    deleteMinScore.score = score.score;
                    // console.log('deleteMinScore.score before delete', deleteMinScore.score);
                }
            });
            console.log('deleteMinScore.score before delete', deleteMinScore.score, 'newScore', newScore);
            if (deleteMinScore.score < newScore.score) {
                console.log('deleteMinScore.score', deleteMinScore.score);
                await tabScore.findOneAndDelete(deleteMinScore);
                valid = true;
            }
        }
        console.log('valid', valid)
        return valid;
    }
    async canSetInDb(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        const sameNameDifferentScore = await this.checkingIfAlreadyInDb(tabScore, newScore);
        const scoreIsHigh = await this.isScoreHigh(tabScore, newScore);
        const twoSameScores = await this.isTwoSameBestScores(tabScore, newScore);
        return scoreIsHigh || twoSameScores || sameNameDifferentScore;
    }

    async populateDB(typeScores: BestScores[], dbCollection: string): Promise<void> {
        const docCount = await this.client.db(DATABASE_NAME).collection(dbCollection).countDocuments()
        if (docCount === 0) {
            console.log('enter')
            for (const score of typeScores) {
                await this.client.db(DATABASE_NAME).collection(dbCollection).insertOne(score);
            }
        } else {
            console.log('Database not empty, size : ' + docCount);
        }
    }

    async resetCollectionInDb(tabScore: Collection<BestScores>, typeScores: BestScores[], dbCollection: string): Promise<void> {
        try {
            await tabScore.deleteMany({})
            await this.populateDB(typeScores, dbCollection);
        } catch (error) {
            throw error;
        }

    }

    async resetDataBase() {
        await this.resetCollectionInDb(this.classicCollection, this.defaultClassicBestScoresValue, DATABASE_COLLECTION[0]);
        await this.resetCollectionInDb(this.log2990Collection, this.defaultLog2990BestScoresValue, DATABASE_COLLECTION[1]);
    }
}
