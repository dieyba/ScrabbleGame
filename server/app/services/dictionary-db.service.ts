/* eslint no-underscore-dangle: 0 */
import * as dict_path from '@app/assets/dictionnary.json';
import { Dictionary, DictionaryInterface } from '@app/classes/dictionary';
import { Collection, Filter, FindOneAndUpdateOptions, FindOptions, MongoClient, ObjectId } from 'mongodb';
import { Service } from 'typedi';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = 'Dictionary';
const DATABASE_COLLECTION = ['Dictionary'];

@Service()
export class DictionaryDBService {
    client: MongoClient;
    dictionaryCollection: Collection<DictionaryInterface>;
    dbUrl: string;

    constructor(url = DATABASE_URL) {
        this.dbUrl = url;
    }

    async clientConnection(): Promise<void> {
        return MongoClient.connect(this.dbUrl)
            .then(async (client: MongoClient) => {
                this.client = client;
                // console.log('client connection');
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
        if (!this.isDictionaryValid(dictionary)) {
            throw new TypeError("Le dictionnaire n'a pas un format valide");
        }
        if (!(await this.isDictionaryUnique(dictionary))) {
            throw new SyntaxError('Un dictionnaire avec le même nom existe déjà');
        }
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
        const isSameTitle = await this.isSameTitle(newTitle);
        if (isSameTitle) {
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

    async delete(dictionaryId: string): Promise<void> {
        const id = new ObjectId(dictionaryId);
        const isInCollection = await this.isInCollection(id);
        console.log('is in collection ? ', isInCollection);

        if (!isInCollection) {
            throw new Error('Pas dans la base de donnée');
        }

        const filterSameId: Filter<DictionaryInterface> = { _id: id };
        return this.dictionaryCollection
            .findOneAndDelete(filterSameId)
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
            });
    }

    async populateDictionaryDB(): Promise<void> {
        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments()) === 0) {
            // const dictionaries: DictionaryInterface[] = [
            //     {
            //         _id: new ObjectId(),
            //         title: 'erika',
            //         description: 'assiette de patates frites à erika',
            //         words: ['patates frites #1', 'patates frites #2', 'patates frites #3', 'patates frites #4', 'patates frites #5'],
            //     },
            // ];
            // for (const course of dictionaries) {
            //     await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(course);
            // }
            const dico = dict_path as Dictionary;
            const dictionaries: DictionaryInterface = {
                _id: new ObjectId(),
                title: dico.title,
                description: dico.description,
                words: dico.words,
            };
            await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(dictionaries);
        }
    }

    isDictionaryValid(dictionary: DictionaryInterface): boolean {
        const isTitleValid = dictionary.title !== '' && typeof dictionary.title === 'string';
        const isDescriptionValid = dictionary.description !== '' && typeof dictionary.description === 'string';
        const isWordsValid = this.validateDictionaryWords(dictionary.words);
        return isTitleValid && isDescriptionValid && isWordsValid;
    }

    validateDictionaryWords(words: string[]): boolean {
        // check if iterable
        if (words.length === 0) {
            return false;
        }

        let isAllWordsString = true;

        for (const word of words) {
            if (typeof word !== 'string') {
                isAllWordsString = false;
                break;
            }
        }

        return isAllWordsString;
    }

    async isDictionaryUnique(dictionary: DictionaryInterface): Promise<boolean> {
        return this.getAllDictionaryDescription()
            .then((dictionaryDescriptions: DictionaryInterface[]) => {
                for (const dictionaryDescription of dictionaryDescriptions) {
                    if (dictionary.title === dictionaryDescription.title) return false;
                }
                return true;
            })
            .catch(() => {
                throw Error('Ne peut pas vérifier que le dictionnaire est unique');
            });
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

    private async isInCollection(dictionaryId: ObjectId): Promise<boolean> {
        let isInCollection = false;
        console.log('id to delete : ', dictionaryId.id);
        await this.dictionaryCollection.find().forEach((dictionary) => {
            console.log('dico name in tab: ', dictionary.title);
            console.log('dico id  tab: ', dictionary._id);
            console.log(dictionaryId.equals(dictionary._id));
            if (dictionaryId.equals(dictionary._id)) {
                isInCollection = true;
            }
        });

        return isInCollection;
    }
}
