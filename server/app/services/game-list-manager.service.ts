import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { Service } from 'typedi';
import { ValidationService } from './validation.service';

@Service()
export class GameListManager {
    existingRooms: Array<GameParameters>;
    currentGames: Array<GameParameters>;
    currentRoomID: number;
    constructor(private validationService: ValidationService) {
        this.existingRooms = new Array<GameParameters>();
        this.currentGames = new Array<GameParameters>();
        this.currentRoomID = this.existingRooms.length;
    }

    getAllGames(): GameParameters[] {
        return this.existingRooms;
    }
    getGameFromExistingRooms(roomID: number): GameParameters | undefined {
        return this.existingRooms.find((r) => r.gameRoom.idGame === roomID);
    }
    getCurrentGame(roomID: number): GameParameters | undefined {
        return this.currentGames.find((r) => r.gameRoom.idGame === roomID);
    }
    getOtherPlayer(playerID: string, roomId: number): Player | undefined {
        const game = this.getCurrentGame(roomId);
        if (game) {
            return game.players[0].getSocketId() === playerID ? game.players[1] : game.players[0];
        }
        return undefined;
    }
    public validateNewWords(newWords: string[]): boolean {
        if (this.validationService.validateWords(newWords)) {
            return true;
        } else {
            return false
        }
    }
    public createRoom(game: GameParameters): GameParameters {
        let room = this.addRoom(game);
        return room;
    }
    public addRoom(game: GameParameters): GameParameters {
        ;
        game.creatorPlayer.roomId = game.gameRoom.idGame;
        game.setIdGame(game.gameRoom.idGame);
        this.existingRooms.push(game);
        return game;
    }
    public deleteRoom(roomId: number): void {
        const index = this.existingRooms.findIndex((r) => r.gameRoom.idGame === roomId)
        if (index > -1) {
            this.existingRooms.splice(index, 1);
        }
    }
}
