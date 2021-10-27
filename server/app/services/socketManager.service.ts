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
            socket.on('createRoom', (game: GameParameters, gameList: Array<GameParameters>) => {
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
            socket.on('initializeGame', (roomId: number) => {
                this.initializeGame(socket, roomId);
            });
            // socket.on('confirmName', (name: string) => {
            //     this.confirmName(socket, name);
            //     // this.addPlayer(socket, player);
            //     // this.getAllGames(socket, game);
            // });
            socket.on('sendChatEntry', (message:string) => {
                console.log('client sent a new message');
                this.displayChatEntry(socket, message);
            });
            socket.on('getAllGames', (game: Array<GameParameters>) => {
                this.getAllGames(socket, game);
            });
        });
        setInterval(() => {}, 1000);
    }
    private createRoom(socket: io.Socket, game: any): void {
        let room = this.gameListMan.createRoom(game.name, game.timer);
        let index = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        let newPlayer = new Player(game.name, socket.id);
        newPlayer.roomId = room.gameRoom.idGame;
        room.addPlayer(newPlayer);
        this.playerMan.allPlayers.splice(index, 1);
        this.playerMan.allPlayers[index] = newPlayer;
        socket.join(room.gameRoom.idGame.toString());
        this.sio.emit('roomcreated', room);
    }
    private deleteRoom(socket: io.Socket): void {
        let player = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        if (player > -1) {
            let room = this.gameListMan.existingRooms.findIndex((p) => p.gameRoom.idGame === this.playerMan.allPlayers[player].roomId);
            // console.log(this.playerMan.allPlayers);
            this.gameListMan.deleteRoom(room);
        }

        this.sio.emit('roomdeleted');
    }
    private getAllGames(socket: io.Socket, game: any) {
        game = this.gameListMan.existingRooms;
        this.sio.emit('getAllGames', game);
    }
    private addPlayer(socket: io.Socket, player: any) {
        this.playerMan.addPlayer(player.player.name, socket.id);
    }
    private joinRoom(socket: io.Socket, game: any) {
        let joinerIndex = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        this.playerMan.allPlayers[joinerIndex].name = game.joinerName;
        let room = this.gameListMan.existingRooms.findIndex((r) => r.gameRoom.idGame === game.game);
        let roomGame = this.gameListMan.existingRooms[room];
        this.playerMan.allPlayers[joinerIndex].roomId = roomGame.gameRoom.idGame;
        // this.gameListMan.existingRooms[room].setPlayerName(this.playerMan.allPlayers[joinerIndex].name);
        let newPlayer = new Player(game.joinerName, socket.id);
        newPlayer.roomId = roomGame.gameRoom.idGame;
        roomGame.addPlayer(newPlayer);
        // // console.log(this.gameListMan.existingRooms[room].gameRoom.playersName);
        // console.log(socket.id);
        // console.log(roomGame.gameRoom.idGame.toString());
        // console.log(this.gameListMan.existingRooms[room].gameRoom.playersName);
        // console.log(this.gameListMan.existingRooms[room + 1].gameRoom.playersName);
        socket.join(roomGame.gameRoom.idGame.toString());
        this.sio.to(roomGame.gameRoom.idGame.toString()).emit('roomJoined', roomGame);
        this.sio.emit('updateInfo', roomGame.players);
    }
    private initializeGame(socket: io.Socket, roomId: number) {
        // let room = this.gameListMan.existingRooms.findIndex((r) => r.gameRoom.idGame === roomId);
        // let roomGame = this.gameListMan.existingRooms[room];
        // socket.emit('updateInfo', roomGame.players);
    }

    private displayChatEntry(socket: io.Socket, message:string){
        const senderId = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        const sender = this.playerMan.allPlayers[senderId];
        const senderName = sender.name;
        const roomId = sender.roomId.toString();
        const chatEntry = {senderName: senderName,message: message}
        this.sio.in(roomId).emit('addChatEntry',chatEntry);
    };
}
