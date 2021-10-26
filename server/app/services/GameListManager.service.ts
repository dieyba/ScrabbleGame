import { GameParameters } from '@app/classes/game-parameters';
import { Service } from 'typedi';

@Service()
export class GameListManager {
    existingRooms: Array<GameParameters>;
    private currentRoomID: number;

    constructor() {
        this.existingRooms = new Array<GameParameters>();
        this.currentRoomID = 0;
    }

    getAllGames(): GameParameters[] {
        return this.existingRooms;
    }

    public creatoroom(creator: string, timer: number): GameParameters {
        let room = this.addRoom(creator, timer);
        //let room = this.existingRooms.find(r => (r.isAvailable(roomCapacity)))

        return room;
    }
    public addRoom(creator: string, timer: number): GameParameters {
        let newRoom = new GameParameters(creator, timer, this.currentRoomID++);
        this.existingRooms.push(newRoom);
        newRoom.gameRoom.playersName.push(creator);

        newRoom.creatorPlayer.setRoomId(newRoom.gameRoom.idGame);
        return newRoom;
    }
}
