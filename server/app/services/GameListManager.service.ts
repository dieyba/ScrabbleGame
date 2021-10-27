import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { Service } from 'typedi';

@Service()
export class GameListManager {
    existingRooms: Array<GameParameters>;
    private currentRoomID: number;
    // clientMessages: Message[];
    constructor() {
        this.existingRooms = new Array<GameParameters>();
        this.currentRoomID = this.existingRooms.length;
        // this.clientMessages = [];
    }

    getAllGames(): GameParameters[] {
        // console.log(this.existingRooms);
        return this.existingRooms;
    }
    getGame(roomID: number): GameParameters|undefined {
        return this.existingRooms.find((r) => r.gameRoom.idGame=== roomID);
    }
    getOtherPlayer(playerID:string, roomId: number): Player|undefined{
        const game = this.getGame(roomId);
        if(game){
            return game.creatorPlayer.getSocketId() === playerID? game.opponentPlayer : game.creatorPlayer ;
        }
        return undefined;
    }
    
    // storeMessage(message: Message): void {
    //     // eslint-disable-next-line no-console
    //     console.log(message);
    //     this.clientMessages.push(message);
    // }
    

    public createRoom(creator: string, timer: number): GameParameters {
        let room = this.addRoom(creator, timer);
        //let room = this.existingRooms.find(r => (r.isAvailable(roomCapacity)))

        return room;
    }
    public addRoom(creator: string, timer: number): GameParameters {
        let newRoom = new GameParameters(creator, timer, this.currentRoomID++);
        newRoom.setPlayerName(creator);
        newRoom.creatorPlayer.roomId = this.currentRoomID;
        newRoom.setIdGame(this.currentRoomID);
        this.existingRooms.push(newRoom);

        // newRoom.creatorPlayer.roomId = newRoom.gameRoom.idGame;
        return newRoom;
    }
    public deleteRoom(index: number): void {
        // let tab: Array<string> = ['r', 'e', 'p'];
        // // console.log(this.existingRooms);
        // let indx = tab.findIndex((r) => r === 'e');
        // console.log(indx);
        // let roomIndex = this.existingRooms.findIndex((r) => r.creatorPlayer.getRoomId() === index);
        // console.log(index);
        // console.log(this.existingRooms.findIndex((r) => r.creatorPlayer.getRoomId() === index));
        // console.log(roomIndex);
        if (index > -1) {
            this.existingRooms.splice(index, 1);
        }
        // if (room !== undefined) {
        //     room.removePlayer(playerName);

        //     if (room.isEmpty()) {
        //         let index = this.existingRooms.indexOf(room);
        //         this.existingRooms.splice(index, 1);
        //     }
        // }
        // return room;
        // this.currentRoomID--;
    }
}
