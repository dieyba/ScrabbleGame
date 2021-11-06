import { TestBed } from '@angular/core/testing';
import { GameParameters } from '@app/classes/game-parameters';
import * as io from 'socket.io-client';
import { MultiPlayerGameService } from './multi-player-game.service';
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
    emit(...args: any[]) {
        return;
    }

    disconnect() {
        return;
    }
}

describe('MultiPlayerGameService', () => {
    let service: MultiPlayerGameService;
    let socketMock: SocketMock;
    let socketOnMockSpy: jasmine.SpyObj<any>;
    let socketEmitMockSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MultiPlayerGameService);
        service.game = new GameParameters('dieyba', 60, false)
        socketMock = new SocketMock();
        service['socket'] = socketMock as unknown as io.Socket;
        socketOnMockSpy = spyOn(socketMock, 'on').and.callThrough();
        socketEmitMockSpy = spyOn(socketMock, 'emit');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('socketOnConnect should handle socket.on event turn changed', () => {
        service.socketOnConnect();
        socketMock.triggerEvent('turn changed', { isTurnPassed: false, consecutivePassedTurns: 0 });
        expect(socketOnMockSpy).toHaveBeenCalled();
        service.game.isEndGame = false;
        expect(service.resetTimer).toHaveBeenCalled
    });
    it('socketOnConnect should handle socket.on event gameEnded', () => {
        service.socketOnConnect();
        socketMock.triggerEvent('gameEnded', {});
        expect(socketOnMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event update board', () => {
        service.socketOnConnect();
        // let board = new ScrabbleBoard(false);
        // board.word
        socketMock.triggerEvent('update board', ['maison', 'h',]);
        expect(socketOnMockSpy).toHaveBeenCalled();
    });
    it('should emit changeTurn ', () => {
        service.changeTurn();
        expect(socketEmitMockSpy).toHaveBeenCalledWith('change turn', service.game.isTurnPassed, service.game.consecutivePassedTurns);
    });
    it('should emit endGame ', () => {
        service.endGame();
        expect(socketEmitMockSpy).toHaveBeenCalledWith('endGame');
    });
});
