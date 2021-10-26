import { Injectable } from '@angular/core';
import { GameParameters, GameRoom } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { PlayerHandler } from '@app/modules/player-handler';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
// export interface Game {
//     creatorName: string;
//     dictionary: string;
//     timer: number;
// }

@Injectable({
    providedIn: 'root',
})
export class GameListService {
    /* TODO: en commentaire est à supprimer?
    //     const urlString = `http://${window.location.hostname}:5020`;
    // const socket = io(urlString);
    // private readonly HOST_NAME = 'http://' + window.location.hostname;
    // private readonly SERVER_PORT = ':3000';
    // gameList: Array<GameParameters>;
    // dictionary: Dictionary;
    // randomBonus: boolean;
    // totalCountDown: number;
    */
    private readonly server = 'http://' + window.location.hostname + ':3000';
    private socket: io.Socket;
    player: LocalPlayer;
    existingRooms: GameParameters[];
    myRoom: GameRoom[];
    roomInfo = { idGame: -1, capacity: 0, playersName: new Array<string>() };

    constructor() {
        this.existingRooms = new Array<GameParameters>();
        this.myRoom = new Array<GameRoom>();
        this.socket = SocketHandler.requestSocket(this.server);
        this.player = PlayerHandler.requestPlayer();
        console.log(this.player);
        console.log(this.socket.id);
        this.socket.on('roomcreated', (roomInf: GameParameters) => {
            // this.player.name = roomInf.creatorPlayer.name;
            // this.player.roomId = roomInf.gameRoom.idGame;
            // this.roomInfo = roomInf.gameRoom;
            // this.myRoom.push(this.roomInfo);
            // console.log(this.roomInfo);
        });
        this.socket.emit('addPlayer', { player: this.player });
        this.socket.on('getAllGames', (game: GameParameters[]) => {
            this.existingRooms = game;
        });
        this.socket.on('roomdeleted', (roomInf: GameParameters) => {
            // this.player.roomId = 0;
            // console.log(this.player.roomId);
            this.socket.on('getAllGames', (game: GameParameters[]) => {
                this.existingRooms = game;
            });
        });
        this.socket.on('roomJoined', (game: GameParameters) => {
            // this.existingRooms = game;
            console.log('catch');
            this.roomInfo = game.gameRoom;
            this.socket.emit('deleteRoom');
        });
        // });
    }
    getList(): GameParameters[] {
        return this.existingRooms;
    }
    createRoom(game: GameParameters): void {
        this.socket.emit('createRoom', { name: game.creatorPlayer.name, timer: game.totalCountDown });
    }
    deleteRoom(): void {
        this.socket.emit('deleteRoom');
    }
    start(game: GameParameters, name: string): void {
        console.log(this.socket);
        this.socket.emit('joinRoom', { game: game.gameRoom.idGame, joinerName: name });
    }
    confirmName(name: string, game: GameParameters): boolean {
        if (name !== game.creatorPlayer.name) {
            console.log('confirmation');
            // this.socket.emit('joinRoom', game);
            return true;
        }
        return false;
    }
}
