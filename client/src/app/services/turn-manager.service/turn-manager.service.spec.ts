/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GameParameters, GameType } from '@app/classes/game-parameters/game-parameters';
import { LetterStock } from '@app/classes/letter-stock/letter-stock';
import { Player } from '@app/classes/player/player';
import { VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { ChatDisplayService } from '@app/services/chat-display.service/chat-display.service';
import { EndGameService } from '@app/services/end-game.service/end-game.service';
import { GameService } from '@app/services/game.service/game.service';
import { TurnManagerService } from '@app/services/turn-manager.service/turn-manager.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service/virtual-player.service';
import * as io from 'socket.io-client';

class SocketMock {
    id: string = 'Socket mock';
    events: Map<string, CallableFunction> = new Map();
    on(eventName: string, cb: CallableFunction) {
        this.events.set(eventName, cb);
    }

    triggerEvent(eventName: string, ...args: unknown[]) {
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

describe('TurnManagerService', () => {
    let service: TurnManagerService;
    let chatDisplayServiceSpy: jasmine.SpyObj<ChatDisplayService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let endGameServiceSpy: jasmine.SpyObj<EndGameService>;
    let virtualPlayerServiceSpy: jasmine.SpyObj<VirtualPlayerService>;

    let socketMock: SocketMock;
    let socketOnMockSpy: jasmine.SpyObj<any>;
    let socketEmitMockSpy: jasmine.SpyObj<unknown>;

    beforeEach(() => {
        chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', ['addEntry']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['resetTimer', 'endGame']);
        endGameServiceSpy = jasmine.createSpyObj('EndGameService', ['endGame']);
        virtualPlayerServiceSpy = jasmine.createSpyObj('VirtualPlayerService', ['playTurn']);

        TestBed.configureTestingModule({
            providers: [
                { provide: ChatDisplayService, useValue: chatDisplayServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: EndGameService, useValue: endGameServiceSpy },
                { provide: VirtualPlayerService, useValue: virtualPlayerServiceSpy },
            ],
            imports: [HttpClientModule, MatSnackBarModule],
        });
        service = TestBed.inject(TurnManagerService);

        gameServiceSpy.game = new GameParameters();
        gameServiceSpy.game.stock = new LetterStock();
        const creator: Player = new Player('Riri');
        const joiner: VirtualPlayer = new VirtualPlayer('Lulu');
        creator.socketId = '0';
        joiner.socketId = '1';
        gameServiceSpy.game.players[0] = creator;
        gameServiceSpy.game.players[1] = joiner;

        socketMock = new SocketMock();
        service['socket'] = socketMock as unknown as io.Socket;
        socketOnMockSpy = spyOn(socketMock, 'on').and.callThrough();
        socketEmitMockSpy = spyOn(socketMock, 'emit').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // initialize test
    it('initialize should set consecutivePassedTurns', () => {
        service['consecutivePassedTurns'] = 2;
        service.initialize();
        expect(service['consecutivePassedTurns']).toEqual(0);
    });

    // socketOnConnect tests
    it('socketOnConnect should catch socket on of turn changed event', () => {
        service['socketOnConnect']();
        gameServiceSpy.game.isEndGame = true;
        socketMock.triggerEvent('turn changed', { isCurrentTurnedPassed: true, consecutivePassedTurns: 4 });
        expect(socketOnMockSpy).toHaveBeenCalled();
    });

    // TODO: le 2e if de socketOnConnect
    it('socketOnConnect should call endGameService endGame if turn has been passed at least 6 times and if the player is active', () => {
        service['socketOnConnect']();
        // service['consecutivePassedTurns'] = 6;
        socketMock.triggerEvent('turn changed', { isCurrentTurnedPassed: true, consecutivePassedTurns: 4 });
        expect(endGameServiceSpy.endGame).not.toHaveBeenCalled();

        // gameServiceSpy.game.getLocalPlayer().isActive = true;
        // socketMock.triggerEvent('turn changed', { isCurrentTurnedPassed: true, consecutivePassedTurns: 7 });
        // service.socketOnConnect();
        // expect(endGameServiceSpy.endGame).toHaveBeenCalled();
    });

    // changeTurn tests
    it('changeTurn should not call displayPassTurnMessage is it is endGame', () => {
        const displayPassTurnMessageSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'displayPassTurnMessage' as any);
        gameServiceSpy.game.isEndGame = true;
        service.changeTurn();
        expect(displayPassTurnMessageSpy).not.toHaveBeenCalled();
    });

    it('changeTurn should call socket emit if it is multiplayer mode', () => {
        gameServiceSpy.game.gameMode = GameType.MultiPlayer;
        service.changeTurn();
        expect(socketEmitMockSpy).toHaveBeenCalled();
    });

    it('changeTurn should call displayPassTurnMessage, updateConsecutivePassedTurns and updateActivePlayer if it isn t end game or solo mode', () => {
        const displayPassTurnMessageSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'displayPassTurnMessage' as any);
        const updateConsecutivePassedTurnsSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'updateConsecutivePassedTurns' as any);
        const updateActivePlayerSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'updateActivePlayer' as any);

        service.changeTurn();
        expect(displayPassTurnMessageSpy).toHaveBeenCalled();
        expect(updateConsecutivePassedTurnsSpy).toHaveBeenCalled();
        expect(updateActivePlayerSpy).toHaveBeenCalled();
    });

    it('changeTurn should call virtualPlayerService playTurn if it is virtual player turn', () => {
        gameServiceSpy.game.getLocalPlayer().isActive = true;
        service.changeTurn();
        expect(virtualPlayerServiceSpy.playTurn).toHaveBeenCalled();
    });

    // updateConsecutivePassedTurns tests
    it('updateConsecutivePassedTurns should call endGameService endGame if turn has been passed 6 times', () => {
        service['updateConsecutivePassedTurns']();
        expect(endGameServiceSpy.endGame).not.toHaveBeenCalled();

        service['consecutivePassedTurns'] = 5;
        gameServiceSpy.isTurnPassed = true;
        service['updateConsecutivePassedTurns']();
        expect(endGameServiceSpy.endGame).toHaveBeenCalled();
    });

    // updateActivePlayer tests
    it('updateActivePlayer should set isActive to false for the two players if it is endGame', () => {
        gameServiceSpy.game.isEndGame = true;
        service['updateActivePlayer']();
        expect(gameServiceSpy.game.getLocalPlayer().isActive).toBeFalse();
        expect(gameServiceSpy.game.getOpponent().isActive).toBeFalse();
    });

    it('updateActivePlayer should switch the active player', () => {
        gameServiceSpy.game.getLocalPlayer().isActive = true;
        service['updateActivePlayer']();
        expect(gameServiceSpy.game.getLocalPlayer().isActive).toBeFalse();
        expect(gameServiceSpy.game.getOpponent().isActive).toBeTrue();

        service['updateActivePlayer']();
        expect(gameServiceSpy.game.getLocalPlayer().isActive).toBeTrue();
        expect(gameServiceSpy.game.getOpponent().isActive).toBeFalse();
    });

    it('updateActivePlayer should call endGameService endGame if the active player no has letters anymore and if the stock is empty', () => {
        gameServiceSpy.game.stock.letterStock = [];
        service['updateActivePlayer']();
        expect(endGameServiceSpy.endGame).toHaveBeenCalled();
    });

    // displayPassTurnMessage tests
    it('displayPassTurnMessage should call chatDisplayService addEntry if the turn has been passed', () => {
        service['displayPassTurnMessage']();
        expect(chatDisplayServiceSpy.addEntry).not.toHaveBeenCalled();

        gameServiceSpy.isTurnPassed = true;
        gameServiceSpy.game.getLocalPlayer().isActive = true;
        service['displayPassTurnMessage']();
        expect(chatDisplayServiceSpy.addEntry).toHaveBeenCalled();

        gameServiceSpy.game.getLocalPlayer().isActive = false;
        service['displayPassTurnMessage']();
        expect(chatDisplayServiceSpy.addEntry).toHaveBeenCalled();
    });
});
