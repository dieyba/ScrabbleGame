import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID, GameParameters, GameType } from '@app/classes/game-parameters/game-parameters';
import { LetterStock } from '@app/classes/letter-stock/letter-stock';
import { Player } from '@app/classes/player/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DEFAULT_LETTER_COUNT, GameService } from '@app/services/game.service/game.service';
import { GoalsService } from '@app/services/goals.service/goals.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as io from 'socket.io-client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
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

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let goalsServiceSpy: jasmine.SpyObj<GoalsService>;
    let isClosed = true;
    let socketMock: SocketMock;
    const dialogRefStub = {
        afterClosed() {
            return of(isClosed);
        },
    };
    const dialogStub = { open: () => dialogRefStub };

    beforeEach(async () => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['currentGameService', 'initializeGameType', 'addRackLetters']);
        goalsServiceSpy = jasmine.createSpyObj('GoalsService', ['sharedGoals', 'goalsCreationMap', 'privateGoals', 'getGoalOfAPlayer', 'initialize']);
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [MatCardModule],
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
                { provide: GoalsService, useValue: goalsServiceSpy },
                { provide: Router, useValue: { navigate: () => new Observable() } },
                { provide: MatDialog, useValue: dialogStub },
                { provide: MatDialogRef, useValue: { close: () => {} } },
            ],
        }).compileComponents();

        gameServiceSpy.game = new GameParameters();
        //gameServiceSpy.initializeSoloGame(gameInfo, Difficulty.Easy);
        gameServiceSpy.game.scrabbleBoard = new ScrabbleBoard(false);
        gameServiceSpy.game.stock = new LetterStock()
        gameServiceSpy.game.gameMode = GameType.Solo;
        gameServiceSpy.game.isLog2990 = false;
        gameServiceSpy.game.isEndGame = false;
        gameServiceSpy.game.gameTimer.initializeTotalCountDown(60);
        gameServiceSpy.game.setLocalAndOpponentId(DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID);
        gameServiceSpy.game.setLocalPlayer(new Player('Ariane'));
        gameServiceSpy.game.setOpponent(new VirtualPlayer('Sara', Difficulty.Easy));
        gameServiceSpy.game.getLocalPlayer().letters = gameServiceSpy.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        gameServiceSpy.game.getOpponent().letters = gameServiceSpy.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
        gameServiceSpy.game.players[starterPlayerIndex].isActive = true;
        gameServiceSpy.isTurnEndSubject = new BehaviorSubject<boolean>(gameServiceSpy.isTurnPassed);
        gameServiceSpy.isTurnEndObservable = gameServiceSpy.isTurnEndSubject.asObservable();
        gameServiceSpy.addRackLetters(gameServiceSpy.game.getLocalPlayer().letters);
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].score = 70;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        socketMock = new SocketMock();
        component['socket'] = socketMock as unknown as io.Socket;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getPlayer1Name should return the right name', () => {
        expect(component.getPlayer1Name()).toEqual('Ariane');
    });

    it('getPlayer2Name should return the right name', () => {
        expect(component.getPlayer2Name()).toEqual('Sara');
    });

    it('getPlayer1LetterCount should return the right count', () => {
        expect(component.getPlayer1LetterCount()).toEqual(7);
    });

    it('getPlayer2LetterCount should return the right count', () => {
        expect(component.getPlayer2LetterCount()).toEqual(7);
    });

    it('getPlayer1Score should return the right score', () => {
        expect(component.getPlayer1Score()).toEqual(70);
    });

    it('getPlayer2Score should return the right score', () => {
        expect(component.getPlayer2Score()).toEqual(0);
    });

    it('isPlayer1Active should return the right value', () => {
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isActive = true;
        expect(component.isPlayer1Active()).toEqual(true);
    });

    it('isPlayer1Active should return false when there are more tahn 2 players', () => {
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isActive = true;
        gameServiceSpy.game.players.push(new Player('ARI'));
        expect(component.isPlayer1Active()).toEqual(false);
    });

    it('isPlayer2Active should return the right value', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isActive = true;
        expect(component.isPlayer2Active()).toEqual(true);
    });

    it('isPlayer2Active should return false when there are more tahn 2 players', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isActive = true;
        gameServiceSpy.game.players.push(new Player('ARI'));
        expect(component.isPlayer2Active()).toEqual(false);
    });

    it('getTimer should return game service timer', () => {
        gameServiceSpy.game.gameTimer.timer = '1:00';
        expect(component.getTimer()).toEqual('1:00');
    });

    it('hasWinner should return true if one winner exists', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isWinner = true;
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isWinner = false;
        expect(component.hasWinner()).toEqual(true);
    });

    it('hasWinner should return false if no winner exists', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isWinner = false;
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isWinner = false;
        expect(component.hasWinner()).toEqual(false);
    });

    it('isDrawnGame should return false if one winner exists', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isWinner = true;
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isWinner = false;
        expect(component.isDrawnGame()).toEqual(false);
    });

    it('isDrawnGame should return true if two winner exists', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isWinner = true;
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isWinner = true;
        expect(component.isDrawnGame()).toEqual(true);
    });

    it('getWinnerName should set winnerName to right name if one winner exists', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isWinner = true;
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isWinner = false;
        component.getWinnerName();
        expect(component.winnerName).toEqual('Sara');
    });

    it('getWinnerName should set winnerName to right name if one winner exists', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isWinner = false;
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isWinner = true;
        component.getWinnerName();
        expect(component.winnerName).toEqual('Ariane');
    });

    it('getWinnerName should set winnerName to two names if two winners exists', () => {
        gameServiceSpy.game.players[DEFAULT_OPPONENT_ID].isWinner = true;
        gameServiceSpy.game.players[DEFAULT_LOCAL_PLAYER_ID].isWinner = true;
        component.getWinnerName();
        expect(component.winnerName).toEqual('Ariane et Sara');
    });

    it('quitGame should call router', () => {
        isClosed = true;
        const routerRefSpyObj = jasmine.createSpyObj({ navigate: '/start' });
        const router = spyOn(TestBed.get(Router), 'navigate').and.returnValue(routerRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.quitGame();
        expect(router).toHaveBeenCalled();
    });

    it('quitGame() should open dialog', () => {
        const matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefStub); // eslint-disable-line deprecation/deprecation
        component.quitGame();
        expect(matdialog).toHaveBeenCalled();
    });

    it('quitGame should call not router is dialog is not closed', () => {
        isClosed = false;
        const routerRefSpyObj = jasmine.createSpyObj({ navigate: '/start' });
        const router = spyOn(TestBed.get(Router), 'navigate').and.returnValue(routerRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.quitGame();
        expect(router).not.toHaveBeenCalled();
    });

    // it('getPrivateGoalDescription should return right goal description', () => {
    //     goalsServiceSpy.privateGoals = [];
    //     goalsServiceSpy.goalsCreationMap = new Map();
    //     goalsServiceSpy.initialize();
    //     goalsServiceSpy.privateGoals.push(new ActivateTwoBonuses);        
    //     goalsServiceSpy.privateGoals.push(new FormAnExistingWord);
    //     console.log('HI ' + goalsServiceSpy.privateGoals[0].type);
    //     component.localPlayer = new Player('Ariane');
    //     component.localPlayer.goal = GoalType.ActivateTwoBonuses;
    //     console.log('HI ' + goalsServiceSpy.getGoalOfAPlayer(component.localPlayer));
    //     expect(component.getPrivateGoalDescription()).toEqual(GoalDescriptions.ActivateTwoBonuses);
    // });

    // it('getOpponentGoalDescription should return right goal description', () => {
    //     goalsServiceSpy.privateGoals = [];
    //     goalsServiceSpy.goalsCreationMap = new Map();
    //     goalsServiceSpy.initialize();
    //     goalsServiceSpy.privateGoals.push(new ActivateTwoBonuses);        
    //     goalsServiceSpy.privateGoals.push(new FormAnExistingWord);
    //     component.opponentPlayer.goal = GoalType.ActivateTwoBonuses;
    //     expect(component.getOpponentGoalDescription()).toEqual(GoalDescriptions.ActivateTwoBonuses);
    // });
});
