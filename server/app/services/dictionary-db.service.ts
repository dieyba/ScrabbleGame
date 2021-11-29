import { Dictionary, DictionaryInterface } from '@app/classes/dictionary';
import { Collection, Filter, FindOneAndUpdateOptions, FindOptions, MongoClient, ObjectId } from 'mongodb';
import { Service } from 'typedi';
import * as dict_path from '@app/assets/dictionnary.json';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = 'Dictionary';
const DATABASE_COLLECTION = ['Dictionary'];

@Service()
export class DictionaryDBService {
    client: MongoClient;
    dictionaryCollection: Collection<DictionaryInterface>;
    dbUrl: string;

    constructor(url: string = DATABASE_URL) {
        this.dbUrl = url;
    }

    async clientConnection(): Promise<void> {
        return MongoClient.connect(this.dbUrl)
            .then(async (client: MongoClient) => {
                this.client = client;
                this.dictionaryCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]);
                await this.populateDictionaryDB();
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

    async updateDictionary(dictionaryId: ObjectId, newTitle: string, newDescription: string): Promise<void> {
        if (!await this.isSameTitle(newTitle)) {
            throw new Error('Ce titre existe déjà');
        }

        const filterSameId: Filter<DictionaryInterface> = { _id: new ObjectId(dictionaryId) };
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return this.dictionaryCollection
            .findOneAndUpdate(filterSameId, { $set: { title: newTitle, description: newDescription } }, options)
            .then(() => {
                /* Do nothing */
            })
            .catch((error) => {
                throw error;
            });
    }

    async reset() {
        return this.dictionaryCollection
            .deleteMany({})
            .then(() => {
                this.populateDictionaryDB();
            })
            .catch((error: Error) => {
                throw error;
            })
    }

    async populateDictionaryDB(): Promise<void> {
        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments()) === 0) {
            const dico = dict_path as Dictionary;
            const dictionaries: DictionaryInterface =
                {
                    _id: new ObjectId(),
                    title: dico.title,
                    description: dico.description,
                    words: dico.words,
                };
            await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(dictionaries);
        }
    }

    private async isSameTitle(titleToCompare: string): Promise<boolean> {
        let isSameTitle = false;

        await this.dictionaryCollection.find().forEach((dictionary) => {
            if (dictionary.title === titleToCompare) {
                isSameTitle = true;
            }
        });
        return isSameTitle;
    }
}
