
import { Collection, MongoClient } from "mongodb";
import { Service } from 'typedi';
import { VirtualPlayerName } from "../classes/virtual-player-name";
// import { DatabaseService } from "./database.service";
const DATABASE_URL =
    "mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority";
const DATABASE_NAME = "database";
const DATABASE_COLLECTION = "virtualPlayerName";

@Service()
export class VirtualPlayerNameService {
    client: MongoClient;
    collection: Collection<VirtualPlayerName>;


    constructor(url = DATABASE_URL) {
        MongoClient.connect(url)
            .then((client: MongoClient) => {
                this.client = client;
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
                this.populateDB();
            })
            .catch((error) => {
                throw error;
            });
    }

    async getVirtualPlayerNames(): Promise<VirtualPlayerName[]> {
        return this.collection
            .find({})
            .toArray()
            .then((virtualPlayerName: VirtualPlayerName[]) => {
                return virtualPlayerName;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    async postVirtualPlayerName(virtualPlayerName: VirtualPlayerName): Promise<void> {
        this.collection
            .insertOne(virtualPlayerName)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async deleteVirtualPlayerName(idName: string): Promise<void> {
        this.collection
            .findOneAndDelete({ _id: idName })
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    async populateDB(): Promise<void> {
        if (await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION).countDocuments() === 0) {
            let courses: VirtualPlayerName[] = [
                {
                    idName: "1",
                    virtualPlayerName: "erika",
                },
                {
                    idName: "2",
                    virtualPlayerName: "Sara",
                },
            ];
            console.log("THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE");
            for (const course of courses) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION).insertOne(course);
            }
        }
    }

}