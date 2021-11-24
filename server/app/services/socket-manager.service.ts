import { GameInitInfo, WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { BoardUpdate, ERROR_NUMBER, LettersUpdate } from '@app/classes/utilities';
import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import * as http from 'http';
import * as io from 'socket.io';
import { GameListManager } from './game-list-manager.service';
import { PlayerManagerService } from './player-manager.service';
import { ValidationService } from './validation.service';

const DISCONNECT_TIME_INTERVAL = 5000;

export class SocketManagerService {
    private sio: io.Server;
    private gameListMan: GameListManager;
    private validationService: ValidationService;
    private virtualPlayerNameService: VirtualPlayerNameService;
    private playerMan: PlayerManagerService;
    constructor(server: http.Server) {
        this.gameListMan = new GameListManager();
        this.playerMan = new PlayerManagerService();
        this.validationService = new ValidationService();
        this.virtualPlayerNameService = new VirtualPlayerNameService();
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('addPlayer', () => {
                this.playerMan.addPlayer(socket.id);
                this.getAllWaitingAreaGames();
            });
            socket.on('createWaitingAreaRoom', (gameParams: WaitingAreaGameParameters) => {
                this.createWaitingAreaRoom(socket, gameParams);
                this.getAllWaitingAreaGames();
            });
            // This is only called when creating a game in play
            socket.on('deleteWaitingAreaRoom', () => {
                this.deleteWaitingAreaRoom(socket);
                this.getAllWaitingAreaGames();
            });
            socket.on('joinWaitingAreaRoom', (joinerName: string, roomToJoinId: number) => {
                this.joinRoom(socket, joinerName, roomToJoinId);
                this.getAllWaitingAreaGames();
            });
            socket.on('initializeMultiPlayerGame', () => {
                this.initializeMultiPlayerGame(socket);
            });
            socket.on('getAllWaitingAreaGames', () => {
                this.getAllWaitingAreaGames();
            });
            socket.on('leaveRoom', () => {
                this.leaveRoom(socket);
            });
            socket.on('disconnect', () => {
                this.disconnect(socket);
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
            socket.on('exchange letters', (update: LettersUpdate) => {
                const sender = this.playerMan.getPlayerBySocketID(socket.id);
                if (sender === undefined) {
                    return;
                }
                const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId);
                if (opponent !== undefined) {
                    this.sio.to(opponent.socketId).emit('update letters', update);
                }
            });
            socket.on('validateWords', (newWords: string[]) => {
                this.validateWords(socket, newWords);
            });
            socket.on('word placed', (word: BoardUpdate) => {
                const sender = this.playerMan.getPlayerBySocketID(socket.id);
                if (sender === undefined) {
                    return;
                }
                const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId);
                if (opponent !== undefined) {
                    this.sio.to(opponent.socketId).emit('update board', word);
                }
            });
            socket.on('place word', (update: LettersUpdate) => {
                const sender = this.playerMan.getPlayerBySocketID(socket.id);
                if (sender === undefined) {
                    return;
                }
                const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId);
                if (opponent !== undefined) {
                    this.sio.to(opponent.socketId).emit('update letters', update);
                }
            });
            socket.on('change turn', (isCurrentTurnedPassed: boolean, consecutivePassedTurns: number) => {
                this.changeTurn(socket, isCurrentTurnedPassed, consecutivePassedTurns);
            });
        });
    }
    private createWaitingAreaRoom(socket: io.Socket, gameParams: WaitingAreaGameParameters): void {
        const newRoom = this.gameListMan.createWaitingAreaGame(gameParams, socket.id);
        const creatorPlayer = this.playerMan.getPlayerBySocketID(socket.id);
        if (creatorPlayer !== undefined) {
            // update player info in the player manager
            creatorPlayer.name = newRoom.creatorName;
            creatorPlayer.roomId = newRoom.gameRoom.idGame;
            socket.join(newRoom.gameRoom.idGame.toString());
            this.sio.emit('waitingAreaRoomCreated', newRoom);
        }
    }
    private disconnect(socket: io.Socket) {
        setTimeout(() => {
            this.leaveRoom(socket);
            this.playerMan.removePlayer(socket.id);
        }, DISCONNECT_TIME_INTERVAL);
    }
    private leaveRoom(socket: io.Socket) {
        const leavingPlayer = this.playerMan.getPlayerBySocketID(socket.id);
        if (leavingPlayer === undefined) {
            return;
        }
        const leavingPlayerRoomId = leavingPlayer.roomId;
        const waitingAreaRoom = this.gameListMan.getAWaitingAreaGame(leavingPlayerRoomId);
        const roomGame = this.gameListMan.getGameInPlay(leavingPlayerRoomId);
        if (roomGame !== undefined) {
            this.leaveGameInPlay(socket, roomGame);
        } else if (waitingAreaRoom !== undefined) {
            this.leaveWaitingAreaRoom(socket, waitingAreaRoom);
        }
        leavingPlayer.resetPlayer();
        socket.leave(leavingPlayerRoomId.toString());
    }
    private leaveGameInPlay(socket: io.Socket, roomGame: GameInitInfo) {
        roomGame.removePlayer(socket.id);
        this.displayPlayerQuitMessage(socket);
        this.virtualPlayerNameService
            .getBeginnersVirtualPlayerNames()
            .then((virtualPlayerNames: VirtualPlayerName[]) => {
                const randomNewNameIndex = Math.floor(Math.random() * virtualPlayerNames.length);
                const newVirtualPlayerName = virtualPlayerNames[randomNewNameIndex].name;
                this.sio.to(roomGame.gameRoomId.toString()).emit('convert to solo', socket.id, newVirtualPlayerName);
                this.gameListMan.deleteGameInPlay(roomGame.gameRoomId);
            })
            .catch(() => {
                // If database is not available, provides a default name for the virtual player
                const defaultVirtualPlayerName = 'Sara';
                this.sio.to(roomGame.gameRoomId.toString()).emit('convert to solo', socket.id, defaultVirtualPlayerName);
                this.gameListMan.deleteGameInPlay(roomGame.gameRoomId);
            });
    }
    private leaveWaitingAreaRoom(socket: io.Socket, waitingAreaRoom: WaitingAreaGameParameters) {
        const roomId = waitingAreaRoom.gameRoom.idGame;
        if (socket.id === waitingAreaRoom.gameRoom.joinerId) {
            this.gameListMan.removeJoinerPlayer(roomId);
        } else {
            this.deleteWaitingAreaRoom(socket);
        }
        const waitingAreaRoomUpdate = this.gameListMan.getAWaitingAreaGame(roomId);
        this.getAllWaitingAreaGames();
        this.sio.to(waitingAreaRoom.gameRoom.idGame.toString()).emit('roomLeft', waitingAreaRoomUpdate);
    }
    // Only removes the waiting area room from the waiting area rooms list in game manager service
    private deleteWaitingAreaRoom(socket: io.Socket): void {
        const player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player === undefined) {
            return;
        }
        const roomGame = this.gameListMan.getAWaitingAreaGame(player.roomId);
        if (roomGame !== undefined) {
            const roomId = roomGame.gameRoom.idGame;
            this.gameListMan.deleteWaitingAreaGame(roomId);
            this.sio.emit('waitingAreaRoomDeleted', roomGame);
        }
    }
    private getAllWaitingAreaGames() {
        this.sio.emit('updateWaitingAreaGames', this.gameListMan.getAllWaitingAreaGames());
    }
    private joinRoom(socket: io.Socket, joinerName: string, roomToJoinId: number) {
        const joiner = this.playerMan.getPlayerBySocketID(socket.id);
        if (joiner === undefined) {
            return;
        }
        const waitingAreaGame = this.gameListMan.getAWaitingAreaGame(roomToJoinId);
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
        const waitingAreaGame = this.gameListMan.getAWaitingAreaGame(creatorPlayer.roomId);
        if (waitingAreaGame === undefined) {
            return;
        }
        const clientInitParams = this.gameListMan.createGameInPlay(waitingAreaGame);
        this.sio.to(waitingAreaGame.gameRoom.idGame.toString()).emit('initClientGame', clientInitParams);
    }
    // All chat display related methods are only used by multiplayer games
    private displayChatEntry(socket: io.Socket, message: string) {
        const sender = this.playerMan.getPlayerBySocketID(socket.id);
        if (sender === undefined) {
            return;
        }
        if (sender.roomId !== ERROR_NUMBER) {
            const chatEntry = { senderName: sender.name, message };
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
    private displaySystemChatEntry(socket: io.Socket, message: string) {
        const player = this.playerMan.getPlayerBySocketID(socket.id);
        if (player === undefined) {
            return;
        }
        if (player.roomId !== ERROR_NUMBER) {
            this.sio.in(player.roomId.toString()).emit('addSystemChatEntry', message);
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
        if (gameRoom.gameRoomId !== ERROR_NUMBER) {
            const message = sender.name + ' a quitté le jeu';
            this.sio.to(gameRoom.gameRoomId.toString()).emit('addSystemChatEntry', message);
        }
    }
    private validateWords(socket: io.Socket, newWords: string[]) {
        const result = this.validationService.validateWords(newWords);
        // eslint-disable-next-line no-console
        console.log(newWords, ' is valid:', result);
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
            this.sio.in(player.roomId.toString()).emit('turn changed', consecutivePassedTurns);
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
