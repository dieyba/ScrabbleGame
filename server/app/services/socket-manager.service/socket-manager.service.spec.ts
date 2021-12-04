/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
import { DictionaryType } from '@app/classes/dictionary/dictionary';
import { GameInitInfo, GameType, WaitingAreaGameParameters } from '@app/classes/game-parameters/game-parameters';
import { Player } from '@app/classes/player/player';
import { assert, expect } from 'chai';
import * as http from 'http';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { GameListManager } from '../game-list-manager.service/game-list-manager.service';
import { PlayerManagerService } from '../player-manager.service/player-manager.service';
import { ValidationService } from '../validation.service/validation.service';
import { SocketManagerService } from './socket-manager.service';

class ServerMock {
    events: Map<string, [CallableFunction, SocketMock]> = new Map();
    on(eventName: string, cb: CallableFunction) {
        this.events.set(eventName, [cb, new SocketMock()]);
    }

    triggerEvent(eventName: string) {
        const cbAndSocket = this.events.get(eventName) as [CallableFunction, SocketMock];
        cbAndSocket[0](cbAndSocket[1]);
    }

    emit(...args: any[]) {
        return;
    }

    to(...args: any[]): ServerMock {
        return new ServerMock();
    }

    in(...args: any[]): ServerMock {
        return new ServerMock();
    }
}

class SocketMock {
    id: string = 'socketID';
    events: Map<string, CallableFunction> = new Map();
    on(eventName: string, cb: CallableFunction) {
        this.events.set(eventName, cb);
    }

    triggerEvent(eventName: string, ...args: any[]) {
        const arrowFunction = this.events.get(eventName) as CallableFunction;
        arrowFunction(...args);
    }

    join(...args: any[]) {
        return;
    }

    leave(...args: any[]) {
        return;
    }

    disconnect() {
        return;
    }
}

describe('SocketManager service', () => {
    let socketManagerService: SocketManagerService;
    let validationServiceStub: sinon.SinonStubbedInstance<ValidationService>;
    let httpServer: http.Server;
    let serverMock: ServerMock;

    beforeEach(() => {
        validationServiceStub = sinon.createStubInstance(ValidationService);
        httpServer = http.createServer();
        socketManagerService = new SocketManagerService(httpServer);

        // Mocking the server
        serverMock = new ServerMock();
        socketManagerService['sio'] = serverMock as unknown as io.Server;
    });

    it('should create socketManagerService', () => {
        expect(socketManagerService).to.not.be.undefined;
    });

    it('handleSockets should register the "connection" event', () => {
        const serverSpy = sinon.spy(socketManagerService['sio'], 'on');
        socketManagerService.handleSockets();

        serverSpy.restore();

        sinon.assert.calledWith(serverSpy, 'connection');
        expect(serverMock.events.has('connection')).to.be.true;
    });

    it('"createWaitingAreaRoom" should call createWaitingAreaRoom and getAllWaitingAreaGames', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // spies and mock
        const createWaitingAreaRoomStub = sinon.stub(socketManagerService as any, 'createWaitingAreaRoom');
        const getAllWaitingAreaGamesStub = sinon.stub(socketManagerService as any, 'getAllWaitingAreaGames');

        socketMock.triggerEvent('createWaitingAreaRoom');

        sinon.assert.called(createWaitingAreaRoomStub);
        sinon.assert.called(getAllWaitingAreaGamesStub);
    });

    it('"deleteWaitingAreaRoom" should call deleteWaitingAreaRoom and getAllWaitingAreaGames', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // spies and mock 

        const deleteWaitingAreaRoomStub = sinon.stub(socketManagerService as any, 'deleteWaitingAreaRoom');
        const getAllWaitingAreaGamesStub = sinon.stub(socketManagerService as any, 'getAllWaitingAreaGames');

        socketMock.triggerEvent('deleteWaitingAreaRoom');

        sinon.assert.called(deleteWaitingAreaRoomStub);
        sinon.assert.called(getAllWaitingAreaGamesStub);
    });

    it('"joinWaitingAreaRoom" should call deleteWaitingAreaRoom and getAllWaitingAreaGames', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // spies and mock 

        const joinRoomStub = sinon.stub(socketManagerService as any, 'joinRoom');
        const getAllWaitingAreaGamesStub = sinon.stub(socketManagerService as any, 'getAllWaitingAreaGames');

        socketMock.triggerEvent('joinWaitingAreaRoom');

        sinon.assert.called(joinRoomStub);
        sinon.assert.called(getAllWaitingAreaGamesStub);
    });

    it('"initializeMultiPlayerGame" should call deleteWaitingAreaRoom and getAllWaitingAreaGames', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // spies and mock 

        const initializeMultiPlayerGameStub = sinon.stub(socketManagerService as any, 'initializeMultiPlayerGame');

        socketMock.triggerEvent('initializeMultiPlayerGame');

        sinon.assert.called(initializeMultiPlayerGameStub);
    });

    it('"getAllWaitingAreaGames" should call deleteWaitingAreaRoom and getAllWaitingAreaGames', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // spies and mock 

        const getAllWaitingAreaGamesStub = sinon.stub(socketManagerService as any, 'getAllWaitingAreaGames');

        socketMock.triggerEvent('getAllWaitingAreaGames');

        sinon.assert.called(getAllWaitingAreaGamesStub);
    });

    it('"exchange letters" should do nothing if socket`s player doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "exchange letters" event
        socketMock.triggerEvent('exchange letters');

        assert(gameListManagerStub.getGameInPlay.notCalled);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('"exchange letters" should do nothing if gameInPlay doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "word placed" event
        socketMock.triggerEvent('exchange letters');

        assert(gameListManagerStub.getGameInPlay.called);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('"exchange letters" should emit', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameInitInfoStub = sinon.createStubInstance(GameInitInfo);
        gameInitInfoStub.getOtherPlayerInRoom.returns(playerMock);
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(gameInitInfoStub);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "exchange letters" event
        socketMock.triggerEvent('exchange letters');

        assert(gameListManagerStub.getGameInPlay.called);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.called(serverMockSpy);
    });

    it('"word placed" should do nothing if socket`s player doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "exchange letters" event
        socketMock.triggerEvent('word placed');

        assert(gameListManagerStub.getGameInPlay.notCalled);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('"word placed" should do nothing if gameInPlay doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "word placed" event
        socketMock.triggerEvent('word placed');

        assert(gameListManagerStub.getGameInPlay.called);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('"word placed" should emit', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameInitInfoStub = sinon.createStubInstance(GameInitInfo);
        gameInitInfoStub.getOtherPlayerInRoom.returns(playerMock);
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(gameInitInfoStub);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "exchange letters" event
        socketMock.triggerEvent('word placed');

        assert(gameListManagerStub.getGameInPlay.called);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.called(serverMockSpy);
    });

    it('"place word" should do nothing if socket`s player doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "exchange letters" event
        socketMock.triggerEvent('place word');

        assert(gameListManagerStub.getGameInPlay.notCalled);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('"place word" should do nothing if gameInPlay doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "word placed" event
        socketMock.triggerEvent('place word');

        assert(gameListManagerStub.getGameInPlay.called);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('"place word" should emit', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameInitInfoStub = sinon.createStubInstance(GameInitInfo);
        gameInitInfoStub.getOtherPlayerInRoom.returns(playerMock);
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(gameInitInfoStub);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "exchange letters" event
        socketMock.triggerEvent('place word');

        assert(gameListManagerStub.getGameInPlay.called);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.called(serverMockSpy);
    });

    it('"achieve goal" should do nothing if socket`s player doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "exchange letters" event
        socketMock.triggerEvent('achieve goal');

        assert(gameListManagerStub.getGameInPlay.notCalled);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('"achieve goal" should do nothing if gameInPlay doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "word placed" event
        socketMock.triggerEvent('achieve goal');

        assert(gameListManagerStub.getGameInPlay.called);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('"achieve goal" should emit', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameInitInfoStub = sinon.createStubInstance(GameInitInfo);
        gameInitInfoStub.getOtherPlayerInRoom.returns(playerMock);
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(gameInitInfoStub);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "exchange letters" event
        socketMock.triggerEvent('achieve goal');

        assert(gameListManagerStub.getGameInPlay.called);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.called(serverMockSpy);
    });

    it('The "connection" event should at least register the "disconnection" event in a socket', () => {
        // This should register the "connection" event
        socketManagerService.handleSockets();

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
        const socketSpy = sinon.spy(socketMock, 'on');

        serverMock.triggerEvent('connection');

        socketSpy.restore();
        // At least register the "disconnect" event
        sinon.assert.calledWith(socketSpy, 'disconnect');
    });

    it('createRoom should create the room and emit the room created', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub and spy
        const gameMock = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        };
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.createWaitingAreaGame.returns(gameMock);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.allPlayers = [new Player('player1', '0'), new Player('player2', '0')];
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const serverMockSpy = sinon.spy(serverMock, 'emit');

        // "createRoom" event
        socketMock.triggerEvent('createRoom', gameMock);

        assert(gameListManagerStub.createWaitingAreaGame.called);
        sinon.assert.calledWith(serverMockSpy);
    });

    it('deleteRoom should do nothing if there is no player related to room', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined as unknown as Player);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const serverMockSpy = sinon.spy(serverMock, 'emit');

        // "deleteRoom" event
        socketMock.triggerEvent('deleteRoom');

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.neverCalledWith(serverMockSpy, 'roomdeleted');
    });

    it('deleteRoom should delete the room and emit it', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'emit');

        // "deleteRoom" event
        socketMock.triggerEvent('deleteRoom');

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.deleteWaitingAreaGame.called);
        sinon.assert.called(serverMockSpy);
    });

    it('leaveRoom should do nothing if player === undefined', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined as unknown as Player);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const serverMockSpy = sinon.spy(serverMock, 'to');
        const deleteRoomSpy = sinon.spy(socketManagerService as any, 'deleteRoom');
        const getAllGamesSpy = sinon.spy(socketManagerService as any, 'getAllGames');
        const socketMockSpy = sinon.spy(socketMock, 'leave');

        // "leaveRoom" event
        socketMock.triggerEvent('leaveRoom');

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
        sinon.assert.notCalled(deleteRoomSpy);
        sinon.assert.notCalled(getAllGamesSpy);
        sinon.assert.notCalled(socketMockSpy);
    });

    it('leaveRoom should delete the room and disconnect the player if the roomGame is undefined', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getAllWaitingAreaGames.returns(undefined as unknown as WaitingAreaGameParameters[]);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');
        const deleteRoomSpy = sinon.spy(socketManagerService as any, 'deleteWaitingAreaRoom');
        const getAllGamesSpy = sinon.spy(socketManagerService as any, 'getAllWaitingAreaGames');
        const socketMockSpy = sinon.spy(socketMock, 'leave');

        // "leaveRoom" event
        socketMock.triggerEvent('leaveRoom');

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
        sinon.assert.called(deleteRoomSpy);
        sinon.assert.called(getAllGamesSpy);
        sinon.assert.called(socketMockSpy);
    });

    it('leaveRoom should delete the room and disconnect the player if there is no one else in the game room', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameParametersStub = [{
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        }];
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        // gameListManagerStub.getAllWaitingAreaGames = [gameParametersStub as unknown as GameParameters];
        gameListManagerStub.getAllWaitingAreaGames.returns(gameParametersStub);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');
        const deleteRoomSpy = sinon.spy(socketManagerService as any, 'deleteRoom');
        const getAllGamesSpy = sinon.spy(socketManagerService as any, 'getAllGames');
        const socketMockSpy = sinon.spy(socketMock, 'leave');

        // "leaveRoom" event
        socketMock.triggerEvent('leaveRoom');

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.notCalled(serverMockSpy);
        sinon.assert.notCalled(deleteRoomSpy);
        sinon.assert.notCalled(getAllGamesSpy);
        sinon.assert.called(socketMockSpy);
    });

    it('leaveRoom should emit "roomLeft" if there is someone left in the room', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameParametersMock = [{
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        }];
        gameParametersMock[0].gameRoom.playersName = [playerMock.name, playerMock.name];
        // gameParametersMock.players = [playerMock];
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        // gameListManagerStub.currentGames = [gameParametersMock];
        gameListManagerStub.getAllWaitingAreaGames.returns(gameParametersMock);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');
        const deleteRoomSpy = sinon.spy(socketManagerService as any, 'deleteRoom');
        const getAllGamesSpy = sinon.spy(socketManagerService as any, 'getAllGames');
        const socketMockSpy = sinon.spy(socketMock, 'leave');

        sinon.stub(socketManagerService as any, 'displayPlayerQuitMessage');

        // "leaveRoom" event
        socketMock.triggerEvent('leaveRoom');

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        sinon.assert.called(serverMockSpy);
        sinon.assert.notCalled(deleteRoomSpy);
        sinon.assert.notCalled(getAllGamesSpy);
        sinon.assert.called(socketMockSpy);
    });

    it('disconnect should call "leaveRoom" after 5 seconds', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        // const leaveRoomspy = sinon.spy((socketManagerService as any).disconnect);

        // "leaveRoom" event
        socketMock.triggerEvent('disconnect');

        // assert(leaveRoomspy.called, 'leaveRoom is called'); // TODO check how to make async test
    });

    it('getAllGames should emit with argument "getAllGames"', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'emit');

        // "getAllGames" event
        socketMock.triggerEvent('getAllGames');

        sinon.assert.calledWith(serverMockSpy, 'getAllGames');
    });

    it('addPlayer should call the PlayerManagerService.addPlayer', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const playerMock = new Player('name', 'socketId');

        // "addPlayer" event
        socketMock.triggerEvent('addPlayer', playerMock);

        assert(playerManagerServiceStub.addPlayer.calledWith(playerMock.name, socketMock.id.toString()));
    });

    it('joinRoom should do nothing if the player who joins and the game room are undefined', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined as unknown as Player);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getAllWaitingAreaGames.returns(undefined as unknown as WaitingAreaGameParameters[]);
        // socketManagerService['gameListMan'] = gameListManagerStub;

        const gameParametersMock = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        };

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "joinRoom" event
        socketMock.triggerEvent('joinRoom', gameParametersMock);

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getAllWaitingAreaGames.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('joinRoom should emit if the player who joins and the game room exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'socketId');
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameParametersMock = new GameInitInfo({
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        });
        gameParametersMock.players[1] = playerMock;
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(gameParametersMock);
        // let currentGames =gameListManagerStub.getAllWaitingAreaGames() 
        // currentGames = [gameParametersMock];
        // socketManagerService['gameListMan'] = gameListManagerStub;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "joinRoom" event
        socketMock.triggerEvent('joinRoom', gameParametersMock);

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getAllWaitingAreaGames.called);
        sinon.assert.called(serverMockSpy);
    });

    it('initializeGame should do nothing if the game room is undefined', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getAllWaitingAreaGames.returns(undefined as unknown as WaitingAreaGameParameters[]);
        // socketManagerService['gameListMan'] = gameListManagerStub;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "initializeGame" event
        socketMock.triggerEvent('initializeGame', 0);

        assert(gameListManagerStub.getAllWaitingAreaGames.called);
        sinon.assert.notCalled(serverMockSpy);
    });

    it('initializeGame should emit if the game room is defined', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'socketId');
        const gameParametersMock = new GameInitInfo({
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        });
        gameParametersMock.players = [playerMock, playerMock];

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getGameInPlay.returns(gameParametersMock);
        // socketManagerService['gameListMan'] = gameListManagerStub;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "initializeGame" event
        socketMock.triggerEvent('initializeGame', 0);

        assert(gameListManagerStub.getAllWaitingAreaGames.called);
        sinon.assert.called(serverMockSpy);
    });

    it('validateWords should validate word and send the result with emit', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        validationServiceStub.validateWords.returns(true);
        socketManagerService['validationService'] = validationServiceStub as unknown as ValidationService;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        const wordsToValidate = ['wordOne', 'wordTwo'];

        // "validateWords" event
        socketMock.triggerEvent('validateWords', wordsToValidate);

        expect(validationServiceStub.validateWords.called).to.be.true;
        sinon.assert.called(serverMockSpy);
    });

    it('displayChatEntry should get player with socket.id and emit to the room by using "in"', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = 0;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const serverMockSpy = sinon.spy(serverMock, 'in');

        const messageMock = 'myMessage';

        // "validateWords" event
        socketMock.triggerEvent('sendChatEntry', messageMock);

        expect(playerManagerServiceStub.getPlayerBySocketID.called).to.be.true;
        sinon.assert.called(serverMockSpy);
    });

    it('displayDifferentChatEntry should not emit if there is no opponent', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = 0;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        // gameListManagerStub.getOtherPlayer.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        const messageMock = 'myMessage';
        const messageToOpponentMock = 'myOpponentMessage';

        // "validateWords" event
        socketMock.triggerEvent('sendChatEntry', messageMock, messageToOpponentMock);

        expect(playerManagerServiceStub.getPlayerBySocketID.called).to.be.true;
        sinon.assert.notCalled(serverMockSpy);
    });

    it('displayDifferentChatEntry should emit twice if there is an opponent', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = 0;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        // gameListManagerStub.getOtherPlayer.returns(playerMock);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        const messageMock = 'myMessage';
        const messageToOpponentMock = 'myOpponentMessage';

        // "validateWords" event
        socketMock.triggerEvent('sendChatEntry', messageMock, messageToOpponentMock);

        expect(playerManagerServiceStub.getPlayerBySocketID.called).to.be.true;
        sinon.assert.calledTwice(serverMockSpy);
    });

    it('displayPlayerQuitMessage should not emit if there is no opponent', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = 0;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameParametersMock = new GameInitInfo({
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        });
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        // gameListManagerStub.getOtherPlayer.returns(undefined);
        gameListManagerStub.getGameInPlay.returns(gameParametersMock);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "playerQuit" event
        socketMock.triggerEvent('playerQuit');

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        // assert(gameListManagerStub.getOtherPlayer.called, 'getOtherPlayer called');
        // assert(gameListManagerStub.getCurrentGame.called, 'getCurrentGame called');
        sinon.assert.notCalled(serverMockSpy);
    });

    it('displayPlayerQuitMessage should emit if there is and opponent', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = 0;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameParametersMock = new GameInitInfo({
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        });
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        // gameListManagerStub.getOtherPlayer.returns(playerMock);
        gameListManagerStub.getGameInPlay.returns(gameParametersMock);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "playerQuit" event
        socketMock.triggerEvent('playerQuit');

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        // assert(gameListManagerStub.getOtherPlayer.called, 'getOtherPlayer called');
        // assert(gameListManagerStub.getCurrentGame.called, 'getCurrentGame called');
        sinon.assert.called(serverMockSpy);
    });

    it('displaySystemChatEntry should emit', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = 0;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const serverMockSpy = sinon.spy(serverMock, 'in');

        // "sendSystemChatEntry" event
        socketMock.triggerEvent('sendSystemChatEntry');

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        sinon.assert.called(serverMockSpy);
    });

    it("changeTurn should not emit if the player doesn't have a room id", () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = undefined as unknown as number;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const serverMockSpy = sinon.spy(serverMock, 'in');

        // "change turn" event
        socketMock.triggerEvent('change turn');

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        sinon.assert.notCalled(serverMockSpy);
    });

    it('changeTurn should emit if the player has a room id', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = 0;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const serverMockSpy = sinon.spy(serverMock, 'in');

        // "change turn" event
        socketMock.triggerEvent('change turn', false, 0);

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        sinon.assert.called(serverMockSpy);

        // "change turn" event
        socketMock.triggerEvent('change turn', true, 0);

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        sinon.assert.called(serverMockSpy);
    });

    it('endGame should emit in room with room id', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub, spy and mock
        const playerMock = new Player('name', 'id');
        playerMock.roomId = 0;
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub as unknown as PlayerManagerService;

        const serverMockSpy = sinon.spy(serverMock, 'in');

        // "endGame" event
        socketMock.triggerEvent('endGame', false, 0);

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        sinon.assert.calledWith(serverMockSpy, playerMock.roomId.toString());
    });

    it('"getIsLog2990FromId" should return false if socket`s player doesn`t exist', () => {
        // stub spy and mock
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getAWaitingAreaGame.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        // calling "getIsLog2990FromId"
        const result = socketManagerService['getIsLog2990FromId']('falseId');

        assert(!result);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getGameInPlay.notCalled);
    });

    it('"getIsLog2990FromId" should return false if gameInPlay doesn`t exist', () => {
        // stub spy and mock
        const playerMock = new Player('name', 'socketId', 0);
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getAWaitingAreaGame.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        // calling "getIsLog2990FromId"
        const result = socketManagerService['getIsLog2990FromId']('falseId');

        assert(!result);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getGameInPlay.called);
    });

    it('"getIsLog2990FromId" should emit', () => {
        // stub spy and mock
        const playerMock = new Player('name', 'socketId', 0);
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        const waitingAreaGameParametersMock: WaitingAreaGameParameters = {
            gameRoom: {
                idGame: 0,
                capacity: 0,
                playersName: [''],
                creatorId: '',
                joinerId: '',
            },
            creatorName: '',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 0,
            isRandomBonus: false,
            isLog2990: false,
            gameMode: GameType.Solo,
        };
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getAWaitingAreaGame.returns(waitingAreaGameParametersMock);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        // calling "getIsLog2990FromId"
        const result = socketManagerService['getIsLog2990FromId']('falseId');

        assert(result === waitingAreaGameParametersMock.isLog2990);
        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getGameInPlay.called);
    });

    it('"createWaitingAreaRoom" do nothing if gameInPlay doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
        const socketMockJoinSpy = sinon.spy(socketMock, 'join');

        // stub spy and mock
        const waitingAreaGameParametersMock: WaitingAreaGameParameters = {
            gameRoom: {
                idGame: 0,
                capacity: 0,
                playersName: [''],
                creatorId: '',
                joinerId: '',
            },
            creatorName: '',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 0,
            isRandomBonus: false,
            isLog2990: false,
            gameMode: GameType.Solo,
        };

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.createWaitingAreaGame.returns(waitingAreaGameParametersMock);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(undefined);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        // calling "getIsLog2990FromId"
        socketManagerService['createWaitingAreaRoom'](socketMock as unknown as io.Socket, waitingAreaGameParametersMock);

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getGameInPlay.called);
        assert(socketMockJoinSpy.notCalled);
    });

    it('"createWaitingAreaRoom" do nothing if gameInPlay doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
        const socketMockJoinSpy = sinon.spy(socketMock, 'join');

        const serverMockSpy = sinon.spy(serverMock, 'emit');

        // stub spy and mock
        const waitingAreaGameParametersMock: WaitingAreaGameParameters = {
            gameRoom: {
                idGame: 0,
                capacity: 0,
                playersName: [''],
                creatorId: '',
                joinerId: '',
            },
            creatorName: '',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 0,
            isRandomBonus: false,
            isLog2990: false,
            gameMode: GameType.Solo,
        };

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.createWaitingAreaGame.returns(waitingAreaGameParametersMock);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const playerMock = new Player('name', 'socketId', 0);
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        // calling "getIsLog2990FromId"
        socketManagerService['createWaitingAreaRoom'](socketMock as unknown as io.Socket, waitingAreaGameParametersMock);

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getGameInPlay.called);
        assert(socketMockJoinSpy.called);
        sinon.assert.called(serverMockSpy);
    });

    it('"leaveRoom" do nothing if gameInPlay doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
        const socketMockSpy = sinon.spy(socketMock, 'leave');

        // stub spy and mock
        const playerMock = new Player('name', 'socketId', 0);
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        // GameListManager stubs
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        const waitingAreaGameParametersMock: WaitingAreaGameParameters = {
            gameRoom: {
                idGame: 0,
                capacity: 0,
                playersName: [''],
                creatorId: '',
                joinerId: '',
            },
            creatorName: '',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 0,
            isRandomBonus: false,
            isLog2990: false,
            gameMode: GameType.Solo,
        };
        gameListManagerStub.getAWaitingAreaGame.returns(waitingAreaGameParametersMock);
        const gameInitInfoStub = sinon.createStubInstance(GameInitInfo);
        gameListManagerStub.getGameInPlay.returns(gameInitInfoStub);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const leaveGameInPlayStub = sinon.stub(socketManagerService as any, 'leaveGameInPlay');
        const leaveWaitingAreaRoomStub = sinon.stub(socketManagerService as any, 'leaveWaitingAreaRoom');

        // calling "getIsLog2990FromId"
        socketManagerService['leaveRoom'](socketMock as unknown as io.Socket);

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getGameInPlay.called);
        assert(leaveGameInPlayStub.called);
        assert(leaveWaitingAreaRoomStub.notCalled);
        sinon.assert.called(socketMockSpy);
    });

    it('"leaveRoom" do nothing if gameInPlay doesn`t exist', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
        const socketMockSpy = sinon.spy(socketMock, 'leave');

        // stub spy and mock
        const playerMock = new Player('name', 'socketId', 0);
        const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerServiceStub.getPlayerBySocketID.returns(playerMock);
        socketManagerService['playerMan'] = playerManagerServiceStub;

        // GameListManager stubs
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        const waitingAreaGameParametersMock: WaitingAreaGameParameters = {
            gameRoom: {
                idGame: 0,
                capacity: 0,
                playersName: [''],
                creatorId: '',
                joinerId: '',
            },
            creatorName: '',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 0,
            isRandomBonus: false,
            isLog2990: false,
            gameMode: GameType.Solo,
        };
        gameListManagerStub.getAWaitingAreaGame.returns(waitingAreaGameParametersMock);
        gameListManagerStub.getGameInPlay.returns(undefined);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const leaveGameInPlayStub = sinon.stub(socketManagerService as any, 'leaveGameInPlay');
        const leaveWaitingAreaRoomStub = sinon.stub(socketManagerService as any, 'leaveWaitingAreaRoom');

        // calling "getIsLog2990FromId"
        socketManagerService['leaveRoom'](socketMock as unknown as io.Socket);

        assert(playerManagerServiceStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getGameInPlay.called);
        assert(leaveGameInPlayStub.notCalled);
        assert(leaveWaitingAreaRoomStub.called);
        sinon.assert.called(socketMockSpy);
    });

    it('"leaveWaitingAreaRoom" do nothing if gameInPlay doesn`t exist', async () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
        socketMock.id = 'socketID';

        // stub, mock and spy 
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        const deleteWaitingAreaRoomStub = sinon.stub(socketManagerService as any, 'deleteWaitingAreaRoom');

        const waitingAreaGameParametersMock: WaitingAreaGameParameters = {
            gameRoom: {
                idGame: 0,
                capacity: 0,
                playersName: [''],
                creatorId: '',
                joinerId: 'socketID',
            },
            creatorName: '',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 0,
            isRandomBonus: false,
            isLog2990: false,
            gameMode: GameType.Solo,
        };
        // calling "leaveWaitingAreaRoom"
        socketManagerService['leaveWaitingAreaRoom'](socketMock as unknown as io.Socket, waitingAreaGameParametersMock);

        assert(gameListManagerStub.removeJoinerPlayer.called);
        assert(deleteWaitingAreaRoomStub.notCalled);
    });

    it('"leaveWaitingAreaRoom" do nothing if gameInPlay doesn`t exist', async () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
        socketMock.id = 'socketID';

        // stub, mock and spy 
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        const deleteWaitingAreaRoomStub = sinon.stub(socketManagerService as any, 'deleteWaitingAreaRoom');

        const waitingAreaGameParametersMock: WaitingAreaGameParameters = {
            gameRoom: {
                idGame: 0,
                capacity: 0,
                playersName: [''],
                creatorId: '',
                joinerId: '',
            },
            creatorName: '',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 0,
            isRandomBonus: false,
            isLog2990: false,
            gameMode: GameType.Solo,
        };
        // calling "leaveWaitingAreaRoom"
        socketManagerService['leaveWaitingAreaRoom'](socketMock as unknown as io.Socket, waitingAreaGameParametersMock);

        assert(gameListManagerStub.removeJoinerPlayer.notCalled);
        assert(deleteWaitingAreaRoomStub.called);
    });

    it('"deleteWaitingAreaRoom" do nothing if socket`s player doesn`t exist', async () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];
        const serverMockSpy = sinon.spy(serverMock, 'emit')

        // stub, mock and spy 
        // const playerMock = new Player('name', 'socketId', 0);
        const playerManagerStub = sinon.createStubInstance(PlayerManagerService);
        playerManagerStub.getPlayerBySocketID.returns(undefined);

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getAWaitingAreaGame.returns(undefined);

        // calling "leaveWaitingAreaRoom"
        socketManagerService['deleteWaitingAreaRoom'](socketMock as unknown as io.Socket);

        assert(playerManagerStub.getPlayerBySocketID.called);
        assert(gameListManagerStub.getAWaitingAreaGame.notCalled);
        assert(gameListManagerStub.deleteWaitingAreaGame.notCalled);
        assert(serverMockSpy.notCalled);
    });
});
