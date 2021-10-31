import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import * as http from 'http';
import * as io from 'socket.io';
import { GameListManager } from './game-list-manager.service';
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
            socket.on('createRoom', (game: GameParameters) => {
                this.createRoom(socket, game);
                console.log('creatorplayer:', socket.id);
                this.getAllGames(socket);
            });

            socket.on('deleteRoom', (game: any) => {
                this.deleteRoom(socket);
                this.getAllGames(socket);
            });
            socket.on('addPlayer', (player: any, game: any) => {
                this.addPlayer(socket, player);
                this.getAllGames(socket);
            });
            socket.on('joinRoom', (game: any) => {
                this.joinRoom(socket, game);
                this.getAllGames(socket);
            });
            socket.on('initializeGame', (roomId: number) => {
                this.initializeGame(socket, roomId);
            });
            // socket.on('startGame', (roomId: number) => {
            //     // this.startGame(socket,)
            // });
            socket.on('sendChatEntry', (message: string, messageToOpponent?: string) => {
                // TODO: fix sending different message if its command exchange
                if (messageToOpponent !== undefined) {
                    this.displayDifferentChatEntry(socket, message, messageToOpponent);
                } else {
                    this.displayChatEntry(socket, message);
                }
            });
            socket.on('getAllGames', (game: Array<GameParameters>) => {
                this.getAllGames(socket);
            });
            socket.on('reset timer', (timerMs: number) => {
                this.resetTimer(socket);
            });
        });
        setInterval(() => {}, 1000);
    }
    private resetTimer(socket: io.Socket) {
        let commandSender = this.playerMan.getPlayerBySocketID(socket.id);
        if (commandSender) {
            let roomId = commandSender.roomId;
            let roomGame = this.gameListMan.getCurrentGame(roomId);
            if (roomGame) {
                this.sio.to(roomId.toString()).emit('timer reset', roomGame.totalCountDown);
            }
        }
    }

    private createRoom(socket: io.Socket, game: any): void {
        let room = this.gameListMan.createRoom(game.name, game.timer);
        let newPlayer = new Player(game.name, socket.id);
        newPlayer.roomId = room.gameRoom.idGame;
        room.addPlayer(newPlayer);

        // TODO: see if we can directly update info of player corresponding to socket id in playerMan
        // does room.addPlayer also add the player to playerMan?
        let index = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        this.playerMan.allPlayers.splice(index, 1);
        this.playerMan.allPlayers[index] = newPlayer;

        socket.join(room.gameRoom.idGame.toString());
        this.sio.emit('roomcreated', game);
    }
    private deleteRoom(socket: io.Socket): void {
        let player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player) {
            this.gameListMan.deleteRoom(player.roomId);
        }
        // this.sio.emit('roomdeleted');
    }
    private getAllGames(socket: io.Socket) {
        this.sio.emit('getAllGames', this.gameListMan.existingRooms);
    }
    private addPlayer(socket: io.Socket, player: any) {
        this.playerMan.addPlayer(player.player.name, socket.id);
    }
    private joinRoom(socket: io.Socket, game: any) {
        let joiner = this.playerMan.getPlayerBySocketID(socket.id);
        let roomGame = this.gameListMan.getGameFromExistingRooms(game.gameId);
        if (joiner && roomGame) {
            joiner.name = game.joinerName;
            joiner.roomId = roomGame.gameRoom.idGame;
            roomGame.addPlayer(joiner);
            this.gameListMan.currentGames.push(roomGame);
            socket.join(roomGame.gameRoom.idGame.toString());
            this.sio.to(roomGame.gameRoom.idGame.toString()).emit('roomJoined', roomGame);
        }
    }
    private initializeGame(socket: io.Socket, roomId: number) {
        let roomGame = this.gameListMan.getCurrentGame(roomId); // or should it come from existingRooms[]?
        // this.sio.to(roomGame.gameRoom.idGame.toString()).emit('roomJoined', roomGame);
        if (roomGame) {
            this.sio.to(roomGame.gameRoom.idGame.toString()).emit('updateInfo', roomGame);
        }
    }

    private displayChatEntry(socket: io.Socket, message: string) {
        const sender = this.playerMan.getPlayerBySocketID(socket.id);
        const senderName = sender.name;
        const roomId = sender.roomId.toString();
        const chatEntry = { senderName: senderName, message: message };
        this.sio.in(roomId).emit('addChatEntry', chatEntry);
    }
    private displayDifferentChatEntry(socket: io.Socket, messageToSender: string, messageToOpponent: string) {
        const senderId = socket.id;
        const sender = this.playerMan.getPlayerBySocketID(senderId);
        const roomId = sender.roomId;
        const opponent = this.gameListMan.getOtherPlayer(senderId, roomId);
        if (opponent) {
            const opponentId = opponent.getSocketId();
            const chatEntrySender = { senderName: sender.name, message: messageToSender };
            const chatEntryOpponent = { senderName: sender.name, message: messageToOpponent };
            this.sio.to(senderId).emit('addChatEntry', chatEntrySender);
            this.sio.to(opponentId).emit('addChatEntry', chatEntryOpponent);
        }
    }
}
