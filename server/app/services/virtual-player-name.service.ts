
import { Collection, MongoClient } from "mongodb";
import { Service } from 'typedi';
import { VirtualPlayerName } from "../classes/virtual-player-name";
// import { DatabaseService } from "./database.service";
const DATABASE_URL =
    "mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority";
const DATABASE_NAME = "VirtualPlayerName";
const DATABASE_COLLECTION = ["beginners", "experts"];

@Service()
export class VirtualPlayerNameService {
    client: MongoClient;
    beginnersCollection: Collection<VirtualPlayerName>;
    expertsCollection: Collection<VirtualPlayerName>;

    constructor(url = DATABASE_URL) {
        MongoClient.connect(url)
            .then((client: MongoClient) => {
                this.client = client;
                this.beginnersCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]);
                this.expertsCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]);
                this.populateBeginnersDB();
                this.populateExpertsDB();
            })
            .catch((error) => {
                throw error;
            });
    }

    async getBeginnersVirtualPlayerNames(): Promise<VirtualPlayerName[]> {
        return this.beginnersCollection
            .find({})
            .toArray()
            .then((virtualPlayerName: VirtualPlayerName[]) => {
                return virtualPlayerName;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async getExpertsVirtualPlayerNames(): Promise<VirtualPlayerName[]> {
        return this.expertsCollection
            .find({})
            .toArray()
            .then((virtualPlayerName: VirtualPlayerName[]) => {
                return virtualPlayerName;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async postBeginnersVirtualPlayerName(virtualPlayerName: VirtualPlayerName): Promise<void> {
        this.beginnersCollection
            .insertOne(virtualPlayerName)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async postExpertsVirtualPlayerName(virtualPlayerName: VirtualPlayerName): Promise<void> {
        this.expertsCollection
            .insertOne(virtualPlayerName)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async deleteBeginnersVirtualPlayerName(idName: string): Promise<void> {
        this.beginnersCollection
            .findOneAndDelete({ _id: idName })
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async deleteExpertsVirtualPlayerName(idName: string): Promise<void> {
        this.expertsCollection
            .findOneAndDelete({ _id: idName })
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async populateBeginnersDB(): Promise<void> {
        if (await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments() === 0) {
            let courses: VirtualPlayerName[] = [
                {
                    idName: "1",
                    virtualPlayerName: "Erika",
                },
                {
                    idName: "2",
                    virtualPlayerName: "Sara",
                },
                {
                    idName: "3",
                    virtualPlayerName: "Etienne"
                },
            ];
            console.log("THIS ADDS BEGINNER PLAYER NAMES TO THE DATABASE, DO NOT USE OTHERWISE");
            for (const course of courses) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(course);
            }
        }
    }

    async populateExpertsDB(): Promise<void> {
        if (await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).countDocuments() === 0) {
            let courses: VirtualPlayerName[] = [
                {
                    idName: "1",
                    virtualPlayerName: "Dieyba",
                },
                {
                    idName: "2",
                    virtualPlayerName: "Kevin",
                },
                {
                    idName: "3",
                    virtualPlayerName: "Ariane",
                },
            ];
            console.log("THIS ADDS EXPERT PLAYER NAMES TO THE DATABASE, DO NOT USE OTHERWISE");
            for (const course of courses) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).insertOne(course);
            }
        }
    }
}