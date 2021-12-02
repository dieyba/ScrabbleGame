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
    defaultClassicBestScoresValue: BestScores[];
    defaultLog2990BestScoresValue: BestScores[];
    classicCollection: Collection<BestScores>;
    log2990Collection: Collection<BestScores>;
    dbUrl: string;
    private client: MongoClient;

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
    }

    async connectClient(): Promise<void> {
        return MongoClient.connect(this.dbUrl)
            .then(async (client: MongoClient) => {
                this.client = client;
                this.classicCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]);
                this.log2990Collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]);
                await this.populateDB(this.defaultClassicBestScoresValue, DATABASE_COLLECTION[0]);
                await this.populateDB(this.defaultLog2990BestScoresValue, DATABASE_COLLECTION[1]);
            })
            .catch(() => {
                throw new Error('Connection with database fail');
            });
    }

    async getBestScores(collectionType: Collection<BestScores>): Promise<BestScores[]> {
        return collectionType
            .find({})
            .sort({ score: -1 })
            .toArray()
            .then((bestScores: BestScores[]) => {
                return bestScores;
            });
    }

    async postBestScore(collectionType: Collection<BestScores>, bestScore: BestScores): Promise<void> {
        if (await this.canSetInDb(collectionType, bestScore)) {
            collectionType.insertOne(bestScore);
        }
    }

    async checkingIfAlreadyInDb(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        let haveToChange = false;
        await tabScore.find({}).forEach(async (score) => {
            if (score.score < newScore.score && score.playerName === newScore.playerName) {
                await tabScore.findOneAndDelete(score);
                haveToChange = true;
            }
        });
        return haveToChange;
    }

    async isTwoSameBestScores(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        let twoSameBestScore = false;
        const sameNameSameScore = await this.checkingIfAlreadyInDb(tabScore, newScore);
        if (!sameNameSameScore) {
            await tabScore.find({}).forEach((score) => {
                if (score.score === newScore.score && score.playerName !== newScore.playerName) {
                    twoSameBestScore = true;
                }
            });
        }
        return twoSameBestScore;
    }

    async isScoreHigh(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        let valid = false;
        const deleteMinScore: BestScores = { playerName: '', score: MAX_SCORE };
        const sameNameSameScore = await this.checkingIfAlreadyInDb(tabScore, newScore);
        const twoBestScores = await this.isTwoSameBestScores(tabScore, newScore);
        if (!sameNameSameScore && !twoBestScores) {
            await tabScore.find({}).forEach((score) => {
                if (score.score < deleteMinScore.score) {
                    deleteMinScore.playerName = score.playerName;
                    deleteMinScore.score = score.score;
                }
            });
            if (deleteMinScore.score < newScore.score) {
                await tabScore.findOneAndDelete(deleteMinScore);
                valid = true;
            }
        }
        return valid;
    }
    // async canSetInDb(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
    //     const sameNameDifferentScore = await this.checkingIfAlreadyInDb(tabScore, newScore);
    //     const scoreIsHigh = await this.isScoreHigh(tabScore, newScore);
    //     const twoSameScores = await this.isTwoSameBestScores(tabScore, newScore);
    //     return scoreIsHigh || twoSameScores || sameNameDifferentScore;
    // }

    async canSetInDb(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        const arrayScore = tabScore.find({}).toArray();
        if (score.score < newScore.score && score.playerName === newScore.playerName) {
            await tabScore.findOneAndDelete(score);
            haveToChange = true;
        }
    }

    async populateDB(typeScores: BestScores[], dbCollection: string): Promise<void> {
        const docCount = await this.client.db(DATABASE_NAME).collection(dbCollection).countDocuments();
        if (docCount === 0) {
            for (const score of typeScores) {
                await this.client.db(DATABASE_NAME).collection(dbCollection).insertOne(score);
            }
        }
    }

    async resetCollectionInDb(tabScore: Collection<BestScores>, typeScores: BestScores[], dbCollection: string): Promise<void> {
        await tabScore.deleteMany({});
        await this.populateDB(typeScores, dbCollection);
    }

    async resetDataBase() {
        await this.resetCollectionInDb(this.classicCollection, this.defaultClassicBestScoresValue, DATABASE_COLLECTION[0]);
        await this.resetCollectionInDb(this.log2990Collection, this.defaultLog2990BestScoresValue, DATABASE_COLLECTION[1]);
    }
}
