import { Game } from '@app/classes/game';
import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Service } from 'typedi';

const DATABASE_URL = 'mongodb+srv://admin304:Scrabble304@cluster-304.msic1.mongodb.net/Scrabble?retryWrites=true&w=majority';
const DATABASE_NAME = 'Scrabble';
const DATABASE_COLLECTION = 'Games';

@Service()
export class GameService {
    collection: Collection<Game>;
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

    async addGameInfo(game: Game): Promise<string> {
        return (
            this.collection
                .insertOne(game)
                // result is of type document from mongodb which is not a type you can specify
                // tslint:disable:no-any
                .then((result: any) => {
                    return result.insertedId;
                })
                .catch((error: Error) => {
                    throw "Une erreur est survenue pour l'ajout d'une partie : " + error;
                })
        );
    }

    async getAllGames(): Promise<Game[]> {
        return this.collection
            .find({ _id: { $in: this.localGamesId } })
            .toArray()
            .then((games: Game[]) => {
                return games;
            })
            .catch((error: Error) => {
                throw 'Une erreur est survenue dans la requête des parties : ' + error;
            });
    }
    
    updateGameInfo(id: string): void {
        this.collection.updateOne({ _id: new ObjectId(id) }, { $set: { idCopy: id } });
    }

    async deleteGame(gameId: string): Promise<void> {
        return (
            this.collection
                .findOneAndDelete({ _id: new ObjectId(gameId) })
                // .then(() => {}) must stay there with its empty () and {} or the function won't work
                // tslint:disable-next-line:no-empty
                .then(() => {})
                .catch((error: Error) => {
                    throw new Error("Une erreur est survenue pour la suppression d'une partie : " + error);
                })
        );
    }

    getGameInfo() {
        return this.collection
            .find({ _id: { $in: this.localGamesId } })
            .toArray()
            .then((games: Game[]) => {
                return games;
            })
            .catch((error: Error) => {
                throw 'Une erreur est survenue dans la requête de parties : ' + error;
            });
    }
}
