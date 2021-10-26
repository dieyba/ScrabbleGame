import { Injectable } from '@angular/core';
import { GameParameters, GameRoom } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { PlayerHandler } from '@app/modules/playerHandler';
import { SocketHandler } from '@app/modules/socketHandler';
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
    private readonly server = 'http://' + window.location.hostname + ':3000';
    private socket: io.Socket;
    player: LocalPlayer;
    existingRooms: Array<GameParameters>;
    myRoom: Array<GameRoom>;
    roomInfo = { idGame: -1, capacity: 0, playersName: new Array<string>() };
    constructor() {
        this.existingRooms = new Array<GameParameters>();
        this.myRoom = new Array<GameRoom>();
        this.socket = SocketHandler.requestSocket(this.server);
        this.player = PlayerHandler.requestPlayer();
        console.log(this.player);
        console.log(this.socket.id);
        this.socket.on('roomcreated', (roomInf: GameParameters) => {
            // this.player.name = roomInf.createrPlayer.name;
            // this.player.roomId = roomInf.gameRoom.idGame;
            // this.roomInfo = roomInf.gameRoom;
            // this.myRoom.push(this.roomInfo);
            // console.log(this.roomInfo);
        });
        this.socket.emit('addPlayer', { player: this.player });
        this.socket.on('getAllGames', (game: Array<GameParameters>) => {
            this.existingRooms = game;
        });
        this.socket.on('roomdeleted', (roomInf: GameParameters) => {
            // this.player.roomId = 0;
            // console.log(this.player.roomId);
            this.socket.on('getAllGames', (game: Array<GameParameters>) => {
                this.existingRooms = game;
            });
        });
        this.socket.on('roomJoined', (game: GameParameters) => {
            // this.existingRooms = game;
            console.log('catch');
            this.roomInfo = game.gameRoom;
        });
        // });
    }
    getList(): GameParameters[] {
        return this.existingRooms;
    }
    public createRoom(game: GameParameters): void {
        this.socket.emit('createRoom', { name: game.createrPlayer.name, timer: game.totalCountDown });
    }
    public deleteRoom(): void {
        this.socket.emit('deleteRoom');
    }
    public start(game: GameParameters, name: string): void {
        console.log(this.socket);
        this.socket.emit('joinRoom', { game: game.gameRoom.idGame, joinerName: name });
    }
    public confirmName(name: string, game: GameParameters): boolean {
        if (name != game.createrPlayer.name) {
            console.log('confirmation');
            // this.socket.emit('joinRoom', game);
            return true;
        }
        return false;
    }
}
