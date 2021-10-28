import { GameParameters } from '@app/classes/game-parameters';
import { Service } from 'typedi';

@Service()
export class GameListManager {
    existingRooms: Array<GameParameters>;
    private currentRoomID: number;
    constructor() {
        this.existingRooms = new Array<GameParameters>();
        this.currentRoomID = this.existingRooms.length;
    }

    getAllGames(): GameParameters[] {
        return this.existingRooms;
    }

    public createRoom(creator: string, timer: number): GameParameters {
        let room = this.addRoom(creator, timer);

        return room;
    }
    public addRoom(creator: string, timer: number): GameParameters {
        let newRoom = new GameParameters(creator, timer, this.currentRoomID++);
        newRoom.creatorPlayer.setRoomId(this.currentRoomID);
        newRoom.setIdGame(this.currentRoomID);
        this.existingRooms.push(newRoom);
        return newRoom;
    }
    public deleteRoom(index: number): void {
        if (index > -1) {
            this.existingRooms.splice(index, 1);
        }
    }
}
