/* eslint-disable */ // TODO Remove and fix lint errors
import { GameParameters, GAME_CAPACITY, WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import * as http from 'http';
import * as io from 'socket.io';
import { GameListManager } from './game-list-manager.service';
import { GameService } from './game-service';
import { PlayerManagerService } from './player-manager.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

export class SocketManagerService {
    private sio: io.Server;
    private gameListMan: GameListManager;
    private validationService: ValidationService;
    private wordBuilderService: WordBuilderService;
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
            socket.on('initializeSoloGame', (clientParametersChosen: WaitingAreaGameParameters) => {
                this.initializeSoloGame(socket, clientParametersChosen);
            });
            socket.on('getAllWaitingAreaGames', (game: Array<GameParameters>) => {
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
            socket.on('playerQuit', () => {
                this.displayPlayerQuitMessage(socket);
            });
            socket.on('disconnect', () => {
                this.disconnect(socket)
            });
            // TODO: see how exchange, place, pass turn are going to work between client/server
            // but normally, every game service is the one who will emit to its own room?
            // socket.on('exchange letters', (update: any) => {
            //     let sender = this.playerMan.getPlayerBySocketID(socket.id);
            //     if (sender === undefined) {
            //         return;
            //     }
            //     const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId)
            //     if (opponent !== undefined) {
            //         this.sio.to(opponent.socketId).emit('letters exchange', update);
            //     }
            // });
            // socket.on('validateWords', (newWords: string[]) => {
            //     this.validateWords(socket, newWords);
            // });
            // socket.on('word placed', (word: any) => {
            //     let sender = this.playerMan.getPlayerBySocketID(socket.id);
            //     if (sender === undefined) {
            //         return;
            //     }
            //     const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.getOtherPlayerInRoom(sender.socketId)
            //     if (opponent !== undefined) {
            //         this.sio.to(opponent.socketId).emit('update board', word);
            //     }
            // });
            // socket.on('place word', (update: any) => {
            //     let sender = this.playerMan.getPlayerBySocketID(socket.id) as Player;
            //     const opponent = this.gameListMan.getOtherPlayerInRoom(sender.socketId, sender.roomId) as Player;
            //     this.sio.to(opponent.socketId).emit('update place', update);
            // });
            // socket.on('change turn', (isCurrentTurnedPassed: boolean, consecutivePassedTurns: number) => {
            //     this.changeTurn(socket, isCurrentTurnedPassed, consecutivePassedTurns);
            // });
        });
        setInterval(() => {}, 1000);
    }
    private disconnect(socket: io.Socket) {
        setTimeout(() => {
            this.leaveRoom(socket);
        }, 5000);
    }
    private createWaitingAreaRoom(socket: io.Socket, gameParams: WaitingAreaGameParameters): void {
        let newRoom = this.gameListMan.createWaitingAreaGame(gameParams);
        let creatorPlayer = this.playerMan.getPlayerBySocketID(socket.id);
        if (creatorPlayer !== undefined) {
            creatorPlayer.name = gameParams.creatorName;
            creatorPlayer.roomId = gameParams.gameRoom.idGame;
            newRoom.gameRoom.creatorId = socket.id;
            socket.join(newRoom.gameRoom.idGame.toString());
            console.log(gameParams.creatorName, ' created a game in waiting of id', newRoom.gameRoom.idGame);
            this.sio.emit('waitingAreaRoomCreated', newRoom);
        }
    }
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
            roomGame.game.removePlayer(socket.id);
            if (roomGame.game.players.length === 0) {
                // if no one is left in the room, delete it from the game list manager
                this.gameListMan.deleteGameInPlay(roomGame.game.gameRoomId);
            } else {
                // if one player left, send notice message to the remaining player and make them the winner
                this.displayPlayerQuitMessage(socket);
                this.sio.to(roomGame.game.gameRoomId.toString()).emit('roomLeft', roomGame);
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
        let joiner = this.playerMan.getPlayerBySocketID(socket.id);
        if (joiner === undefined) {
            return;
        }
        let waitingAreaGame = this.gameListMan.getAWaitingAreaGame(roomToJoinId);
        if (waitingAreaGame !== undefined && waitingAreaGame.gameRoom.playersName.length < GAME_CAPACITY) {
            // TODO: move the addplayer method from game params to waiting game params
            waitingAreaGame.joinerName = joinerName;
            waitingAreaGame.gameRoom.joinerId = socket.id;
            waitingAreaGame.gameRoom.playersName.push(joinerName);
            socket.join(waitingAreaGame.gameRoom.idGame.toString());
            console.log(waitingAreaGame.joinerName, ' joined game of ', waitingAreaGame.creatorName);
            console.log('room id:', waitingAreaGame.gameRoom.idGame);
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
        const serverGameParams = new GameParameters(waitingAreaGame);
        // TODO: probably not necessary, normally the creator and joiner order should be fixed
        console.log('initializing multiplayer game id:', waitingAreaGame.gameRoom.idGame);
        if (serverGameParams.players[0].name === waitingAreaGame.creatorName) {
            serverGameParams.players[0].socketId = waitingAreaGame.gameRoom.creatorId;
            serverGameParams.players[1].socketId = waitingAreaGame.gameRoom.joinerId;
        } else {
            serverGameParams.players[1].socketId = waitingAreaGame.gameRoom.creatorId;
            serverGameParams.players[0].socketId = waitingAreaGame.gameRoom.joinerId;
        }
        const newGame = new GameService(this.validationService, this.wordBuilderService);
        this.gameListMan.addGameInPlay(newGame);
        const clientInitParams = newGame.initializeGame(serverGameParams);
        newGame.game.gameRoomId = waitingAreaGame.gameRoom.idGame;
        this.sio.to(waitingAreaGame.gameRoom.idGame.toString()).emit('initClientGame', clientInitParams);
    }

    private initializeSoloGame(socket: io.Socket, clientGameParams: WaitingAreaGameParameters) {
        const creatorPlayer = this.playerMan.getPlayerBySocketID(socket.id);
        if (creatorPlayer === undefined) {
            return;
        }
        const serverGameParams = new GameParameters(clientGameParams);
        // TODO: not really necessary, the creator player is always first in player array
        if (serverGameParams.players[0].name === clientGameParams.creatorName) {
            serverGameParams.players[0].socketId = socket.id;
        } else {
            serverGameParams.players[1].socketId = socket.id;
        }
        const newGame = new GameService(this.validationService, this.wordBuilderService);
        const clientInitParams = newGame.initializeGame(serverGameParams);
        this.gameListMan.addSoloGame(newGame);
        newGame.game.gameRoomId = clientGameParams.gameRoom.idGame;
        this.sio.to(socket.id).emit('initClientGame', clientInitParams);
    }

    private displayChatEntry(socket: io.Socket, message: string) {
        const sender = this.playerMan.getPlayerBySocketID(socket.id) as Player;
        if (sender !== undefined) {
            const senderName = sender.name;
            const roomId = sender.roomId.toString();
            const chatEntry = { senderName: senderName, message: message };
            this.sio.in(roomId).emit('addChatEntry', chatEntry);
        }
    }
    private displayDifferentChatEntry(socket: io.Socket, messageToSender: string, messageToOpponent: string) {
        const senderId = socket.id;
        const sender = this.playerMan.getPlayerBySocketID(senderId) as Player;
        const opponent = this.gameListMan.getGameInPlay(sender.roomId)?.game.getOtherPlayerInRoom(senderId);
        if (opponent !== undefined) {
            const opponentId = opponent.socketId;
            const chatEntrySender = { senderName: sender.name, message: messageToSender };
            const chatEntryOpponent = { senderName: sender.name, message: messageToOpponent };
            this.sio.to(senderId).emit('addChatEntry', chatEntrySender);
            this.sio.to(opponentId).emit('addChatEntry', chatEntryOpponent);
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
        const opponent = gameRoom.game.getOtherPlayerInRoom(socket.id);
        if (opponent !== undefined) {
            const message = sender.name + ' a quitté le jeu';
            this.sio.to(gameRoom.game.gameRoomId.toString()).emit('addSystemChatEntry', message);
        }
    }
    private displaySystemChatEntry(socket: io.Socket, message: string) {
        const player = this.playerMan.getPlayerBySocketID(socket.id) as Player;
        const roomId = player.roomId.toString();
        this.sio.in(roomId).emit('addSystemChatEntry', message);
    }

    // // TODO: see how place method and validation service will work. game service will probably be the one emitting?
    // private validateWords(socket: io.Socket, newWords: string[]) {
    //     // const result = this.validationService.validateWords(newWords);
    //     // this.sio.to(socket.id).emit('areWordsValid', result);
    // }
    // private changeTurn(socket: io.Socket, isCurrentTurnedPassed: boolean, consecutivePassedTurns: number) {
    //     const player = this.playerMan.getPlayerBySocketID(socket.id) as Player;
    //     const roomId = player.roomId;
    //     if (roomId !== undefined) {
    //         if (isCurrentTurnedPassed) {
    //             consecutivePassedTurns++;
    //         } else {
    //             consecutivePassedTurns = 0;
    //         }
    //         this.sio.in(roomId.toString()).emit('turn changed', isCurrentTurnedPassed, consecutivePassedTurns);
    //     }
    // }
    // private endGame(socket: io.Socket) {
    //     const player = this.playerMan.getPlayerBySocketID(socket.id) as Player;
    //     const roomId = player.roomId.toString();
    //     this.sio.in(roomId).emit('gameEnded');
    // }
}
