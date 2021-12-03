// import { Dictionary, DictionaryInterface, DictionaryType } from '@app/classes/dictionary';
// import { Collection, MongoClient, ObjectId } from 'mongodb';
// import { Service } from 'typedi';

// const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
// const DATABASE_NAME = 'Dictionary';
// const DATABASE_COLLECTION = 'dictionary';

// @Service()
// export class DictionaryService {
//     // TODO remove this fake service
//     client: MongoClient;
//     dictionaryCollection: Collection<Dictionary>;

//     constructor(url = DATABASE_URL) {
//         MongoClient.connect(url)
//             .then((client: MongoClient) => {
//                 this.client = client;
//                 this.dictionaryCollection = this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
//                 this.populateDictionary();
//             })
//             .catch((error: Error) => {
//                 throw error;
//             });
//     }

//     async getDictionaries(): Promise<Dictionary[]> {
//         return this.dictionaryCollection
//             .find({})
//             .toArray()
//             .then((dictionaries: Dictionary[]) => {
//                 return dictionaries;
//             })
//             .catch((error: Error) => {
//                 throw error;
//             });
//     }

//     async postDictionaries(dictionary: Dictionary): Promise<void> {
//         this.dictionaryCollection
//             .insertOne(dictionary)
//             .then(() => {
//                 /* do nothing */
//             })
//             .catch((error: Error) => {
//                 throw error;
//             });
//     }

//     async populateDictionary(): Promise<void> {
//         const defaultDict = new Dictionary(DictionaryType.Default);
//         const dict: DictionaryInterface = {
//             _id : new ObjectId(),
//             title: defaultDict.title,
//             description: defaultDict.description,
//             words: defaultDict.words,
//         };
//         if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION).countDocuments()) === 0) {
//             await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION).insertOne(dict);
//         }
//     }
// }
