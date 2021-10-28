import { Injectable } from '@angular/core';
import { GameParameters, GameRoom } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { PlayerHandler } from '@app/modules/player-handler';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class GameListService {
    private readonly server = 'http://' + window.location.hostname + ':3000';
    private socket: io.Socket;
    isStarting: boolean;
    player: LocalPlayer;
    existingRooms: GameParameters[];
    players: Array<LocalPlayer>;
    myRoom: GameRoom[];
    roomInfo: GameParameters;
    roomInf = { idGame: -1, capacity: 0, playersName: new Array<string>() };

    constructor() {
        this.existingRooms = new Array<GameParameters>();
        this.myRoom = new Array<GameRoom>();
        this.socket = SocketHandler.requestSocket(this.server);
        this.player = PlayerHandler.requestPlayer();
        this.roomInfo = new GameParameters('', 0);
        this.players = new Array<LocalPlayer>();
        this.roomInfo.gameRoom = { idGame: -1, capacity: 0, playersName: new Array<string>() };
        this.socket.emit('addPlayer', { player: this.player });
        this.socket.on('getAllGames', (game: GameParameters[]) => {
            this.existingRooms = game;
        });
        this.socket.on('roomJoined', (game: GameParameters) => {
            this.roomInfo = game;
            this.roomInfo.gameRoom = game.gameRoom;
            this.players = game.players;
            console.log(this.players);
        });
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
        this.socket.emit('joinRoom', { game: game.gameRoom.idGame, joinerName: name });
    }
    initializeGame(roomId: number) {
        this.socket.emit('initializeGame', roomId);
    }
    // confirmName(name: string, game: GameParameters): boolean {
    //     if (name !== game.creatorPlayer.name) {
    //         console.log('confirmation');
    //         return true;
    //     }
    //     return false;
    // }
}
