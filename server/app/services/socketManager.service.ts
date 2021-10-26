import { GameParameters } from '@app/classes/game-parameters';
import { PlaceParams } from '@app/classes/place-parameters';
import * as http from 'http';
import * as io from 'socket.io';
import { GameService } from './game.service';
import { GameListManager } from './GameListManager.service';

export class SocketManager {
    private sio: io.Server;
    private gameListMan: GameListManager;
    constructor(server: http.Server, private readonly gameService: GameService) {
        this.gameListMan = new GameListManager();
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('creatoroom', (game: GameParameters) => {
                this.creatoroom(socket, game);
            });

            socket.on('placeLetter', (game: GameParameters, placeParams: PlaceParams) => {
                this.gameService.placeLetter(game, placeParams);
            });
        });
        setInterval(() => {}, 1000);
    }
    private creatoroom(socket: io.Socket, game: any): void {
        console.log(game);
        let room = this.gameListMan.creatoroom(game.name, game.timer);
        console.log(this.gameListMan.existingRooms);
        this.sio.emit('roomcreated', room);
    }
}
