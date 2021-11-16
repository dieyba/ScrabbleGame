import { DictionaryInterface } from '@app/classes/dictionary';
import { Db, MongoClient } from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = 'Dictionary';
const DATABASE_COLLECTION = 'Dictionary';

@injectable()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }

        if ((await this.db.collection(DATABASE_COLLECTION).countDocuments()) === 0) {
            await this.populateDB();
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDB(): Promise<void> {
        const dictionary: DictionaryInterface[] = [
            {
                idDict: 1,
                title: 'potato',
                description: 'potato',
                words: ['potato1', 'potato2', 'potato3'],
            },
            {
                idDict: 2,
                title: 'banana',
                description: 'banana',
                words: ['banana1', 'banana2', 'banana3'],
            },
        ];

        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const course of dictionary) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(course);
        }
    }

    get database(): Db {
        return this.db;
    }
}
