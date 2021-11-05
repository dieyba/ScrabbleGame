/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { assert, expect } from 'chai';
import * as http from 'http';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { GameListManager } from './game-list-manager.service';
import { PlayerManagerService } from './player-manager.service';
import { SocketManagerService } from './socket-manager.service';
import { ValidationService } from './validation.service';

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
    id: string = 'Socket mock';
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
        socketManagerService = new SocketManagerService(httpServer, validationServiceStub);

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

    it('all events should call their respective functions', () => {
        // This should register the "connection" event
        socketManagerService.handleSockets();
        // Simulate a client connecting
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // "createRoom" event
        const gameParametersStub = sinon.stub(GameParameters);
        const createRoomStub = sinon.stub(socketManagerService as any, 'createRoom');
        const getAllGamesStub = sinon.stub(socketManagerService as any, 'getAllGames');

        socketMock.triggerEvent('createRoom', gameParametersStub as any);

        createRoomStub.restore();

        sinon.assert.called(createRoomStub);
        sinon.assert.called(getAllGamesStub);

        // "validateWords" event
        const validateWordsStub = sinon.stub(socketManagerService as any, 'validateWords');
        const falseWords = ['wordOne', 'wordTwo'];

        socketMock.triggerEvent('validateWords', falseWords);

        validateWordsStub.restore();

        sinon.assert.called(validateWordsStub);

        // "deleteRoom" event
        const deleteRoomStub = sinon.stub(socketManagerService as any, 'deleteRoom');

        socketMock.triggerEvent('deleteRoom');

        validateWordsStub.restore();

        sinon.assert.called(deleteRoomStub);
        sinon.assert.called(getAllGamesStub);

        // "addPlayer" event
        const addPlayerStub = sinon.stub(socketManagerService as any, 'addPlayer');
        const playerStub = sinon.stub(Player);

        socketMock.triggerEvent('addPlayer', playerStub);

        addPlayerStub.restore();

        sinon.assert.called(addPlayerStub);
        sinon.assert.called(getAllGamesStub);

        // "joinRoom" event
        const joinRoomStub = sinon.stub(socketManagerService as any, 'joinRoom');

        socketMock.triggerEvent('joinRoom', gameParametersStub as any);

        joinRoomStub.restore();

        sinon.assert.called(joinRoomStub);
        sinon.assert.called(getAllGamesStub);

        // "joinRoom" event
        const initializeGameStub = sinon.stub(socketManagerService as any, 'initializeGame');

        socketMock.triggerEvent('initializeGame', 0);

        initializeGameStub.restore();

        sinon.assert.called(initializeGameStub);
    });

    it('validateWords should validate word and send the result with emit', () => {
        // This should register the "connection" event and connect a false client
        socketManagerService.handleSockets();
        serverMock.triggerEvent('connection');

        const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

        // stub and spy
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.validateNewWords.returns(true);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        const wordsToValidate = ['wordOne', 'wordTwo'];

        // "validateWords" event
        socketMock.triggerEvent('validateWords', wordsToValidate);

        expect(gameListManagerStub.validateNewWords.called).to.be.true;
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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getOtherPlayer.returns(undefined);
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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getOtherPlayer.returns(playerMock);
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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameParametersStub = new GameParameters('creator', 0, false, 0);
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getOtherPlayer.returns(undefined);
        gameListManagerStub.getCurrentGame.returns(gameParametersStub);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "playerQuit" event
        socketMock.triggerEvent('playerQuit');

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        assert(gameListManagerStub.getOtherPlayer.called, 'getOtherPlayer called');
        assert(gameListManagerStub.getCurrentGame.called, 'getCurrentGame called');
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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

        const gameParametersStub = new GameParameters('creator', 0, false, 0);
        const gameListManagerStub = sinon.createStubInstance(GameListManager);
        gameListManagerStub.getOtherPlayer.returns(playerMock);
        gameListManagerStub.getCurrentGame.returns(gameParametersStub);
        socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

        const serverMockSpy = sinon.spy(serverMock, 'to');

        // "playerQuit" event
        socketMock.triggerEvent('playerQuit');

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        assert(gameListManagerStub.getOtherPlayer.called, 'getOtherPlayer called');
        assert(gameListManagerStub.getCurrentGame.called, 'getCurrentGame called');
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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

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
        socketManagerService.playerMan = playerManagerServiceStub as unknown as PlayerManagerService;

        const serverMockSpy = sinon.spy(serverMock, 'in');

        // "endGame" event
        socketMock.triggerEvent('endGame', false, 0);

        assert(playerManagerServiceStub.getPlayerBySocketID.called, 'getPlayerBySocketID called');
        sinon.assert.calledWith(serverMockSpy, playerMock.roomId.toString());
    });
});
