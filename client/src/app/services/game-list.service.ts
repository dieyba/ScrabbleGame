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
        this.socket.on('getWaitingAreaGames', (game: WaitingAreaGameParameters[]) => {
            this.waitingAreaGames = game;
        });
    }
    getList(): WaitingAreaGameParameters[] {
        return this.waitingAreaGames;
    }
    // TODO: see if need to add more detail when creating room
    createRoom(gameParams: WaitingAreaGameParameters): void {
        this.socket.emit('createRoom', gameParams);
    }
    deleteRoom(): void {
        this.socket.emit('deleteRoom');
    }
    start(game: WaitingAreaGameParameters, name: string): void {
        // TODO: to rename
        this.socket.emit('joinRoom', { gameId: game.gameRoom.idGame });
    }
    // TODO: what does this do?
    initializeGame(roomId: number) {
        this.socket.emit('initializeGame', roomId);
    }
    someoneLeftRoom() {
        this.socket.emit('leaveRoom');
    }
}
