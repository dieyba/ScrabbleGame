import { Injectable } from '@angular/core';
import { WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GameListService {
    waitingAreaGames: WaitingAreaGameParameters[];
    localPlayerRoomInfo: WaitingAreaGameParameters;
    private readonly server: string;
    private socket: io.Socket;

    constructor() {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.waitingAreaGames = new Array<WaitingAreaGameParameters>();
        this.socket.emit('addPlayer');
        this.socket.on('updateWaitingAreaGames', (game: WaitingAreaGameParameters[]) => {
            this.waitingAreaGames = game;
        });
    }
    getList(): WaitingAreaGameParameters[] {
        return this.waitingAreaGames;
    }
    createRoom(gameParams: WaitingAreaGameParameters): void {
        this.socket.emit('createWaitingAreaRoom', gameParams);
    }
    deleteRoom(): void {
        this.socket.emit('deleteWaitingAreaRoom');
    }
    start(game: WaitingAreaGameParameters, name: string): void {
        this.socket.emit('joinWaitingAreaRoom', name, game.gameRoom.idGame);
    }
    initializeMultiplayerGame() {
        this.socket.emit('initializeMultiPlayerGame');
    }
    someoneLeftRoom() {
        this.socket.emit('leaveRoom');
    }
}
