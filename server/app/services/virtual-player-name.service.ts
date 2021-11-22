import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { Collection, Filter, MongoClient } from 'mongodb';
import { Service } from 'typedi';
// import { DatabaseService } from "./database.service";
const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = 'VirtualPlayerName';
const DATABASE_COLLECTION = ['beginners', 'experts'];

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

    async isSameName(nameToCompare: VirtualPlayerName, playersName: Collection<VirtualPlayerName>): Promise<boolean> {
        let isSameName = false;

        await playersName.find().forEach((virtualPlayerName) => {
            if (virtualPlayerName.name === nameToCompare.name) {
                isSameName = true;
                // return true;
            }
            // return false;
        });
        console.log(isSameName);
        return isSameName;
    }

    async postBeginnersVirtualPlayerName(virtualPlayerName: VirtualPlayerName): Promise<void> {
        return this.beginnersCollection
            .insertOne(virtualPlayerName)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async postExpertsVirtualPlayerName(virtualPlayerName: VirtualPlayerName): Promise<void> {
        return this.expertsCollection
            .insertOne(virtualPlayerName)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async isInCollection(nameToCompare: VirtualPlayerName, playersName: Collection<VirtualPlayerName>): Promise<boolean> {
        let isInCollection = false;
        await playersName.find().forEach((virtualPlayerName) => {
            if (virtualPlayerName.name === nameToCompare.name) {
                isInCollection = true;
            }
        });

        // console.log('is in collection ? ', isInCollection);
        return isInCollection;
    }

    async deleteBeginnersVirtualPlayerName(name: string): Promise<void> {
        return this.beginnersCollection
            .findOneAndDelete({ name: name })
            .then((deleted) => {
                /* do nothing */
                console.log('then dans fonction');
                if (!deleted.value) {
                    throw new Error("Could not find name");
                }
            })
            .catch(() => {
                console.log('catch dans fonction')
                throw new Error("Failed to delete name");
            });
    }

    async deleteExpertsVirtualPlayerName(name: string): Promise<void> {
        return this.expertsCollection
            .findOneAndDelete({ name: name })
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async updateBeginnerVirtualPlayerName(nameToUpdate: string, updateName: string): Promise<void> {
        if (await this.isSameName(({ name: updateName }) as VirtualPlayerName, this.beginnersCollection)) {
            return;
        }

        let filterSameName: Filter<VirtualPlayerName> = { name: nameToUpdate };
        return this.beginnersCollection
            .findOneAndReplace(filterSameName, { name: updateName })
            .then(() => {})
            .catch((error) => console.error(error));
    }

    async updateExpertVirtualPlayerName(nameToUpdate: string, updateName: string): Promise<void> {
        if (await this.isSameName(({ name: updateName }) as VirtualPlayerName, this.expertsCollection)) {
            return;
        }

        let filterSameName: Filter<VirtualPlayerName> = { name: nameToUpdate };
        return this.expertsCollection
            .findOneAndReplace(filterSameName, { name: updateName })
            .then(() => {})
            .catch((error) => console.error(error));
    }

    async populateBeginnersDB(): Promise<void> {
        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments()) === 0) {
            const courses: VirtualPlayerName[] = [
                {
                    // idName: "1",
                    name: "Erika",
                },
                {
                    // idName: "2",
                    name: "Sara",
                },
                {
                    // idName: "3",
                    name: "Etienne"
                },
            ];
            for (const course of courses) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(course);
            }
        }
    }

    async populateExpertsDB(): Promise<void> {
        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).countDocuments()) === 0) {
            const courses: VirtualPlayerName[] = [
                {
                    // idName: "1",
                    name: "Dieyba",
                },
                {
                    // idName: "2",
                    name: "Kevin",
                },
                {
                    // idName: "3",
                    name: "Ariane",
                },
            ];
            for (const course of courses) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).insertOne(course);
            }
        }
    }
}
