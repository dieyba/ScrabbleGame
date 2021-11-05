/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { expect } from 'chai';
import * as http from 'http';
import * as sinon from 'sinon';
import * as io from 'socket.io';
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

    // it('resetTimer should do nothing if there is no player related to the socket', () => {
    //     // This should register the "connection" event and connect a false client
    //     socketManagerService.handleSockets();
    //     serverMock.triggerEvent('connection');

    //     const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

    //     // stub and spy
    //     const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
    //     playerManagerServiceStub.getPlayerBySocketID.returns(undefined as unknown as Player);
    //     socketManagerService.playerMan = playerManagerServiceStub;
    //     const serverSpy = sinon.spy(serverMock, 'to');

    //     // "reset timer" event
    //     socketMock.triggerEvent('reset timer');

    //     serverSpy.restore();

    //     sinon.assert.notCalled(serverSpy);
    // });

    // it('resetTimer should do nothing if there is no game related to room.id', () => {
    //     // This should register the "connection" event and connect a false client
    //     socketManagerService.handleSockets();
    //     serverMock.triggerEvent('connection');

    //     const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

    //     // stub and spy
    //     const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
    //     playerManagerServiceStub.getPlayerBySocketID.returns(new Player('myName', socketMock.id));
    //     socketManagerService.playerMan = playerManagerServiceStub;

    //     const gameListManagerStub = sinon.createStubInstance(GameListManager);
    //     gameListManagerStub.getCurrentGame.returns(undefined as unknown as GameParameters);
    //     socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

    //     const serverSpy = sinon.spy(serverMock, 'to');

    //     // "reset timer" event
    //     socketMock.triggerEvent('reset timer');

    //     serverSpy.restore();

    //     sinon.assert.notCalled(serverSpy);
    // });

    // it('resetTimer should emit a "timer reset"', () => {
    //     // This should register the "connection" event and connect a false client
    //     socketManagerService.handleSockets();
    //     serverMock.triggerEvent('connection');

    //     const socketMock = (serverMock.events.get('connection') as unknown as [CallableFunction, SocketMock])[1];

    //     // stub and spy
    //     const playerManagerServiceStub = sinon.createStubInstance(PlayerManagerService);
    //     playerManagerServiceStub.getPlayerBySocketID.returns(new Player('myName', socketMock.id));
    //     socketManagerService.playerMan = playerManagerServiceStub;

    //     const gameListManagerStub = sinon.createStubInstance(GameListManager);
    //     gameListManagerStub.getCurrentGame.returns(new GameParameters('name', 60, false, 0));
    //     socketManagerService['gameListMan'] = gameListManagerStub as unknown as GameListManager;

    //     const serverSpy = sinon.spy(serverMock, 'to');

    //     // "reset timer" event
    //     socketMock.triggerEvent('reset timer');

    //     serverSpy.restore();

    //     sinon.assert.called(serverSpy);
    // });
});
