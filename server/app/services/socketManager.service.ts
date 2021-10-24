import { GameParameters } from '@app/classes/GameParameters';
import * as http from 'http';
import * as io from 'socket.io';
import { GameListManager } from './GameListManager.service';

export class SocketManager {
    private sio: io.Server;
    private gameListMan: GameListManager;
    constructor(server: http.Server) {
        this.gameListMan = new GameListManager();
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('createRoom', (game: GameParameters) => {
                this.createRoom(socket, game);
            });
        });
        setInterval(() => {}, 1000);
    }
    private createRoom(socket: io.Socket, game: any): void {
        console.log(game);
        let room = this.gameListMan.createRoom(game.name, game.timer);
        console.log(this.gameListMan.existingRooms);
        this.sio.emit('roomcreated', room);
    }
}
