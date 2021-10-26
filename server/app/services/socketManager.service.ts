import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import * as http from 'http';
import * as io from 'socket.io';
import { GameListManager } from './GameListManager.service';
import { PlayerManagerService } from './player-manager.service';

export class SocketManager {
    private sio: io.Server;
    private gameListMan: GameListManager;
    playerMan: PlayerManagerService;
    constructor(server: http.Server /*, private readonly gameService: GameService*/) {
        this.gameListMan = new GameListManager();
        this.playerMan = new PlayerManagerService();
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('creatoroom', (game: GameParameters,  gameList: Array<GameParameters>) => {
                this.createRoom(socket, game);
                this.getAllGames(socket, gameList);
            });

            // socket.on('placeLetter', (game: GameParameters, placeParams: PlaceParams) => {
            //     this.gameService.placeLetter(game, placeParams);
            // });
            
            socket.on('deleteRoom', (game: any) => {
                this.deleteRoom(socket);
                this.getAllGames(socket, game);
            });
            socket.on('addPlayer', (player: any, game: any) => {
                this.addPlayer(socket, player);
                this.getAllGames(socket, game);
            });
            socket.on('joinRoom', (game: any) => {
                console.log('socket');
                this.joinRoom(socket, game);
                // this.getAllGames(socket, game);
            });
            // socket.on('confirmName', (name: string) => {
            //     this.confirmName(socket, name);
            //     // this.addPlayer(socket, player);
            //     // this.getAllGames(socket, game);
            // });
            // socket.on('getAllGames', (game: Array<GameParameters>) => {
            //     this.getAllGames(socket, game);
            // });
        });
        setInterval(() => {}, 1000);
    }
    private createRoom(socket: io.Socket, game: any): void {
        let room = this.gameListMan.createRoom(game.name, game.timer);
        let index = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        // console.log(index);
        let newPlayer = new Player(game.name, socket.id);
        newPlayer.setRoomId(room.gameRoom.idGame);
        // console.log(newPlayer.name + 'newPlayer.name');
        this.playerMan.allPlayers.splice(index, 1);
        this.playerMan.allPlayers[index] = newPlayer;
        // this.allPlayers.push(newPlayer);
        // console.log(this.gameListMan.existingRooms);
        // console.log(this.gameListMan.existingRooms[0].gameRoom.playersName[0]);
        // console.log(this.gameListMan.existingRooms);
        // console.log(socket.id + 'creation');
        this.sio.emit('roomcreated', room);
    }
    private deleteRoom(socket: io.Socket): void {
        let player = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        // console.log(player);
        if (player > -1) {
            let room = this.gameListMan.existingRooms.findIndex((p) => p.gameRoom.idGame === this.playerMan.allPlayers[player].getRoomId());
            // console.log(this.playerMan.allPlayers);
            this.gameListMan.deleteRoom(room);
        }
        // console.log(this.gameListMan.existingRooms);
        // console.log(this.gameListMan.existingRooms[0].gameRoom.playersName[0]);
        // console.log(socket.id + 'suppression');
        // console.log(gameIndex);

        this.sio.emit('roomdeleted');
    }
    private getAllGames(socket: io.Socket, game: any) {
        game = this.gameListMan.existingRooms;
        // console.log(game);
        this.sio.emit('getAllGames', game);
    }
    private addPlayer(socket: io.Socket, player: any) {
        this.playerMan.addPlayer(player.player.name, socket.id);
        // console.log(this.playerMan.allPlayers);
    }
    // private confirmName(socket: io.Socket, name: string) {}
    private joinRoom(socket: io.Socket, game: any) {
        let joinerIndex = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        this.playerMan.allPlayers[joinerIndex].name = game.joinerName;
        let room = this.gameListMan.existingRooms.findIndex((r) => r.gameRoom.idGame === game.game);
        // console.log(this.playerMan.allPlayers.length);
        let roomGame = this.gameListMan.existingRooms[room];
        this.playerMan.allPlayers[joinerIndex].setRoomId(roomGame.gameRoom.idGame);
        this.gameListMan.existingRooms[room].setPlayerName(this.playerMan.allPlayers[joinerIndex].name);
        // console.log(this.gameListMan.existingRooms[room].gameRoom.playersName);
        socket.join(roomGame.gameRoom.idGame.toString());
        this.sio.emit('roomJoined', roomGame);
    }
}
