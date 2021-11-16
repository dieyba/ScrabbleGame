import { DictionaryInterface } from '@app/classes/dictionary';
import { Collection, MongoClient } from 'mongodb';
import { Service } from 'typedi';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = 'Dictionary';
const DATABASE_COLLECTION = ['Dictionary'];

@Service()
export class DictionaryDBService {
    client: MongoClient;
    dictionaryCollection: Collection<DictionaryInterface>;

    constructor(url = DATABASE_URL) {
        console.log('here!');
        MongoClient.connect(url)
            .then((client: MongoClient) => {
                this.client = client;
                this.dictionaryCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]);
                this.populateDictionaryDB();
            })
            .catch((error) => {
                throw error;
            });
    }

    // async getClassicBestScore(): Promise<BestScores[]> {
    //     return this.classicCollection
    //         .find({})
    //         .toArray()
    //         .then((classicBestScores: BestScores[]) => {
    //             return classicBestScores;
    //         })
    //         .catch((error: Error) => {
    //             throw error;
    //         });

    // }
    // async getLog2990BestScore(): Promise<BestScores[]> {
    //     return this.log2990Collection
    //         .find({})
    //         .toArray()
    //         .then((log2990BestScores: BestScores[]) => {
    //             return log2990BestScores;
    //         })
    //         .catch((error: Error) => {
    //             throw error;
    //         });

    // }

    // async postClassicBestScore(classicBestScore: BestScores): Promise<void> {
    //     this.classicCollection
    //         .insertOne(classicBestScore)
    //         .then(() => {
    //             /* do nothing */
    //         })
    //         .catch((error: Error) => {
    //             throw error;
    //         });
    // }
    // async postLog2990BestScore(log2990BestScore: BestScores): Promise<void> {
    //     this.classicCollection
    //         .insertOne(log2990BestScore)
    //         .then(() => {
    //             /* do nothing */
    //         })
    //         .catch((error: Error) => {
    //             throw error;
    //         });
    // }

    async populateDictionaryDB(): Promise<void> {
        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments()) === 0) {
            const dictionaries: DictionaryInterface[] = [
                {
                    idDict: 1,
                    title: 'erika',
                    description: 'assiette de patates frites à erika',
                    words: ['patates frites #1', 'patates frites #2', 'patates frites #3', 'patates frites #4', 'patates frites #5'],
                },
            ];
            console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
            for (const course of dictionaries) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(course);
            }
        }
    }

    // async checkBestScore() {

    // }
    // async deleteVirtualPlayerName(idName: string): Promise<void> {
    //     this.collection
    //         .findOneAndDelete({ _id: idName })
    //         .then(() => {
    //             /* do nothing */
    //         })
    //         .catch((error: Error) => {
    //             throw error;
    //         });
    // }
}
