import { BestScores } from "@app/classes/best-scores";
import { Collection, MongoClient } from "mongodb";
import { Service } from 'typedi';
// import { DatabaseService } from "./database.service";
const DATABASE_URL =
    "mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority";
const DATABASE_NAME = "BestScore";
const DATABASE_COLLECTION = ["ClassicMode", "Log2990Mode"];

@Service()
export class BestScoresService {
    client: MongoClient;
    classicCollection: Collection<BestScores>;
    log2990Collection: Collection<BestScores>;

    constructor(url = DATABASE_URL) {
        MongoClient.connect(url)
            .then((client: MongoClient) => {
                this.client = client;
                this.classicCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]);
                this.log2990Collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]);
                this.populateClassicDB();
                this.populateLog2990DB();
            })
            .catch((error) => {
                throw error;
            });
    }

    async getClassicBestScore(): Promise<BestScores[]> {
        return this.classicCollection
            .find({})
            .toArray()
            .then((classicBestScores: BestScores[]) => {
                return classicBestScores;
            })
            .catch((error: Error) => {
                throw error;
            });

    }
    async getLog2990BestScore(): Promise<BestScores[]> {
        return this.log2990Collection
            .find({})
            .toArray()
            .then((log2990BestScores: BestScores[]) => {
                return log2990BestScores;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    async postClassicBestScore(classicBestScore: BestScores): Promise<void> {
        this.classicCollection
            .insertOne(classicBestScore)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    async postLog2990BestScore(log2990BestScore: BestScores): Promise<void> {
        this.classicCollection
            .insertOne(log2990BestScore)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async populateClassicDB(): Promise<void> {
        if (await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments() === 0) {
            let classicBestScores: BestScores[] = [
                {
                    idScore: "1",
                    playerName: "erika",
                    score: 180,
                },
                {
                    idScore: "2",
                    playerName: "Sara",
                    score: 208,
                },
                {
                    idScore: "3",
                    playerName: "Etienne",
                    score: 220,
                },
                {
                    idScore: "4",
                    playerName: "Kevin",
                    score: 85,
                },
                {
                    idScore: "5",
                    playerName: "Ariane",
                    score: 347,
                },
            ];
            console.log("THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE");
            for (const course of classicBestScores) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(course);
            }
        }
    }
    async populateLog2990DB(): Promise<void> {
        if (await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).countDocuments() === 0) {
            let log2990BestScores: BestScores[] = [
                {
                    idScore: "1",
                    playerName: "Dieyba",
                    score: 520,
                },
                {
                    idScore: "2",
                    playerName: "Lévis",
                    score: 14,
                },
                {
                    idScore: "3",
                    playerName: "Nikolay",
                    score: 175,
                },
                {
                    idScore: "4",
                    playerName: "Guillaume",
                    score: 1,
                },
                {
                    idScore: "5",
                    playerName: "Augustin",
                    score: 3,
                },
            ];
            console.log("THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE");
            for (const course of log2990BestScores) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).insertOne(course);
            }
        }
    }


    async checkBestScore() {

    }
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