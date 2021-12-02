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


    async canSetInDb(tabScore: Collection<BestScores>, newScore: BestScores): Promise<boolean> {
        const arrayScore = (await tabScore.find({}).sort({ score: -1 }).toArray());
        const deleteMinScore = await this.minimumScore(tabScore);
        let haveToChange = false;
        // console.log(arrayScore)
        console.log(deleteMinScore.score)
        for (let dbScore of arrayScore) {
            console.log('dbScore.score', dbScore.score)
            console.log('dbScore.playerName', dbScore.playerName)
            console.log('newScore', newScore)
            console.log(dbScore.score === newScore.score, ' ', dbScore.playerName === newScore.playerName)
            if (newScore.score < deleteMinScore.score) {
                console.log('score trop petit')
                return haveToChange;
            }
            if (dbScore.score === newScore.score && dbScore.playerName === newScore.playerName) {
                console.log('same nom and same score no changes')
                return haveToChange;
            }
            if (dbScore.score === newScore.score && dbScore.playerName !== newScore.playerName) {
                console.log('different nom but same score')
                return haveToChange = true;
            }
            if (dbScore.score < newScore.score) {
                console.log('score elevé')
                await tabScore.findOneAndDelete(deleteMinScore);
                haveToChange = true;
            }
        }
        return haveToChange;
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

    private async minimumScore(tabScore: Collection<BestScores>): Promise<BestScores> {
        const arrayScore = (await tabScore.find({}).toArray());
        const deleteMinScore: BestScores = { playerName: '', score: MAX_SCORE };
        for (let score of arrayScore) {
            if (score.score < deleteMinScore.score) {
                deleteMinScore.playerName = score.playerName;
                deleteMinScore.score = score.score;
            }
        }
        return deleteMinScore
    }
}
