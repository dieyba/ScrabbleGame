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

    async populateDictionaryDB(): Promise<void> {
        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments()) === 0) {
            const dictionaries: DictionaryInterface[] = [
                {
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
}
