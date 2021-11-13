import { GameInitInfo, WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { Service } from 'typedi';
@Service()
export class GameListManager {
    private currentId: number; //TODO: refactor how we give an id number to avoid going to the inifite with the numbers?
    private waitingAreaGames: WaitingAreaGameParameters[];
    private gamesInPlay: GameInitInfo[];
    constructor() {
        this.waitingAreaGames = new Array<WaitingAreaGameParameters>();
        this.gamesInPlay = new Array<GameInitInfo>();
        this.currentId = 0;
    }
    getAllWaitingAreaGames(): WaitingAreaGameParameters[] {
        return this.waitingAreaGames;
    }
    getAWaitingAreaGame(roomID: number): WaitingAreaGameParameters | undefined {
        const game = this.waitingAreaGames.find((r) => r.gameRoom.idGame === roomID);
        if (game) {
            return game;
        }
        return undefined;
    }
    createWaitingAreaGame(game: WaitingAreaGameParameters, creatorSocketId: string): WaitingAreaGameParameters {
        game.gameRoom.idGame = this.currentId;
        game.gameRoom.creatorId = creatorSocketId;
        game.gameRoom.playersName = [game.creatorName];
        this.waitingAreaGames.push(game);
        this.currentId++;
        return game;
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
            this.waitingAreaGames.splice(index, 1);
        }
    }
}
