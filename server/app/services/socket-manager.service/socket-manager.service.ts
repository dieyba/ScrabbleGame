/* eslint-disable max-lines */ // TODO Remove this eslint-disable and fix the 350 line error
import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { GameInitInfo, GoalType, WaitingAreaGameParameters } from '@app/classes/game-parameters/game-parameters';
import { BoardUpdate, ERROR_NUMBER, LettersUpdate } from '@app/classes/utilities/utilities';
import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { GameListManager } from '@app/services/game-list-manager.service/game-list-manager.service';
import { PlayerManagerService } from '@app/services/player-manager.service/player-manager.service';
import { ValidationService } from '@app/services/validation.service/validation.service';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service/virtual-player-name.service';
import * as http from 'http';
import * as io from 'socket.io';
const DISCONNECT_TIME_INTERVAL = 5000;

export class SocketManagerService {
    private sio: io.Server;
    private validationService: ValidationService;
    private virtualPlayerNameService: VirtualPlayerNameService;
    private playerMan: PlayerManagerService;
    constructor(server: http.Server, private gameListMan: GameListManager) {
        this.playerMan = new PlayerManagerService();
        this.validationService = new ValidationService();
        this.virtualPlayerNameService = new VirtualPlayerNameService();
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('addPlayer', () => {
                this.playerMan.addPlayer(socket.id);
            });

            socket.on('createWaitingAreaRoom', async (gameParams: WaitingAreaGameParameters) => {
                await this.createWaitingAreaRoom(socket, gameParams);
                this.getAllWaitingAreaGames(socket, gameParams.isLog2990);
            });

            socket.on('deleteWaitingAreaRoom', () => {
                this.deleteWaitingAreaRoom(socket);
                this.getAllWaitingAreaGames(socket, this.getIsLog2990FromId(socket.id));
            });

            socket.on('joinWaitingAreaRoom', (joinerName: string, roomToJoinId: number, isLog2990: boolean) => {
                this.joinRoom(socket, joinerName, roomToJoinId, isLog2990);
                this.getAllWaitingAreaGames(socket, isLog2990);
            });

            socket.on('initializeMultiPlayerGame', () => {
                this.initializeMultiPlayerGame(socket);
            });

            socket.on('getAllWaitingAreaGames', (isLog2990: boolean) => {
                this.getAllWaitingAreaGames(socket, isLog2990);
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
                // TODO return error in case there is not player attached to socket and if there is no room attached to player?
                const player = this.playerMan.getPlayerBySocketID(socket.id);
                if (player === undefined) return;

                const game = this.gameListMan.getGameInPlay(player.roomId);
                if (game === undefined) return;

                this.validateWords(socket, newWords, game.dictionary);
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

            socket.on('achieve goal', (goalAchieved: GoalType) => {
                const sender = this.playerMan.getPlayerBySocketID(socket.id);
                if (sender === undefined) {
                    return;
                }
                const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId);
                if (opponent !== undefined) {
                    this.sio.to(opponent.socketId).emit('goal achieved', goalAchieved);
                }
            });

            socket.on('change turn', (isCurrentTurnedPassed: boolean, consecutivePassedTurns: number) => {
                this.changeTurn(socket, isCurrentTurnedPassed, consecutivePassedTurns);
            });
        });
    }

    private getIsLog2990FromId(id: string): boolean {
        const room = this.playerMan.getPlayerBySocketID(id)?.roomId;
        if (room === undefined) {
            return false;
        }
        const waitingArea = this.gameListMan.getAWaitingAreaGame(room);
        if (waitingArea !== undefined) return waitingArea.isLog2990;
        return false;
    }

    private async createWaitingAreaRoom(socket: io.Socket, gameParams: WaitingAreaGameParameters): Promise<void> {
        try {
            const newRoom = await this.gameListMan.createWaitingAreaGame(gameParams, socket.id);
            const creatorPlayer = this.playerMan.getPlayerBySocketID(socket.id);
            if (creatorPlayer !== undefined) {
                creatorPlayer.name = newRoom.creatorName;
                creatorPlayer.roomId = newRoom.gameRoom.idGame;
                socket.join(newRoom.gameRoom.idGame.toString());
                this.sio.emit('waitingAreaRoomCreated', newRoom);
            }
        } catch (e) {
            this.sio.emit('failToGetDictionary', e);
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
            .getVirtualPlayerNames(this.virtualPlayerNameService.beginnersCollection)
            .then((virtualPlayerNames: VirtualPlayerName[]) => {
                let newVirtualPlayerName: string;
                do {
                    const randomNewNameIndex = Math.floor(Math.random() * virtualPlayerNames.length);
                    newVirtualPlayerName = virtualPlayerNames[randomNewNameIndex].name;
                } while (roomGame.players[0].name === newVirtualPlayerName);
                this.sio.to(roomGame.gameRoomId.toString()).emit('convert to solo', socket.id, newVirtualPlayerName);
                this.gameListMan.deleteGameInPlay(roomGame.gameRoomId);
            })
            .catch(() => {
                // If database is not available, provides a default name for the virtual player
                const defaultVirtualPlayerName = ['Erika', 'Étienne', 'Sara'];
                let opponentPlayerName: string;
                do {
                    const randomPlayerId: number = Math.floor(Math.random() * defaultVirtualPlayerName.length);
                    opponentPlayerName = defaultVirtualPlayerName[randomPlayerId];
                } while (roomGame.players[0].name === opponentPlayerName);
                this.sio.to(roomGame.gameRoomId.toString()).emit('convert to solo', socket.id, opponentPlayerName);
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
        this.getAllWaitingAreaGames(socket, this.getIsLog2990FromId(socket.id));
        this.sio.to(waitingAreaRoom.gameRoom.idGame.toString()).emit('roomLeft', waitingAreaRoomUpdate);
    }

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

    private getAllWaitingAreaGames(socket: io.Socket, isLog2990: boolean) {
        const senderId = socket.id;
        this.sio.to(senderId).emit('updateWaitingAreaGames', this.gameListMan.getAllWaitingAreaGames(isLog2990));
    }

    private joinRoom(socket: io.Socket, joinerName: string, roomToJoinId: number, isLog2990: boolean) {
        const joiner = this.playerMan.getPlayerBySocketID(socket.id);
        if (joiner === undefined) {
            return;
        }
        const waitingAreaGame = this.gameListMan.getAWaitingAreaGame(roomToJoinId);
        if (waitingAreaGame === undefined) {
            return;
        }
        if (this.gameListMan.addJoinerPlayer(waitingAreaGame, joinerName, socket.id, isLog2990)) {
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

    private validateWords(socket: io.Socket, newWords: string[], dictionary: DictionaryInterface) {
        const result = this.validationService.validateWords(newWords, dictionary);
        this.sio.to(socket.id).emit('areWordsValid', result);
        if (!result) {
            return;
        }
        const sender = this.playerMan.getPlayerBySocketID(socket.id);
        if (sender === undefined) {
            return;
        }
        const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId);
        if (opponent !== undefined) {
            this.sio.to(opponent.socketId).emit('newValidWords', newWords);
        }
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
