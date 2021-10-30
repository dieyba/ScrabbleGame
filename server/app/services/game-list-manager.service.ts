import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { Service } from 'typedi';

@Service()
export class GameListManager {
    existingRooms: Array<GameParameters>;
    currentGames: Array<GameParameters>;
    private currentRoomID: number;
    constructor() {
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
    public createRoom(creator: string, timer: number): GameParameters {
        let room = this.addRoom(creator, timer);

        return room;
    }
    public addRoom(creator: string, timer: number): GameParameters {
        let newRoom = new GameParameters(creator, timer, this.currentRoomID++);
        newRoom.creatorPlayer.roomId = this.currentRoomID;
        newRoom.setIdGame(this.currentRoomID);
        this.existingRooms.push(newRoom);
        return newRoom;
    }
    public deleteRoom(roomId: number): void {
        const index = this.existingRooms.findIndex((r) => r.gameRoom.idGame === roomId)
        if (index > -1) {
            this.existingRooms.splice(index, 1);
        }
    }
}
