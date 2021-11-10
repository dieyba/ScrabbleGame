import { WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { Service } from 'typedi';
import { GameService } from './game-service';

@Service()
export class GameListManager {
    private waitingAreaGames: WaitingAreaGameParameters[];
    private gamesInPlay: GameService[]; // why is it a bunch of gameparameters and not a bunch of gameServices?
    private soloGames: GameService[]; // should this be separate from gamesInPlay
    constructor() {
        this.waitingAreaGames = new Array<WaitingAreaGameParameters>();
        this.gamesInPlay = new Array<GameService>();
        this.soloGames = new Array<GameService>();
    }
    createSoloGame(game: GameService) {
        this.soloGames.push(game);
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
    createWaitingAreaGame(game: WaitingAreaGameParameters): WaitingAreaGameParameters {
        const newGameId = this.waitingAreaGames.length;
        game.gameRoom.idGame = newGameId;
        this.waitingAreaGames.push(game);
        return game;
    }
    deleteWaitingAreaGame(roomId: number): void {
        const index = this.waitingAreaGames.findIndex((r) => r.gameRoom.idGame === roomId);
        if (index > ERROR_NUMBER) {
            this.waitingAreaGames.splice(index, 1);
        }
    }
    getGameInPlay(roomID: number): GameService | undefined {
        const game = this.gamesInPlay.find((r) => r.game.gameRoomId === roomID);
        if (game !== undefined) {
            return game;
        }
        return undefined;
    }
    createGameInPlay(game: GameService): GameService {
        this.gamesInPlay.push(game);
        return game;
    }
    deleteGameInPlay(roomId: number): void {
        const index = this.gamesInPlay.findIndex((r) => r.game.gameRoomId === roomId);
        if (index !== ERROR_NUMBER) {
            this.waitingAreaGames.splice(index, 1);
        }
    }
}
