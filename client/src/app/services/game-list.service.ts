import { Injectable } from '@angular/core';
import { PendingGameParameters } from '@app/classes/game-parameters';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GameListService {
    pendingGamesRooms: PendingGameParameters[];
    localRoomInfo: PendingGameParameters;
    private readonly server: string;
    private socket: io.Socket;

    constructor() {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.pendingGamesRooms = new Array<PendingGameParameters>();
        this.socket.on('getAllPendingGames', (game: PendingGameParameters[]) => {
            this.pendingGamesRooms = game;
        });
    }
    getList(): PendingGameParameters[] {
        return this.pendingGamesRooms;
    }
    // TODO: see if need to add more detail when creating room
    createRoom(gameParams: PendingGameParameters): void {
        this.socket.emit('createRoom', {
            creatorName: gameParams.creatorName,
            dictionaryType: gameParams.dictionaryType,
            timer: gameParams.totalCountDown,
            isRandomBonus: gameParams.isRandomBonus,
        });
    }
    deleteRoom(): void {
        this.socket.emit('deleteRoom');
    }
    start(game: PendingGameParameters, name: string): void {
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
