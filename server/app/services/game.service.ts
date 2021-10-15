import { Game } from "@app/classes/game";
import { Service } from "typedi";
import { Collection, MongoClient } from 'mongodb';

@Service()
export class GameService {
    collection: Collection<Game>;
    client: MongoClient;

    async updateGameInfo(game: Game): Promise<string> {
            if (this.validateDrawing(game)) {
                return (
                    this.collection
                        .insertOne(game)
                        // result is of type document from mongodb which is not a type you can specify
                        // tslint:disable:no-any
                        .then((result: any) => {
                            return result.insertedId;
                        })
                        .catch((error: Error) => {
                            throw "Une erreur est survenue pour l'ajout d'un dessin : " + error;
                        })
                );
            } else {
                throw new Error('Invalid drawing');
            }
    }
    getGameInfo() {
        throw new Error('Method not implemented.');
    }
    
}