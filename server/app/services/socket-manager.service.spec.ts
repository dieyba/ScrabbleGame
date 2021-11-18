/* eslint-disable max-lines */
// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable @typescript-eslint/no-unused-expressions */
// /* eslint-disable no-unused-expressions */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable max-classes-per-file */
// /* eslint-disable no-unused-vars */
// /* eslint-disable dot-notation */
// import { GameParameters } from '@app/classes/game-parameters';
// import { Player } from '@app/classes/player';
// import { assert, expect } from 'chai';
// import * as http from 'http';
// import * as sinon from 'sinon';
// import * as io from 'socket.io';
// import { GameListManager } from './game-list-manager.service';
// import { PlayerManagerService } from './player-manager.service';
// import { SocketManagerService } from './socket-manager.service';
// import { ValidationService } from './validation.service';

// class ServerMock {
//     events: Map<string, [CallableFunction, SocketMock]> = new Map();
//     on(eventName: string, cb: CallableFunction) {
//         this.events.set(eventName, [cb, new SocketMock()]);
//     }

//     triggerEvent(eventName: string) {
//         const cbAndSocket = this.events.get(eventName) as [CallableFunction, SocketMock];
//         cbAndSocket[0](cbAndSocket[1]);
//     }

//     emit(...args: any[]) {
//         return;
//     }

//     to(...args: any[]): ServerMock {
//         return new ServerMock();
//     }

//     in(...args: any[]): ServerMock {
//         return new ServerMock();
//     }
// }

// class SocketMock {
//     id: string = 'Socket mock';
//     events: Map<string, CallableFunction> = new Map();
//     on(eventName: string, cb: CallableFunction) {
//         this.events.set(eventName, cb);
//     }

//     triggerEvent(eventName: string, ...args: any[]) {
//         const arrowFunction = this.events.get(eventName) as CallableFunction;
//         arrowFunction(...args);
//     }

//     join(...args: any[]) {
//         return;
//     }

//     leave(...args: any[]) {
//         return;
//     }

//     disconnect() {
//         return;
//     }
// }

// describe('SocketManager service', () => {
//     let socketManagerService: SocketManagerService;
//     let validationServiceStub: sinon.SinonStubbedInstance<ValidationService>;
//     let httpServer: http.Server;
//     let serverMock: ServerMock;

//     beforeEach(() => {
//         validationServiceStub = sinon.createStubInstance(ValidationService);
//         httpServer = http.createServer();
//         socketManagerService = new SocketManagerService(httpServer);

//         // Mocking the server
//         serverMock = new ServerMock();
//         socketManagerService['sio'] = serverMock as unknown as io.Server;
//     });

//     it('should create socketManagerService', () => {
//         expect(socketManagerService).to.not.be.undefined;
//     });

//     it('handleSockets should register the "connection" event', () => {
//         const serverSpy = sinon.spy(socketManagerService['sio'], 'on');
//         socketManagerService.handleSockets();

//         serverSpy.restore();

//         sinon.assert.calledWith(serverSpy, 'connection');
//         expect(serverMock.events.has('connection')).to.be.true;
//     });

//     it('"word placed" should emit', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub;

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getOtherPlayer.returns(playerMock);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "word placed" event
//         socketMock.triggerEvent('word placed');

//         assert(gameListManagerStub.getOtherPlayer.called);
//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         sinon.assert.called(serverMockSpy);
//     });

//     it('"exchange letters" should emit', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub;

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getOtherPlayer.returns(playerMock);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "exchange letters" event
//         socketMock.triggerEvent('exchange letters');

//         assert(gameListManagerStub.getOtherPlayer.called);
//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         sinon.assert.called(serverMockSpy);
//     });

//     it('"place word" should emit', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub;

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getOtherPlayer.returns(playerMock);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "place word" event
//         socketMock.triggerEvent('place word');

//         assert(gameListManagerStub.getOtherPlayer.called);
//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         sinon.assert.called(serverMockSpy);
//     });

//     it('The "connection" event should at least register the "disconnection" event in a socket', () => {
//         // This should register the "connection" event
//         socketManagerService.handleSockets();

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
//         const socketSpy = sinon.spy(socketMock, 'on');

//         serverMock.triggerEvent('connection');

//         socketSpy.restore();
//         // At least register the "disconnect" event
//         sinon.assert.calledWith(socketSpy, 'disconnect');
//     });

//     it('createRoom should create the room and emit the room created', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub and spy
//         const gameMock = new GameParameters('creator', 0, false, 0);
//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.createRoom.returns(gameMock);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.allPlayers = [new Player('player1', '0'), new Player('player2', '0')];
//         socketManagerService.playerMan = playerManagerServiceStub;

//         const serverMockSpy = sinon.spy(serverMock, 'emit');

//         // "createRoom" event
//         socketMock.triggerEvent('createRoom', gameMock);

//         assert(gameListManagerStub.createRoom.called);
//         sinon.assert.calledWith(serverMockSpy);
//     });

//     it('deleteRoom should do nothing if there is no player related to room', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(undefined as unknown as Player);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const serverMockSpy = sinon.spy(serverMock, 'emit');

//         // "deleteRoom" event
//         socketMock.triggerEvent('deleteRoom');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         sinon.assert.neverCalledWith(serverMockSpy, 'roomdeleted');
//     });

//     it('deleteRoom should delete the room and emit it', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'emit');

//         // "deleteRoom" event
//         socketMock.triggerEvent('deleteRoom');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         assert(gameListManagerStub.deleteExistingRoom.called);
//         sinon.assert.called(serverMockSpy);
//     });

//     it('leaveRoom should do nothing if player === undefined', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(undefined as unknown as Player);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const serverMockSpy = sinon.spy(serverMock, 'to');
//         const deleteRoomSpy = sinon.spy(socketManagerService as any, 'deleteRoom');
//         const getAllGamesSpy = sinon.spy(socketManagerService as any, 'getAllGames');
//         const socketMockSpy = sinon.spy(socketMock, 'leave');

//         // "leaveRoom" event
//         socketMock.triggerEvent('leaveRoom');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         sinon.assert.notCalled(serverMockSpy);
//         sinon.assert.notCalled(deleteRoomSpy);
//         sinon.assert.notCalled(getAllGamesSpy);
//         sinon.assert.notCalled(socketMockSpy);
//     });

//     it('leaveRoom should delete the room and disconnect the player if the roomGame is undefined', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getCurrentGame.returns(undefined as unknown as GameParameters);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');
//         const deleteRoomSpy = sinon.spy(socketManagerService as any, 'deleteRoom');
//         const getAllGamesSpy = sinon.spy(socketManagerService as any, 'getAllGames');
//         const socketMockSpy = sinon.spy(socketMock, 'leave');

//         // "leaveRoom" event
//         socketMock.triggerEvent('leaveRoom');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         sinon.assert.notCalled(serverMockSpy);
//         sinon.assert.called(deleteRoomSpy);
//         sinon.assert.called(getAllGamesSpy);
//         sinon.assert.called(socketMockSpy);
//     });

//     it('leaveRoom should delete the room and disconnect the player if there is no one else in the game room', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameParametersStub = new GameParameters('creator', 0, false, 0);
//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.currentGames = [gameParametersStub as unknown as GameParameters];
//         gameListManagerStub.getCurrentGame.returns(gameParametersStub);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');
//         const deleteRoomSpy = sinon.spy(socketManagerService as any, 'deleteRoom');
//         const getAllGamesSpy = sinon.spy(socketManagerService as any, 'getAllGames');
//         const socketMockSpy = sinon.spy(socketMock, 'leave');

//         // "leaveRoom" event
//         socketMock.triggerEvent('leaveRoom');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         sinon.assert.notCalled(serverMockSpy);
//         sinon.assert.notCalled(deleteRoomSpy);
//         sinon.assert.notCalled(getAllGamesSpy);
//         sinon.assert.called(socketMockSpy);
//     });

//     it('leaveRoom should emit "roomLeft" if there is someone left in the room', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameParametersMock = new GameParameters('creator', 0, false, 0);
//         gameParametersMock.gameRoom.playersName = [playerMock.name, playerMock.name];
//         // gameParametersMock.players = [playerMock];
//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         // gameListManagerStub.currentGames = [gameParametersMock];
//         gameListManagerStub.getCurrentGame.returns(gameParametersMock);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');
//         const deleteRoomSpy = sinon.spy(socketManagerService as any, 'deleteRoom');
//         const getAllGamesSpy = sinon.spy(socketManagerService as any, 'getAllGames');
//         const socketMockSpy = sinon.spy(socketMock, 'leave');

//         sinon.stub(socketManagerService as any, 'displayPlayerQuitMessage');

//         // "leaveRoom" event
//         socketMock.triggerEvent('leaveRoom');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         sinon.assert.called(serverMockSpy);
//         sinon.assert.notCalled(deleteRoomSpy);
//         sinon.assert.notCalled(getAllGamesSpy);
//         sinon.assert.called(socketMockSpy);
//     });

//     it('disconnect should call "leaveRoom" after 5 seconds', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         // const leaveRoomspy = sinon.spy((socketManagerService as any).disconnect);

//         // "leaveRoom" event
//         socketMock.triggerEvent('disconnect');

//         // assert(leaveRoomspy.called, 'leaveRoom is called'); // TODO check how to make async test
//     });

//     it('getAllGames should emit with argument "getAllGames"', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'emit');

//         // "getAllGames" event
//         socketMock.triggerEvent('getAllGames');

//         sinon.assert.calledWith(serverMockSpy, 'getAllGames');
//     });

//     it('addPlayer should call the PlayerManagerService.addPlayer', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const playerMock = new Player('name', 'socketId');

//         // "addPlayer" event
//         socketMock.triggerEvent('addPlayer', playerMock);

//         assert(playerManagerServiceStub.addPlayer.calledWith(playerMock.name, socketMock.id));
//     });

//     it('joinRoom should do nothing if the player who joins and the game room are undefined', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(undefined as unknown as Player);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getGameFromExistingRooms.returns(undefined as unknown as GameParameters);
//         socketManagerService['gameListMan'] = gameListManagerStub;

//         const gameParametersMock = new GameParameters('creator', 0, false, 0);

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "joinRoom" event
//         socketMock.triggerEvent('joinRoom', gameParametersMock);

//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         assert(gameListManagerStub.getGameFromExistingRooms.called);
//         sinon.assert.notCalled(serverMockSpy);
//     });

//     it('joinRoom should emit if the player who joins and the game room exist', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameParametersMock = new GameParameters('creator', 0, false, 0);
//         gameParametersMock.opponentPlayer = playerMock;
//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getGameFromExistingRooms.returns(gameParametersMock);
//         gameListManagerStub.currentGames = [gameParametersMock];
//         socketManagerService['gameListMan'] = gameListManagerStub;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "joinRoom" event
//         socketMock.triggerEvent('joinRoom', gameParametersMock);

//         assert(playerManagerServiceStub.getPlayerBySocketID.called);
//         assert(gameListManagerStub.getGameFromExistingRooms.called);
//         sinon.assert.called(serverMockSpy);
//     });

//     it('initializeGame should do nothing if the game room is undefined', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getCurrentGame.returns(undefined as unknown as GameParameters);
//         socketManagerService['gameListMan'] = gameListManagerStub;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "initializeGame" event
//         socketMock.triggerEvent('initializeGame', 0);

//         assert(gameListManagerStub.getCurrentGame.called);
//         sinon.assert.notCalled(serverMockSpy);
//     });

//     it('initializeGame should emit if the game room is defined', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'socketId');
//         const gameParametersMock = new GameParameters('creator', 0, false, 0);
//         gameParametersMock.players = [playerMock, playerMock];

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getCurrentGame.returns(gameParametersMock);
//         socketManagerService['gameListMan'] = gameListManagerStub;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "initializeGame" event
//         socketMock.triggerEvent('initializeGame', 0);

//         assert(gameListManagerStub.getCurrentGame.called);
//         sinon.assert.called(serverMockSpy);
//     });

//     it('validateWords should validate word and send the result with emit', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         validationServiceStub.validateWords.returns(true);
//         socketManagerService['validationService'] = validationServiceStub as unknown as ValidationService;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         const wordsToValidate = ['wordOne', 'wordTwo'];

//         // "validateWords" event
//         socketMock.triggerEvent('validateWords', wordsToValidate);

//         expect(validationServiceStub.validateWords.called).to.be.true;
//         sinon.assert.called(serverMockSpy);
//     });

//     it('displayChatEntry should get player with socket.id and emit to the room by using "in"', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = 0;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const serverMockSpy = sinon.spy(serverMock, 'in');

//         const messageMock = 'myMessage';

//         // "validateWords" event
//         socketMock.triggerEvent('sendChatEntry', messageMock);

//         expect(playerManagerServiceStub.getPlayerBySocketID.called).to.be.true;
//         sinon.assert.called(serverMockSpy);
//     });

//     it('displayDifferentChatEntry should not emit if there is no opponent', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = 0;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getOtherPlayer.returns(undefined);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         const messageMock = 'myMessage';
//         const messageToOpponentMock = 'myOpponentMessage';

//         // "validateWords" event
//         socketMock.triggerEvent('sendChatEntry', messageMock, messageToOpponentMock);

//         expect(playerManagerServiceStub.getPlayerBySocketID.called).to.be.true;
//         sinon.assert.notCalled(serverMockSpy);
//     });

//     it('displayDifferentChatEntry should emit twice if there is an opponent', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = 0;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getOtherPlayer.returns(playerMock);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         const messageMock = 'myMessage';
//         const messageToOpponentMock = 'myOpponentMessage';

//         // "validateWords" event
//         socketMock.triggerEvent('sendChatEntry', messageMock, messageToOpponentMock);

//         expect(playerManagerServiceStub.getPlayerBySocketID.called).to.be.true;
//         sinon.assert.calledTwice(serverMockSpy);
//     });

//     it('displayPlayerQuitMessage should not emit if there is no opponent', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = 0;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameParametersStub = new GameParameters('creator', 0, false, 0);
//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getOtherPlayer.returns(undefined);
//         gameListManagerStub.getCurrentGame.returns(gameParametersStub);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "playerQuit" event
//         socketMock.triggerEvent('playerQuit');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
//         assert(gameListManagerStub.getOtherPlayer.called, 'getOtherPlayer called');
//         assert(gameListManagerStub.getCurrentGame.called, 'getCurrentGame called');
//         sinon.assert.notCalled(serverMockSpy);
//     });

//     it('displayPlayerQuitMessage should emit if there is and opponent', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = 0;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const gameParametersStub = new GameParameters('creator', 0, false, 0);
//         const gameListManagerStub = sinon.createStubInstance(GameListManager);
//         gameListManagerStub.getOtherPlayer.returns(playerMock);
//         gameListManagerStub.getCurrentGame.returns(gameParametersStub);
//         socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

//         const serverMockSpy = sinon.spy(serverMock, 'to');

//         // "playerQuit" event
//         socketMock.triggerEvent('playerQuit');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
//         assert(gameListManagerStub.getOtherPlayer.called, 'getOtherPlayer called');
//         assert(gameListManagerStub.getCurrentGame.called, 'getCurrentGame called');
//         sinon.assert.called(serverMockSpy);
//     });

//     it('displaySystemChatEntry should emit', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = 0;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const serverMockSpy = sinon.spy(serverMock, 'in');

//         // "sendSystemChatEntry" event
//         socketMock.triggerEvent('sendSystemChatEntry');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
//         sinon.assert.called(serverMockSpy);
//     });

//     it("changeTurn should not emit if the player doesn't have a room id", () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = undefined as unknown as number;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const serverMockSpy = sinon.spy(serverMock, 'in');

//         // "change turn" event
//         socketMock.triggerEvent('change turn');

//         assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
//         sinon.assert.notCalled(serverMockSpy);
//     });

//     it('changeTurn should emit if the player has a room id', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = 0;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const serverMockSpy = sinon.spy(serverMock, 'in');

//         // "change turn" event
//         socketMock.triggerEvent('change turn', false, 0);

//         assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
//         sinon.assert.called(serverMockSpy);

//         // "change turn" event
//         socketMock.triggerEvent('change turn', true, 0);

//         assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
//         sinon.assert.called(serverMockSpy);
//     });

//     it('endGame should emit in room with room id', () => {
//         // This should register the "connection" event and connect a false client
//         socketManagerService.handleSockets();
//         serverMock.triggerEvent('connection');

//         const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

//         // stub, spy and mock
//         const playerMock = new Player('name', 'id');
//         playerMock.roomId = 0;
//         const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
//         playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
//         socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

//         const serverMockSpy = sinon.spy(serverMock, 'in');

//         // "endGame" event
//         socketMock.triggerEvent('endGame', false, 0);

//         assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
//         sinon.assert.calledWith(serverMockSpy, playerMock.roomId.toString());
//     });
// });
