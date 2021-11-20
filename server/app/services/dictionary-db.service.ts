import { DictionaryInterface } from '@app/classes/dictionary';
import { Collection, FindOptions, MongoClient } from 'mongodb';
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

    async getDictionary(name: string): Promise<DictionaryInterface> {
        return this.dictionaryCollection
            .findOne({ title: name })
            .then((dictionary) => {
                return dictionary as DictionaryInterface;
            })
            .catch(() => {
                throw new Error('Failed to get dictionary');
            });
    }

    async getAllDictionaryDescription(): Promise<DictionaryInterface[]> {
        const projection: FindOptions = { projection: { words: 0 } };
        return this.dictionaryCollection
            .find({}, projection)
            .toArray()
            .then((dictionaries) => {
                return dictionaries as DictionaryInterface[];
            })
            .catch(() => {
                throw new Error('Failed to get dictionary');
            });
    }
    async postDictionary(dictionary: DictionaryInterface): Promise<void> {
        this.dictionaryCollection
            .insertOne(dictionary)
            .then(() => {
                /* do nothing */
            })
            .catch(() => {
                throw new Error('Failed to post dictionary');
            });
    }
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
