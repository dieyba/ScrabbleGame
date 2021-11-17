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
            .sort({ score: -1 })
            .limit(5)
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
            .sort({ score: -1 })
            .limit(5)
            .toArray()
            .then((log2990BestScores: BestScores[]) => {
                return log2990BestScores;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    async postClassicBestScore(classicBestScore: BestScores): Promise<void> {
        if (this.canSetScoreInDb(this.classicCollection, classicBestScore)) {
            this.classicCollection.insertOne(classicBestScore)
                .then(() => {
                    /* do nothing */
                })
                .catch((error: Error) => {
                    throw error;
                });
        }
    }

    async postLog2990BestScore(log2990BestScore: BestScores): Promise<void> {
        if (this.canSetScoreInDb(this.log2990Collection, log2990BestScore)) {
            this.log2990Collection
                .insertOne(log2990BestScore)
                .then(() => {
                    /* do nothing */
                })
                .catch((error: Error) => {
                    throw error;
                });
        }
    }
    checkingIfAlreadyInDb(tabScore: Collection<BestScores>, newScore: BestScores): boolean {
        let noChanges = true;
        tabScore.find({}).forEach((score) => {
            if (score.score === newScore.score && score.playerName === newScore.playerName) {
                noChanges = true;
            }
            else {
                noChanges = false;
            }
        })
        return noChanges;
    }

    canSetScoreInDb(tabScore: Collection<BestScores>, newScore: BestScores): boolean {
        let valid: boolean = true;
        let deleteMinScore: BestScores = { playerName: '', score: 100000000000 };
        if (!this.checkingIfAlreadyInDb(tabScore, newScore)) {
            tabScore.find({}).forEach((score) => {
                if (score.score < deleteMinScore.score) {
                    deleteMinScore.playerName = score.playerName
                    deleteMinScore.score = score.score;
                }
            }).then(() => {
                if (deleteMinScore.score < newScore.score) {
                    tabScore.findOneAndDelete(deleteMinScore);
                    valid = true;
                }
                else {
                    valid = false;
                }
            });
        }
        return valid;

    }

    async populateClassicDB(): Promise<void> {
        if (await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments() === 0) {
            let classicBestScores: BestScores[] = [
                {
                    playerName: "erika",
                    score: 10,
                },
                {
                    playerName: "Sara",
                    score: 8,
                },
                {
                    playerName: "Etienne",
                    score: 2,
                },
                {
                    playerName: "Kevin",
                    score: 1,
                },
                {
                    playerName: "Ariane",
                    score: 20,
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
                    playerName: "Dieyba",
                    score: 4,
                },
                {
                    playerName: "Lévis",
                    score: 14,
                },
                {
                    playerName: "Nikolay",
                    score: 8,
                },
                {
                    playerName: "Guillaume",
                    score: 1,
                },
                {
                    playerName: "Augustin",
                    score: 3,
                },
            ];
            for (const course of log2990BestScores) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).insertOne(course);
            }
        }
    }
    async resetClassicCollectionDb(): Promise<void> {
        this.classicCollection
            .deleteMany({})
            .then(() => {
                this.populateClassicDB();
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    async resetLog2990CollectionDb(): Promise<void> {
        this.log2990Collection
            .deleteMany({})
            .then(() => {
                this.populateLog2990DB();
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async resetDataBase() {
        await this.resetClassicCollectionDb();
        await this.resetLog2990CollectionDb();
    }
}