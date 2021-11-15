
// import { VirtualPlayerName } from '@app/classes/virtual-player-name';
// import { Db, MongoClient } from 'mongodb';
// import { Service } from 'typedi';

// const DATABASE_URL =
//     "mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority";
// const DATABASE_NAME = "database";
// const DATABASE_COLLECTION = "virtualPlayerName";

// @Service()
// export class DatabaseService {

//     private db: Db;
//     private client: MongoClient;

//     async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
//         await MongoClient.connect(url)
//             .then((client: MongoClient) => {
//                 this.client = client;
//                 this.db = client.db(DATABASE_NAME);
//             })
//             .catch((error) => {
//                 throw error;
//             });
//         if (
//             (await this.db.collection(DATABASE_COLLECTION).countDocuments()) === 0
//         ) {
//             await this.populateDB();
//         }
//         return this.client;
//     }

//     async closeConnection(): Promise<void> {
//         return this.client.close();
//     }
//     async populateDB(): Promise<void> {
//         let courses: VirtualPlayerName[] = [
//             {
//                 idName: "1",
//                 virtualPlayerName: "erika",
//             },
//             {
//                 idName: "2",
//                 virtualPlayerName: "Sara",
//             },
//         ];

//         console.log("THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE");
//         for (const course of courses) {
//             await this.db.collection(DATABASE_COLLECTION).insertOne(course);
//         }
//     }
//     get database(): Db {
//         return this.db;
//     }
// }