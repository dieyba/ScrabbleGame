import { WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { ERROR_NUMBER } from '@app/classes/utilities';
import * as http from 'http';
import * as io from 'socket.io';
import { GameListManager } from './game-list-manager.service';
import { PlayerManagerService } from './player-manager.service';
import { ValidationService } from './validation.service';

export class SocketManagerService {
    private sio: io.Server;
    private gameListMan: GameListManager;
    private validationService: ValidationService;
    private playerMan: PlayerManagerService;
    constructor(
        server: http.Server,
    ) {
        this.gameListMan = new GameListManager();
        this.playerMan = new PlayerManagerService();
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('addPlayer', () => {
                this.playerMan.addPlayer(socket.id);
                this.getAllWaitingAreaGames(socket);
            });
            socket.on('createWaitingAreaRoom', (gameParams: WaitingAreaGameParameters) => {
                this.createWaitingAreaRoom(socket, gameParams);
                this.getAllWaitingAreaGames(socket);
            });
            socket.on('deleteWaitingAreaRoom', () => {
                this.deleteWaitingAreaRoom(socket);
                this.getAllWaitingAreaGames(socket);
            });
            socket.on('joinWaitingAreaRoom', (joinerName: string, roomToJoinId: number) => {
                this.joinRoom(socket, joinerName, roomToJoinId);
                this.getAllWaitingAreaGames(socket);
            });
            socket.on('initializeMultiPlayerGame', () => {
                this.initializeMultiPlayerGame(socket);
            });
            socket.on('getAllWaitingAreaGames', () => {
                this.getAllWaitingAreaGames(socket);
            });
            socket.on('leaveRoom', () => {
                this.leaveRoom(socket);
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
            socket.on('endGame', () => {
                this.endGame(socket);
            });
            socket.on('playerQuit', () => {
                this.displayPlayerQuitMessage(socket);
            });
            socket.on('disconnect', () => {
                this.disconnect(socket)
            });
            socket.on('exchange letters', (update: any) => {
                let sender = this.playerMan.getPlayerBySocketID(socket.id);
                if (sender === undefined) {
                    return;
                }
                const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId)
                if (opponent !== undefined) {
                    this.sio.to(opponent.socketId).emit('letters exchange', update);
                }
            });
            socket.on('validateWords', (newWords: string[]) => {
                this.validateWords(socket, newWords);
            });
            socket.on('word placed', (word: any) => {
                let sender = this.playerMan.getPlayerBySocketID(socket.id);
                if (sender === undefined) {
                    return;
                }
                const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId)
                if (opponent !== undefined) {
                    this.sio.to(opponent.socketId).emit('update board', word);
                }
            });
            socket.on('place word', (update: any) => {
                // let sender = this.playerMan.getPlayerBySocketID(socket.id) as Player;
                // const opponent = this.gameListMan.getOtherPlayerInRoom(sender.socketId, sender.roomId) as Player;
                // this.sio.to(opponent.socketId).emit('update place', update);
            });
            socket.on('change turn', (isCurrentTurnedPassed: boolean, consecutivePassedTurns: number) => {
                this.changeTurn(socket, isCurrentTurnedPassed, consecutivePassedTurns);
            });
        });
        setInterval(() => {}, 1000);
    }
    private disconnect(socket: io.Socket) {
        setTimeout(() => {
            this.leaveRoom(socket);
        }, 5000);
    }
    private createWaitingAreaRoom(socket: io.Socket, gameParams: WaitingAreaGameParameters): void {
        // TODO: make a verification to prevent creation if player already part of a room?
        let newRoom = this.gameListMan.createWaitingAreaGame(gameParams, socket.id);
        let creatorPlayer = this.playerMan.getPlayerBySocketID(socket.id);
        if (creatorPlayer !== undefined) {
            // update player info in the player manager
            creatorPlayer.name = newRoom.creatorName;
            creatorPlayer.roomId = newRoom.gameRoom.idGame;
            socket.join(newRoom.gameRoom.idGame.toString());
            this.sio.emit('waitingAreaRoomCreated', newRoom);
        }
    }
    // TODO: to test see if leaving/deleting a game in waiting or game in play room works 
    private deleteWaitingAreaRoom(socket: io.Socket): void {
        let player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player === undefined) {
            return;
        }
        let roomGame = this.gameListMan.getAWaitingAreaGame(player.roomId);
        if (roomGame !== undefined) {
            this.gameListMan.deleteWaitingAreaGame(player.roomId);
            this.sio.emit('waitingAreaRoomDeleted', roomGame);
        }
    }
    private leaveRoom(socket: io.Socket) {
        let player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player === undefined) {
            return;
        }
        let roomGame = this.gameListMan.getGameInPlay(player.roomId);
        if (roomGame !== undefined) {
            // the room to leave is a game in play
            roomGame.removePlayer(socket.id);
            if (roomGame.players.length === 0) {
                // if no one is left in the room, delete it from the game list manager
                this.gameListMan.deleteGameInPlay(roomGame.gameRoomId);
            } else {
                // if one player left, send notice message to the remaining player and make them the winner
                this.displayPlayerQuitMessage(socket);
                this.sio.to(roomGame.gameRoomId.toString()).emit('roomLeft', roomGame);
            }
        } else {
            // the room to leave is a waiting area game
            this.deleteWaitingAreaRoom(socket);
            this.getAllWaitingAreaGames(socket) // updates the clients' waiting area's game list
        }
        socket.leave(player.roomId.toString());
    }
    private getAllWaitingAreaGames(socket: io.Socket) {
        this.sio.emit('updateWaitingAreaGames', this.gameListMan.getAllWaitingAreaGames());
    }
    private joinRoom(socket: io.Socket, joinerName: string, roomToJoinId: number) {
        // TODO: make a verification to prevent creation if player already part of a room?
        let joiner = this.playerMan.getPlayerBySocketID(socket.id);
        if (joiner === undefined) {
            return;
        }
        let waitingAreaGame = this.gameListMan.getAWaitingAreaGame(roomToJoinId);
        if (waitingAreaGame === undefined) {
            return;
        }
        if (this.gameListMan.addJoinerPlayer(waitingAreaGame, joinerName, socket.id)) {
            // update player info in the player manager
            joiner.name = joinerName;
            joiner.roomId = waitingAreaGame.gameRoom.idGame;
            socket.join(waitingAreaGame.gameRoom.idGame.toString());
            this.sio.to(waitingAreaGame.gameRoom.idGame.toString()).emit('roomJoined', waitingAreaGame);
        }

    }
    private initializeMultiPlayerGame(socket: io.Socket) {
        const creatorPlayer = this.playerMan.getPlayerBySocketID(socket.id);
        if (creatorPlayer === undefined) {
            return;
        }
        let waitingAreaGame = this.gameListMan.getAWaitingAreaGame(creatorPlayer.roomId);
        if (waitingAreaGame === undefined) {
            return;
        }
        let clientInitParams = this.gameListMan.createGameInPlay(waitingAreaGame);
        // // TODO: Normally this should be done before, go see if it is done. And check game room id too ig
        // if (newGame.players[0].name === waitingAreaGame.creatorName) {
        //     newGame.players[0].socketId = waitingAreaGame.gameRoom.creatorId;
        //     newGame.players[1].socketId = waitingAreaGame.gameRoom.joinerId;
        // } else {
        //     newGame.players[1].socketId = waitingAreaGame.gameRoom.creatorId;
        //     newGame.players[0].socketId = waitingAreaGame.gameRoom.joinerId;
        // }
        this.sio.to(waitingAreaGame.gameRoom.idGame.toString()).emit('initClientGame', clientInitParams);
    }

    // All chat display related methods are only used by multiplayer games
    private displayChatEntry(socket: io.Socket, message: string) {
        const sender = this.playerMan.getPlayerBySocketID(socket.id);
        if (sender === undefined) {
            return;
        }
        if (sender.roomId !== ERROR_NUMBER) {
            const chatEntry = { senderName: sender.name, message: message };
            this.sio.in(sender.roomId.toString()).emit('addChatEntry', chatEntry);
        }
    }
    // used when the messages to display are different depending on the client it is emitted to
    private displayDifferentChatEntry(socket: io.Socket, messageToSender: string, messageToOpponent: string) {
        const senderId = socket.id;
        const sender = this.playerMan.getPlayerBySocketID(senderId);
        if (sender === undefined) {
            return;
        }
        const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(senderId);
        if (opponent === undefined) {
            return;
        }
        if (opponent.socketId !== undefined) {
            const chatEntrySender = { senderName: sender.name, message: messageToSender };
            const chatEntryOpponent = { senderName: sender.name, message: messageToOpponent };
            this.sio.to(senderId).emit('addChatEntry', chatEntrySender);
            this.sio.to(opponent.socketId).emit('addChatEntry', chatEntryOpponent);
        }
    }
    private displayPlayerQuitMessage(socket: io.Socket) {
        const sender = this.playerMan.getPlayerBySocketID(socket.id);
        if (sender === undefined) {
            return;
        }
        const gameRoom = this.gameListMan.getGameInPlay(sender.roomId);
        if (gameRoom === undefined) {
            return;
        }
        const opponent = gameRoom.getOtherPlayerInRoom(socket.id);
        if (opponent !== undefined || gameRoom.gameRoomId === ERROR_NUMBER) {
            const message = sender.name + ' a quitté le jeu';
            this.sio.to(gameRoom.gameRoomId.toString()).emit('addSystemChatEntry', message);
        }
    }
    private displaySystemChatEntry(socket: io.Socket, message: string) {
        const player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player === undefined) {
            return;
        }
        if (player.roomId !== ERROR_NUMBER) {
            this.sio.in(player.roomId.toString()).emit('addSystemChatEntry', message);
        }
    }
    private validateWords(socket: io.Socket, newWords: string[]) {
        const result = this.validationService.validateWords(newWords);
        this.sio.to(socket.id).emit('areWordsValid', result);
    }
    private changeTurn(socket: io.Socket, isCurrentTurnedPassed: boolean, consecutivePassedTurns: number) {
        const player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player === undefined) {
            return;
        }
        if (player.roomId !== ERROR_NUMBER) {
            if (isCurrentTurnedPassed) {
                consecutivePassedTurns++;
            } else {
                consecutivePassedTurns = 0;
            }
            this.sio.in(player.roomId.toString()).emit('turn changed', isCurrentTurnedPassed, consecutivePassedTurns);
        }
    }
    private endGame(socket: io.Socket) {
        const player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player === undefined) {
            return;
        }
        if (player.roomId !== ERROR_NUMBER) {
            this.sio.in(player.roomId.toString()).emit('gameEnded');
        }
    }
}
