import { GameInitInfo, WaitingAreaGameParameters } from '@app/classes/game-parameters/game-parameters';
import { ERROR_NUMBER } from '@app/classes/utilities/utilities';
import { DictionaryDBService } from '@app/services/dictionary-db.service/dictionary-db.service';
import { Service } from 'typedi';
@Service()
export class GameListManager {
    private currentId: number;
    private waitingAreaGames: WaitingAreaGameParameters[];
    private gamesInPlay: GameInitInfo[];
    constructor(private dictionaryDBService: DictionaryDBService) {
        this.waitingAreaGames = new Array<WaitingAreaGameParameters>();
        this.gamesInPlay = new Array<GameInitInfo>();
        this.currentId = 0;
    }

    getAllWaitingAreaGames(isLog2990: boolean): WaitingAreaGameParameters[] {
        const games: WaitingAreaGameParameters[] = [];
        this.waitingAreaGames.forEach((game) => {
            if (isLog2990 && game.isLog2990) {
                games.push(game);
            } else if (!isLog2990 && !game.isLog2990) {
                games.push(game);
            }
        });
        return games;
    }

    getAWaitingAreaGame(roomID: number): WaitingAreaGameParameters | undefined {
        const game = this.waitingAreaGames.find((r) => r.gameRoom.idGame === roomID);
        if (game !== undefined) {
            return game;
        }
        return undefined;
    }

    async createWaitingAreaGame(game: WaitingAreaGameParameters, creatorSocketId: string): Promise<WaitingAreaGameParameters> {
        return this.dictionaryDBService
            .getDictionary(game.dictionary.title)
            .then((dictionary) => {
                game.dictionary = dictionary;
                game.gameRoom.idGame = this.currentId;
                game.gameRoom.creatorId = creatorSocketId;
                game.gameRoom.playersName = [game.creatorName];
                this.waitingAreaGames.push(game);
                this.currentId++;
                return game;
            })
            .catch((e) => {
                throw e;
            });
    }

    addJoinerPlayer(game: WaitingAreaGameParameters, joinerName: string, joinerSocketId: string, isLog2990: boolean): boolean {
        if (game.gameRoom.playersName.length < game.gameRoom.capacity && game.isLog2990 === isLog2990) {
            game.joinerName = joinerName;
            game.gameRoom.joinerId = joinerSocketId;
            game.gameRoom.playersName = [game.creatorName, joinerName];
            return true;
        }
        return false;
    }

    removeJoinerPlayer(roomId: number): WaitingAreaGameParameters | undefined {
        const waitingAreaRoom = this.getAWaitingAreaGame(roomId);
        if (waitingAreaRoom !== undefined) {
            waitingAreaRoom.gameRoom.joinerId = '';
            waitingAreaRoom.joinerName = '';
            waitingAreaRoom.gameRoom.playersName = [waitingAreaRoom.creatorName];
        }
        return waitingAreaRoom;
    }

    deleteWaitingAreaGame(roomId: number): void {
        const index = this.waitingAreaGames.findIndex((r) => r.gameRoom.idGame === roomId);
        if (index > ERROR_NUMBER) {
            this.waitingAreaGames.splice(index, 1);
        }
    }

    getGameInPlay(roomID: number): GameInitInfo | undefined {
        const game = this.gamesInPlay.find((r) => r.gameRoomId === roomID);
        if (game !== undefined) {
            return game;
        }
        return undefined;
    }

    createGameInPlay(clientParametersChosen: WaitingAreaGameParameters): GameInitInfo {
        const newGame = new GameInitInfo(clientParametersChosen);
        this.gamesInPlay.push(newGame);
        return newGame;
    }

    deleteGameInPlay(roomId: number): void {
        const index = this.gamesInPlay.findIndex((r) => r.gameRoomId === roomId);
        if (index !== ERROR_NUMBER) {
            this.gamesInPlay.splice(index, 1);
        }
    }
}
