/* eslint-disable */ // TODO Remove and fix lint errors
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
    private validationService: ValidationService
    constructor(server: http.Server) {
        this.gameListMan = new GameListManager();
        this.playerMan = new PlayerManagerService();
        this.validationService = new ValidationService();

        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('addPlayer', (player: Player) => {
                this.addPlayer(socket, player);
                this.getAllGames(socket);
            });
            socket.on('createRoom', (game: any) => {
                this.createRoom(socket, game);
                this.getAllGames(socket);
            });
            socket.on('validateWords', (newWords: string[]) => {
                this.validateWords(socket, newWords);
            });
            socket.on('deleteRoom', () => {
                this.deleteRoom(socket);
                this.getAllGames(socket);
            });
            socket.on('joinRoom', (game: any) => {
                this.joinRoom(socket, game);
                this.getAllGames(socket);
            });
            socket.on('initializeGame', (roomId: number) => {
                this.initializeGame(socket, roomId);
            });
            socket.on('leaveRoom', () => {
                this.leaveRoom(socket)
            });
            socket.on('getAllGames', (game: Array<GameParameters>) => {
                this.getAllGames(socket);
            });
            socket.on('word placed', (word: any) => {
                let sender = this.playerMan.getPlayerBySocketID(socket.id) as Player;
                const opponent = this.gameListMan.getOtherPlayer(sender.socketId, sender.roomId) as Player;
                this.sio.to(opponent.socketId).emit('update board', word);
            });
            socket.on('exchange letters', (update: any) => {
                let sender = this.playerMan.getPlayerBySocketID(socket.id) as Player;
                const opponent = this.gameListMan.getOtherPlayer(sender.socketId, sender.roomId) as Player;
                this.sio.to(opponent.socketId).emit('letters exchange', update);
            });
            socket.on('place word', (update: any) => {
                let sender = this.playerMan.getPlayerBySocketID(socket.id) as Player;
                const opponent = this.gameListMan.getOtherPlayer(sender.socketId, sender.roomId) as Player;
                this.sio.to(opponent.socketId).emit('update place', update);
            });
            socket.on('validateWords', (newWords: string[]) => {
                this.validateWords(socket, newWords);
            });
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
            socket.on('change turn', (isCurrentTurnedPassed: boolean, consecutivePassedTurns: number) => {
                this.changeTurn(socket, isCurrentTurnedPassed, consecutivePassedTurns);
            });
            socket.on('endGame', () => {
                this.endGame(socket);
            });
            socket.on('playerQuit', () => {
                this.displayPlayerQuitMessage(socket);
            });
            socket.on('disconnect', () => {
                this.disconnect(socket)
            });
        });
        setInterval(() => {}, 1000);
    }
    private createRoom(socket: io.Socket, game: any): void {
        let newRoom = new GameParameters(game.name, game.timer, game.board, this.gameListMan.currentRoomID++)
        newRoom.localPlayer.socketId = socket.id;
        newRoom.creatorPlayer.socketId = socket.id;
        let room = this.gameListMan.createRoom(newRoom);
        let newPlayer = new Player(game.name, socket.id);
        newPlayer.letters = game.creatorLetters;
        newPlayer.roomId = room.gameRoom.idGame;
        room.addPlayer(newPlayer);
        let emptyOpponent = new Player('', '');
        emptyOpponent.letters = game.opponentLetters;
        room.creatorPlayer.letters = game.creatorLetters;
        room.opponentPlayer = emptyOpponent;
        let index = this.playerMan.allPlayers.findIndex((p) => p.socketId === socket.id);
        this.playerMan.allPlayers.splice(index, 1);
        this.playerMan.allPlayers.push(newPlayer)
        room.stock = game.stock;
        socket.join(room.gameRoom.idGame.toString());
        this.sio.emit('roomcreated', room);
    }
    private deleteRoom(socket: io.Socket): void {
        let player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player !== undefined) {
            let roomGame = this.gameListMan.getGameFromExistingRooms(player.roomId) as GameParameters;
            this.gameListMan.deleteExistingRoom(player.roomId);
            this.sio.emit('roomdeleted', roomGame);
        }
    }
    private leaveRoom(socket: io.Socket) {
        let player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player !== undefined) {
            let roomGame = this.gameListMan.getCurrentGame(player.roomId) as GameParameters;
            if (roomGame !== undefined) {
                roomGame.gameRoom.playersName.splice(roomGame.gameRoom.playersName.indexOf(player.name), 1);
                roomGame.players.splice(roomGame.players.indexOf(player), 1);
                if (roomGame.gameRoom.playersName.length === 0) {
                    this.gameListMan.currentGames.splice(this.gameListMan.currentGames.indexOf(roomGame), 1);
                }
                else {
                    this.displayPlayerQuitMessage(socket);
                    this.sio.to(roomGame.gameRoom.idGame.toString()).emit('roomLeft', roomGame);
                }
            }
            else {
                this.deleteRoom(socket);
                this.getAllGames(socket)

            }
            socket.leave(player.roomId.toString());
        }
    }
    private disconnect(socket: io.Socket) {
        setTimeout(() => {
            this.leaveRoom(socket);
        }, 5000);
    }
    private getAllGames(socket: io.Socket) {
        this.sio.emit('getAllGames', this.gameListMan.existingRooms);
    }
    private addPlayer(socket: io.Socket, player: Player) {
        this.playerMan.addPlayer(player.name, socket.id);
    }
    private joinRoom(socket: io.Socket, game: any) {
        let joiner = this.playerMan.getPlayerBySocketID(socket.id);
        let roomGame = this.gameListMan.getGameFromExistingRooms(game.gameId);
        if (joiner && roomGame) {
            joiner.name = game.joinerName;
            joiner.roomId = roomGame.gameRoom.idGame;
            joiner.letters = roomGame.opponentPlayer.letters;
            roomGame.opponentPlayer = joiner;
            roomGame.addPlayer(joiner);
            this.gameListMan.currentGames.push(roomGame);
            socket.join(roomGame.gameRoom.idGame.toString());
            this.sio.to(roomGame.gameRoom.idGame.toString()).emit('roomJoined', roomGame);
        }
    }
    private initializeGame(socket: io.Socket, roomId: number) {
        let roomGame = this.gameListMan.getCurrentGame(roomId);
        if (roomGame) {
            const starterPlayerIndex = Math.round(Math.random());
            roomGame.players[starterPlayerIndex].isActive = true;
            this.sio.to(roomGame.gameRoom.idGame.toString()).emit('updateInfo', roomGame);
        }
    }

    private validateWords(socket: io.Socket, newWords: string[]) {
        const result = this.validationService.validateWords(newWords);
        this.sio.to(socket.id).emit('areWordsValid', result);
    }

    private displayChatEntry(socket: io.Socket, message: string) {
        const sender = this.playerMan.getPlayerBySocketID(socket.id) as Player;
        const senderName = sender.name;
        const roomId = sender.roomId.toString();
        const chatEntry = { senderName: senderName, message: message };
        this.sio.in(roomId).emit('addChatEntry', chatEntry);
    }
    private displayDifferentChatEntry(socket: io.Socket, messageToSender: string, messageToOpponent: string) {
        const senderId = socket.id;
        const sender = this.playerMan.getPlayerBySocketID(senderId) as Player;
        const opponent = this.gameListMan.getOtherPlayer(senderId, sender.roomId);
        if (opponent) {
            const opponentId = opponent.socketId;
            const chatEntrySender = { senderName: sender.name, message: messageToSender };
            const chatEntryOpponent = { senderName: sender.name, message: messageToOpponent };
            this.sio.to(senderId).emit('addChatEntry', chatEntrySender);
            this.sio.to(opponentId).emit('addChatEntry', chatEntryOpponent);
        }
    }
    private displayPlayerQuitMessage(socket: io.Socket) {
        const senderId = socket.id;
        const sender = this.playerMan.getPlayerBySocketID(senderId) as Player;
        const opponent = this.gameListMan.getOtherPlayer(senderId, sender.roomId);
        let roomGame = this.gameListMan.getCurrentGame(sender.roomId) as GameParameters;
        if (opponent) {
            const message = sender.name + ' a quitté le jeu';
            this.sio.to(roomGame.gameRoom.idGame.toString()).emit('addSystemChatEntry', message);
        }
    }
    private displaySystemChatEntry(socket: io.Socket, message: string) {
        const player = this.playerMan.getPlayerBySocketID(socket.id) as Player;
        const roomId = player.roomId.toString();
        this.sio.in(roomId).emit('addSystemChatEntry', message);
    }
    private changeTurn(socket: io.Socket, isCurrentTurnedPassed: boolean, consecutivePassedTurns: number) {
        const player = this.playerMan.getPlayerBySocketID(socket.id) as Player;
        const roomId = player.roomId;
        if (roomId !== undefined) {
            if (isCurrentTurnedPassed) {
                consecutivePassedTurns++;
            } else {
                consecutivePassedTurns = 0;
            }
            this.sio.in(roomId.toString()).emit('turn changed', isCurrentTurnedPassed, consecutivePassedTurns);
        }
    }
    private endGame(socket: io.Socket) {
        const player = this.playerMan.getPlayerBySocketID(socket.id) as Player;
        const roomId = player.roomId.toString();
        this.sio.in(roomId).emit('gameEnded');
    }
}
