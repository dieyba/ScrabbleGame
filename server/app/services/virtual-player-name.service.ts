import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { Collection, Filter, FindOneAndUpdateOptions, MongoClient, ObjectId } from 'mongodb';
import { Service } from 'typedi';
// import { DatabaseService } from "./database.service";
const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = 'VirtualPlayerName';
const DATABASE_COLLECTION = ['beginners', 'experts'];

@Service()
export class VirtualPlayerNameService {
    beginnersCollection: Collection<VirtualPlayerName>;
    expertsCollection: Collection<VirtualPlayerName>;
    private client: MongoClient;
    private originalBeginnerVirtualPlayerNames: VirtualPlayerName[];
    private originalExpertVirtualPlayerNames: VirtualPlayerName[];

    constructor(url = DATABASE_URL) {
        MongoClient.connect(url)
            .then((client: MongoClient) => {
                this.client = client;
                this.originalBeginnerVirtualPlayerNames = [
                    { _id: new ObjectId(), name: 'Erika' },
                    { _id: new ObjectId(), name: 'Sara' },
                    { _id: new ObjectId(), name: 'Etienne' },
                ];
                this.originalExpertVirtualPlayerNames = [
                    { _id: new ObjectId(), name: 'Dieyba' },
                    { _id: new ObjectId(), name: 'Kevin' },
                    { _id: new ObjectId(), name: 'Ariane' },
                ];
                this.beginnersCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]);
                this.expertsCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]);
                this.populate();
            })
            .catch((error) => {
                throw error;
            });
    }

    async getVirtualPlayerNames(collection: Collection<VirtualPlayerName>): Promise<VirtualPlayerName[]> {
        return collection
            .find({})
            .toArray()
            .then((virtualPlayerName: VirtualPlayerName[]) => {
                return virtualPlayerName;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async postVirtualPlayerName(collection: Collection<VirtualPlayerName>, virtualPlayerName: VirtualPlayerName): Promise<void> {
        if (await this.isSameName(virtualPlayerName, collection)) {
            throw new Error('Ce nom existe déjà');
        }

        return collection
            .insertOne(virtualPlayerName)
            .then(() => {
                /* do nothing */
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async deleteVirtualPlayerName(collection: Collection<VirtualPlayerName>, name: string): Promise<void> {
        return collection
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

    async updateVirtualPlayerName(collection: Collection<VirtualPlayerName>, nameToUpdateId: ObjectId, updateName: string): Promise<void> {
        if (await this.isSameName({ _id: new ObjectId(), name: updateName }, collection)) {
            throw new Error('Ce nom existe déjà');
        }

        const filterSameId: Filter<VirtualPlayerName> = { _id: new ObjectId(nameToUpdateId) };
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return collection
            .findOneAndUpdate(filterSameId, { $set: { name: updateName } }, options)
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

    async populate(): Promise<void> {
        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).countDocuments()) === 0) {
            for (const virtualPlayerName of this.originalBeginnerVirtualPlayerNames) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(virtualPlayerName);
            }
        }

        if ((await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).countDocuments()) === 0) {
            for (const virtualPlayerName of this.originalExpertVirtualPlayerNames) {
                await this.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]).insertOne(virtualPlayerName);
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
                this.populate();
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
