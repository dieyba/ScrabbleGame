import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { Collection, Filter, FindOneAndUpdateOptions, MongoClient, ObjectId } from 'mongodb';
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

    async postBeginnersVirtualPlayerName(virtualPlayerName: VirtualPlayerName): Promise<void> {
        if (await this.isSameName(virtualPlayerName, this.beginnersCollection)) {
            throw new Error('Ce nom existe déjà');
        }

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
        if (await this.isSameName(virtualPlayerName, this.expertsCollection)) {
            throw new Error('Ce nom existe déjà');
        }

        return this.expertsCollection
            .insertOne(virtualPlayerName)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async deleteBeginnersVirtualPlayerName(name: string): Promise<void> {
        return this.beginnersCollection
            .findOneAndDelete({ name })
            .then((deleted) => {
                if (!deleted.value) {
                    throw new Error('Could not find name');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete name');
            });
    }

    async deleteExpertsVirtualPlayerName(name: string): Promise<void> {
        return this.expertsCollection
            .findOneAndDelete({ name })
            .then((deleted) => {
                if (!deleted.value) {
                    throw new Error('Could not find name');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete name');
            });
    }

    async updateBeginnerVirtualPlayerName(nameToUpdateId: ObjectId, updateName: string): Promise<void> {
        if (await this.isSameName({ _id: new ObjectId(), name: updateName }, this.beginnersCollection)) {
            throw new Error('Ce nom existe déjà');
        }

        const filterSameId: Filter<VirtualPlayerName> = { _id: new ObjectId(nameToUpdateId) };
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return this.beginnersCollection
            .findOneAndUpdate(filterSameId, { $set: { name: updateName } }, options)
            .then(() => {
                /* Do nothing */
            })
            .catch((error) => {
                throw error;
            });
    }

    async updateExpertVirtualPlayerName(nameToUpdateId: ObjectId, updateName: string): Promise<void> {
        if (await this.isSameName({ _id: new ObjectId(), name: updateName }, this.expertsCollection)) {
            throw new Error('Ce nom existe déjà');
        }

        const filterSameId: Filter<VirtualPlayerName> = { _id: new ObjectId(nameToUpdateId) };
        return this.expertsCollection
            .findOneAndReplace(filterSameId, { $set: { name: updateName } })
            .then(() => {
                /* Do nothing */
            })
            .catch((error) => {
                throw error;
            });
    }

    async resetDataBase(): Promise<void> {
        await this.resetCollection(this.beginnersCollection);
        await this.resetCollection(this.expertsCollection);
    }

    async populateBeginnersDB(): Promise<void> {
        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments()) === 0) {
            const courses: VirtualPlayerName[] = [
                {
                    _id: new ObjectId(),
                    name: 'Erika',
                },
                {
                    _id: new ObjectId(),
                    name: 'Sara',
                },
                {
                    _id: new ObjectId(),
                    name: 'Etienne',
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
                    _id: new ObjectId(),
                    name: 'Dieyba',
                },
                {
                    _id: new ObjectId(),
                    name: 'Kevin',
                },
                {
                    _id: new ObjectId(),
                    name: 'Ariane',
                },
            ];
            for (const course of courses) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).insertOne(course);
            }
        }
    }

    private async isSameName(nameToCompare: VirtualPlayerName, playersName: Collection<VirtualPlayerName>): Promise<boolean> {
        let isSameName = false;

        await playersName.find().forEach((virtualPlayerName) => {
            if (virtualPlayerName.name === nameToCompare.name) {
                isSameName = true;
            }
        });
        return isSameName;
    }

    private async resetCollection(collection: Collection<VirtualPlayerName>): Promise<void> {
        return collection
            .deleteMany({})
            .then(() => {
                this.populateBeginnersDB();
                this.populateExpertsDB();
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
