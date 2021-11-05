import { Injectable } from '@angular/core';
import { GameParameters, GameRoom, GameType } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class GameListService {
    isStarting: boolean;
    player: LocalPlayer;
    existingRooms: GameParameters[];
    players: LocalPlayer[];
    myRoom: GameRoom[];
    roomInfo: GameParameters;
    full: boolean;
    private readonly server: string;
    private socket: io.Socket;

    constructor(private gameService: GameService) {
        this.server = 'http://' + window.location.hostname + ':3000';
        this.existingRooms = new Array<GameParameters>();
        this.myRoom = new Array<GameRoom>();
        this.socket = SocketHandler.requestSocket(this.server)
        this.player = new LocalPlayer('');
        this.players = new Array<LocalPlayer>();
        this.full = false;
        this.socket.emit('addPlayer', this.player);
        this.socket.on('getAllGames', (game: GameParameters[]) => {
            this.existingRooms = game;
        });
    }
    getList(): GameParameters[] {
        return this.existingRooms;
    }

    createRoom(game: GameParameters): void {
        this.socket.emit('createRoom', {
            name: game.creatorPlayer.name,
            timer: game.totalCountDown,
            board: game.randomBonus,
            creatorLetters: game.creatorPlayer.letters,
            opponentLetters: game.opponentPlayer.letters,
            stock: game.stock
        });
    }
    deleteRoom(): void {
        this.socket.emit('deleteRoom');
    }
    start(game: GameParameters, name: string): void {
        this.gameService.initializeGameType(GameType.MultiPlayer);
        this.socket.emit('joinRoom', { gameId: game.gameRoom.idGame, joinerName: name });
    }
    initializeGame(roomId: number) {
        this.socket.emit('initializeGame', roomId);
    }
    someoneLeftRoom() {
        this.socket.emit('leaveRoom')
    }
}
