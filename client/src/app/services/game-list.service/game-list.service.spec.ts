import { TestBed } from '@angular/core/testing';
import { DictionaryType } from '@app/classes/dictionary/dictionary';
import { GameType } from '@app/classes/game-parameters/game-parameters';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters/waiting-area-game-parameters';
import * as io from 'socket.io-client';
import { GameListService } from './game-list.service';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
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

    join() {
        return;
    }
    emit() {
        return;
    }

    disconnect() {
        return;
    }
}

describe('GameListService', () => {
    let service: GameListService;
    let socketMock: SocketMock;
    let socketOnMockSpy: jasmine.SpyObj<any>;
    let socketEmitMockSpy: jasmine.SpyObj<any>;

    // eslint-disable-next-line max-len
    const game: WaitingAreaGameParameters = new WaitingAreaGameParameters(GameType.Solo, 2, DictionaryType.Default, 60, false, false, 'Riri', 'Lulu');
    const game2: WaitingAreaGameParameters = new WaitingAreaGameParameters(
        GameType.MultiPlayer,
        2,
        DictionaryType.English,
        60,
        true,
        true,
        'Didi',
        'Kevin',
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameListService);
        socketMock = new SocketMock();
        service['socket'] = socketMock as unknown as io.Socket;
        socketOnMockSpy = spyOn(socketMock, 'on').and.callThrough();
        socketEmitMockSpy = spyOn(socketMock, 'emit').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should catch socket updateWaitingAreaGames event', () => {
        service.socketOnConnect();
        const allGames: WaitingAreaGameParameters[] = [game, game2];
        socketMock.triggerEvent('updateWaitingAreaGames', allGames);
        expect(socketOnMockSpy).toHaveBeenCalled();
    });

    it('getGames should call socket emit with the right parameters', () => {
        service.getGames(true);
        expect(socketEmitMockSpy).toHaveBeenCalledWith('getAllWaitingAreaGames', true);
    });

    it('createRoom should call socket emit with the right parameters', () => {
        service.createRoom(game);
        expect(socketEmitMockSpy).toHaveBeenCalledWith('createWaitingAreaRoom', game);
    });

    it('deleteRoom should call socket emit with the right parameters', () => {
        service.deleteRoom();
        expect(socketEmitMockSpy).toHaveBeenCalledWith('deleteWaitingAreaRoom');
    });

    it('start should call socket emit with the right parameters', () => {
        service.start(game, 'Riri');
        expect(socketEmitMockSpy).toHaveBeenCalledWith('joinWaitingAreaRoom', 'Riri', game.gameRoom.idGame, game.isLog2990);
    });

    it('initializeMultiplayerGame should call socket emit with the right parameters', () => {
        service.initializeMultiplayerGame();
        expect(socketEmitMockSpy).toHaveBeenCalledWith('initializeMultiPlayerGame');
    });

    it('someoneLeftRoom should call socket emit with the right parameters', () => {
        service.someoneLeftRoom();
        expect(socketEmitMockSpy).toHaveBeenCalledWith('leaveRoom');
    });
});
