import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Service } from 'typedi';

const DATABASE_URL = 'mongodb+srv://admin304:Scrabble304@cluster-304.msic1.mongodb.net/Scrabble?retryWrites=true&w=majority';
const DATABASE_NAME = 'Scrabble';
const DATABASE_COLLECTION = 'Games';

@Service()
export class DataBaseService {
    collection: Collection<String>;
    client: MongoClient;
    localGamesId: ObjectId[] = [];

    start(): void {
        MongoClient.connect(DATABASE_URL).then((client: MongoClient) => {
            this.client = client;
            this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        });
    }

    closeConnection(): void {
        this.client.close();
    }
}
