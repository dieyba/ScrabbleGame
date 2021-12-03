import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { Collection, Filter, FindOneAndUpdateOptions, MongoClient, ObjectId } from 'mongodb';
import { Service } from 'typedi';
const DATABASE_URL = 'mongodb+srv://Scrabble304:Scrabble304@cluster0.bvwkn.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = 'VirtualPlayerName';
const DATABASE_COLLECTION = ['beginners', 'experts'];

@Service()
export class VirtualPlayerNameService {
    beginnersCollection: Collection<VirtualPlayerName>;
    expertsCollection: Collection<VirtualPlayerName>;
    dbUrl: string;
    private client: MongoClient;
    private originalBeginnerVirtualPlayerNames: VirtualPlayerName[];
    private originalExpertVirtualPlayerNames: VirtualPlayerName[];

    constructor(url: string = DATABASE_URL) {
        this.dbUrl = url;
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
    }

    async clientConnection(): Promise<void> {
        return MongoClient.connect(this.dbUrl)
            .then(async (client: MongoClient) => {
                this.client = client;
                this.beginnersCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]);
                this.expertsCollection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[1]);
                await this.populate();
            })
            .catch((error) => {
                throw error;
            });
    }

    async getVirtualPlayerNames(collection: Collection<VirtualPlayerName>): Promise<VirtualPlayerName[]> {
        return await collection
            .find({})
            .toArray()
            .then((virtualPlayerName: VirtualPlayerName[]) => {
                return virtualPlayerName;
            });
    }

    async postVirtualPlayerName(collection: Collection<VirtualPlayerName>, virtualPlayerName: VirtualPlayerName): Promise<void> {
        const isSame = await this.isSameName(virtualPlayerName, collection);

        if (isSame) {
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
        return await collection
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
        const isSame = await this.isSameName({ _id: new ObjectId(), name: updateName }, collection);
        if (isSame) {
            throw new Error('Ce nom existe déjà');
        }

        const filterSameId: Filter<VirtualPlayerName> = { _id: new ObjectId(nameToUpdateId) };
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return await collection.findOneAndUpdate(filterSameId, { $set: { name: updateName } }, options).then(() => {
            return;
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
        return collection.deleteMany({}).then(() => {
            this.populate();
        });
    }
}
