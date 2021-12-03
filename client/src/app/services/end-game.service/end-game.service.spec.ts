/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameParameters, GameType } from '@app/classes/game-parameters/game-parameters';
import { GameTimer } from '@app/classes/game-timer/game-timer';
import { LetterStock } from '@app/classes/letter-stock/letter-stock';
import { Player } from '@app/classes/player/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { BestScores, BestScoresService } from '@app/services/best-scores.service/best-scores.service';
import { ChatDisplayService } from '@app/services/chat-display.service/chat-display.service';
import { EndGameService } from '@app/services/end-game.service/end-game.service';
import { GameService } from '@app/services/game.service/game.service';
import { of, throwError } from 'rxjs';
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

describe('EndGameService', () => {
    let service: EndGameService;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let chatDisplayServiceSpy: jasmine.SpyObj<ChatDisplayService>;
    let bestScoresServiceSpy: jasmine.SpyObj<BestScoresService>;

    let socketMock: SocketMock;
    let socketOnMockSpy: jasmine.SpyObj<any>;
    let socketEmitMockSpy: jasmine.SpyObj<unknown>;

    const bestScore: BestScores = { playerName: 'Riri', score: 495 };

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['resetTimer']);
        chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', ['displayEndGameMessage']);
        bestScoresServiceSpy = jasmine.createSpyObj('BestScoresService', ['postBestScore']);

        bestScoresServiceSpy.postBestScore.and.callFake(() => {
            return of(bestScore);
        });

        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
                { provide: ChatDisplayService, useValue: chatDisplayServiceSpy },
                { provide: BestScoresService, useValue: bestScoresServiceSpy },
            ],
            imports: [MatSnackBarModule, HttpClientModule, BrowserAnimationsModule],
        });
        service = TestBed.inject(EndGameService);

        gameServiceSpy.game = new GameParameters();
        gameServiceSpy.game.stock = new LetterStock();
        gameServiceSpy.game.gameTimer = new GameTimer();
        const creator: Player = new Player('Riri');
        const joiner: Player = new Player('Lulu');
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

    // socketOnConnect tests
    it('should catch socket gameEnded event', () => {
        service.socketOnConnect();
        socketMock.triggerEvent('gameEnded');
        expect(socketOnMockSpy).toHaveBeenCalled();
    });

    // endGame tests
    it('endGame should call socket emit', () => {
        gameServiceSpy.game.gameMode = GameType.MultiPlayer;
        service.endGame();
        expect(socketEmitMockSpy).toHaveBeenCalled();
    });

    it('endGame should call endLocalGame', () => {
        const endLocalGameSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'endLocalGame' as any);
        service.endGame();
        expect(endLocalGameSpy).toHaveBeenCalled();
    });

    // endLocalGame tests
    it('endLocalGame should call endGameAfterPlace if the stock is empty and one of the players no have letters anymore', () => {
        const endGameAfterPlaceSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'endGameAfterPlace' as any);
        gameServiceSpy.game.getLocalPlayer().letters = [];
        gameServiceSpy.game.stock.letterStock = [];

        service['endLocalGame']();
        expect(endGameAfterPlaceSpy).toHaveBeenCalled();
    });

    it('endLocalGame should call endGameAfterPassedTurns if the stock is not empty and both players have letters', () => {
        const endGameAfterPassedTurnsSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'endGameAfterPassedTurns' as any);
        gameServiceSpy.game.getLocalPlayer().letters = [new ScrabbleLetter('j')];
        gameServiceSpy.game.getOpponent().letters = [new ScrabbleLetter('d')];

        service['endLocalGame']();
        expect(endGameAfterPassedTurnsSpy).toHaveBeenCalled();
    });

    it('endLocalGame should handle error when getting one and call snackBar open', () => {
        gameServiceSpy.game.isLog2990 = true;
        const spy: jasmine.Spy<jasmine.Func> = spyOn(service['snack'], 'open');
        const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
        bestScoresServiceSpy.postBestScore.and.returnValue(throwError(errorResponse));

        service['endLocalGame']();
        expect(spy).toHaveBeenCalled();
    });

    // endGameAfterPlace tests
    it('endGameAfterPlace should set isWinner for the winner', () => {
        service['endGameAfterPlace']();
        expect(gameServiceSpy.game.getLocalPlayer().isWinner).toBeTrue();
        expect(gameServiceSpy.game.getOpponent().isWinner).toBeFalse();

        gameServiceSpy.game.getLocalPlayer().letters = [new ScrabbleLetter('e')];
        service['endGameAfterPlace']();
        expect(gameServiceSpy.game.getLocalPlayer().isWinner).toBeFalse();
        expect(gameServiceSpy.game.getOpponent().isWinner).toBeTrue();
    });

    // endGameAfterPassedTurns tests
    it('endGameAfterPassedTurns should set isWinner for the winner', () => {
        gameServiceSpy.game.players[0].score = 5;
        gameServiceSpy.game.players[1].score = 27;
        service['endGameAfterPassedTurns']();
        expect(gameServiceSpy.game.players[0].isWinner).toBeFalse();
        expect(gameServiceSpy.game.players[1].isWinner).toBeTrue();
    });
});
