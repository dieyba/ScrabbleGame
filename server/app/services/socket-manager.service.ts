import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import * as http from 'http';
import * as io from 'socket.io';
import { GameListManager } from './game-list-manager.service';
import { PlayerManagerService } from './player-manager.service';
import { ValidationService } from './validation.service';

export class SocketManagerService {
    private sio: io.Server;
    private gameListMan: GameListManager;
    playerMan: PlayerManagerService;
    constructor(server: http.Server, private readonly validationService: ValidationService) {
        this.gameListMan = new GameListManager(this.validationService);
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

            socket.on('validateWords', (newWords: string[]) => {
                this.validateWords(socket, newWords);
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
                if (messageToOpponent !== undefined) {
                    this.displayDifferentChatEntry(socket, message, messageToOpponent);
                } else {
                    this.displayChatEntry(socket, message);
                }
            });
            socket.on('sendSystemChatEntry', (message: string) => {
                this.displaySystemChatEntry(socket, message);
            });
            socket.on('getAllGames', (game: Array<GameParameters>) => {
                this.getAllGames(socket);
            });
            socket.on('reset timer', (timerMs: number) => {
                this.resetTimer(socket);
            });
            socket.on('updateTurnsPassed', (isCurrentTurnedPassed: boolean, hasTurnsBeenPassed: boolean[]) => {
                this.increaseHasTurnsPassed(socket, isCurrentTurnedPassed, hasTurnsBeenPassed);
            });
            socket.on('endGame', () => {
                this.endGame(socket);
            });
            socket.on('playerQuit', () => {
                this.displayPlayerQuitMessage(socket);
            });
            socket.on('disconnect', (roomId: any) => {
                const playerArrayIndex = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
                this.playerMan.allPlayers.splice(playerArrayIndex, 1);
                socket.disconnect();
            })
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
        let room = this.gameListMan.createRoom(game.name, game.timer, game.isRandomBonus);
        let newPlayer = new Player(game.name, socket.id);
        newPlayer.roomId = room.gameRoom.idGame;
        room.addPlayer(newPlayer);

        // TODO: see if we can directly update info of player corresponding to socket id in playerMan
        // does room.addPlayer also add the player to playerMan?
        let index = this.playerMan.allPlayers.findIndex((p) => p.getSocketId() === socket.id);
        this.playerMan.allPlayers.splice(index, 1);
        this.playerMan.allPlayers[index] = newPlayer;

        socket.join(room.gameRoom.idGame.toString());
        this.sio.emit('roomcreated', room);
    }
    private deleteRoom(socket: io.Socket): void {
        let player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player) {
            this.gameListMan.deleteRoom(player.roomId);
        }
        this.sio.to(player.roomId.toString()).emit('roomdeleted');
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
        let roomGame = this.gameListMan.getCurrentGame(roomId);
        // this.sio.to(roomGame.gameRoom.idGame.toString()).emit('roomJoined', roomGame);
        if (roomGame) {
            const starterPlayerIndex = Math.round(Math.random());
            roomGame.players[starterPlayerIndex].isActive = true;
            this.sio.to(roomGame.gameRoom.idGame.toString()).emit('updateInfo', roomGame);
        }
    }

    private validateWords(socket: io.Socket, newWords: string[]) {
        const result = this.gameListMan.validateNewWords(newWords);
        console.log("Is word valid : " + result);
        this.sio.to(socket.id).emit('areWordsValid', result);
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
        const opponent = this.gameListMan.getOtherPlayer(senderId, sender.roomId);
        if (opponent) {
            const opponentId = opponent.getSocketId();
            const chatEntrySender = { senderName: sender.name, message: messageToSender };
            const chatEntryOpponent = { senderName: sender.name, message: messageToOpponent };
            this.sio.to(senderId).emit('addChatEntry', chatEntrySender);
            this.sio.to(opponentId).emit('addChatEntry', chatEntryOpponent);
        }
    }
    private displayPlayerQuitMessage(socket: io.Socket) {
        const senderId = socket.id;
        const sender = this.playerMan.getPlayerBySocketID(senderId);
        const opponent = this.gameListMan.getOtherPlayer(senderId, sender.roomId);
        if (opponent) {
            const message = sender.name + ' a quitté le jeu';
            this.sio.to(opponent.getSocketId()).emit('addSystemChatEntry', message);
        }

    }
    private displaySystemChatEntry(socket: io.Socket, message: string) {
        const roomId = this.playerMan.getPlayerBySocketID(socket.id).roomId.toString();
        this.sio.in(roomId).emit('addSystemChatEntry', message);
    }
    private increaseHasTurnsPassed(socket: io.Socket, isCurrentTurnedPassed: boolean, hasTurnsBeenPassed: boolean[]) {
        const roomId = this.playerMan.getPlayerBySocketID(socket.id).roomId.toString();
        hasTurnsBeenPassed.push(isCurrentTurnedPassed);
        this.sio.in(roomId).emit('increaseTurnsPassed', hasTurnsBeenPassed);
    }
    private endGame(socket: io.Socket) {
        const roomId = this.playerMan.getPlayerBySocketID(socket.id).roomId.toString();
        this.sio.in(roomId).emit('gameEnded');
    }
}
