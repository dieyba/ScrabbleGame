import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { Service } from 'typedi';

@Service()
export class GameListManager {
    existingRooms: GameParameters[];
    currentGames: GameParameters[];
    currentRoomID: number;
    constructor() {
        this.existingRooms = new Array<GameParameters>();
        this.currentGames = new Array<GameParameters>();
        this.currentRoomID = this.existingRooms.length;
    }

    getAllGames(): GameParameters[] {
        return this.existingRooms;
    }
    getGameFromExistingRooms(roomID: number): GameParameters | undefined {
        const game = this.existingRooms.find((r) => r.gameRoom.idGame === roomID);
        if (game) {
            return game;
        }
        return undefined;
    }
    getCurrentGame(roomID: number): GameParameters | undefined {
        const game = this.currentGames.find((r) => r.gameRoom.idGame === roomID);
        if (game) {
            return game;
        }
        return undefined;
    }
    getOtherPlayer(playerID: string, roomId: number): Player | undefined {
        const game = this.getCurrentGame(roomId);
        if (game) {
            return game.players[0].socketId === playerID ? game.players[1] : game.players[0];
        }
        return undefined;
    }

    createRoom(game: GameParameters): GameParameters {
        const room = this.addRoom(game);
        return room;
    }
    addRoom(game: GameParameters): GameParameters {
        game.creatorPlayer.roomId = game.gameRoom.idGame;
        this.existingRooms.push(game);
        return game;
    }
    deleteExistingRoom(roomId: number): void {
        const index = this.existingRooms.findIndex((r) => r.gameRoom.idGame === roomId);
        if (index > -1) {
            this.existingRooms.splice(index, 1);
        }
    }
}
