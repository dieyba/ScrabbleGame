// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatCardModule } from '@angular/material/card';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { GameParameters, GameType } from '@app/classes/game-parameters';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter';
// import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
// import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
// import { GameService } from '@app/services/game.service';
// import { LetterStock } from '@app/services/letter-stock.service';
// import { Observable, of } from 'rxjs';
// import * as io from 'socket.io-client';

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-empty-function */
// /* eslint-disable prefer-arrow/prefer-arrow-functions */
// /* eslint-disable dot-notation */
// /* eslint-disable no-unused-vars */
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
//     emit(...args: any[]) {
//         return;
//     }

//     disconnect() {
//         return;
//     }
// }

// /* eslint-disable  @typescript-eslint/no-magic-numbers */
// describe('SidebarComponent', () => {
//     let component: SidebarComponent;
//     let fixture: ComponentFixture<SidebarComponent>;
//     let gameServiceSpy: jasmine.SpyObj<GameService>;
//     let isClosed = true;
//     let socketMock: SocketMock;
//     let socketMockSpy: jasmine.SpyObj<any>;
//     const dialogRefStub = {
//         afterClosed() {
//             return of(isClosed);
//         },
//     };
//     const dialogStub = { open: () => dialogRefStub };

//     beforeEach(async () => {
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['currentGameService', 'initializeGameType']);
//         await TestBed.configureTestingModule({
//             declarations: [SidebarComponent],
//             imports: [MatCardModule],
//             providers: [
//                 { provide: GameService, useValue: gameServiceSpy },
//                 { provide: Router, useValue: { navigate: () => new Observable() } },
//                 { provide: MatDialog, useValue: dialogStub },
//                 { provide: MatDialogRef, useValue: { close: () => {} } },
//             ],
//         }).compileComponents();

//         const firstLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
//         const secondLetter: ScrabbleLetter = new ScrabbleLetter('p', 3);
//         const thirdLetter: ScrabbleLetter = new ScrabbleLetter('u', 4);
//         const fourthLetter: ScrabbleLetter = new ScrabbleLetter('m', 3);

//         gameServiceSpy.initializeGameType(GameType.Solo);
//         gameServiceSpy.currentGameService.game = new GameParameters('Ariane', 60, false);
//         gameServiceSpy.currentGameService.game.creatorPlayer = new LocalPlayer('Ariane');
//         gameServiceSpy.currentGameService.game.creatorPlayer.score = 73;
//         gameServiceSpy.currentGameService.game.creatorPlayer.letters = [firstLetter, secondLetter, thirdLetter, fourthLetter];
//         gameServiceSpy.currentGameService.game.localPlayer = gameServiceSpy.currentGameService.game.creatorPlayer;
//         gameServiceSpy.currentGameService.game.opponentPlayer = new VirtualPlayer('Sara', Difficulty.Easy);
//         gameServiceSpy.currentGameService.game.opponentPlayer.score = 70;
//         gameServiceSpy.currentGameService.game.opponentPlayer.letters = [firstLetter, thirdLetter, firstLetter];
//         gameServiceSpy.currentGameService.stock = new LetterStock();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SidebarComponent);
//         component = fixture.componentInstance;
//         socketMock = new SocketMock();
//         component['socket'] = socketMock as unknown as io.Socket;
//         socketMockSpy = spyOn(socketMock, 'on').and.callThrough();
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('socketOnConnect should handle socket.on event roomdeleted', () => {
//         component.roomLeft();
//         const game = new GameParameters('dieyba', 0, false);
//         socketMock.triggerEvent('roomLeft', game);
//         expect(socketMockSpy).toHaveBeenCalled();
//     });

//     it('getPlayer1Name should return the right name', () => {
//         expect(component.getPlayer1Name()).toEqual('Ariane');
//     });

//     it('getPlayer2Name should return the right name', () => {
//         expect(component.getPlayer2Name()).toEqual('Sara');
//     });

//     it('getPlayer1LetterCount should return the right count', () => {
//         expect(component.getPlayer1LetterCount()).toEqual(4);
//     });

//     it('getPlayer2LetterCount should return the right count', () => {
//         expect(component.getPlayer2LetterCount()).toEqual(3);
//     });

//     it('getPlayer1Score should return the right score', () => {
//         expect(component.getPlayer1Score()).toEqual(73);
//     });

//     it('getPlayer2Score should return the right score', () => {
//         expect(component.getPlayer2Score()).toEqual(70);
//     });

//     it('isPlayer1Active should return the right value', () => {
//         gameServiceSpy.currentGameService.game.creatorPlayer.isActive = true;
//         expect(component.isPlayer1Active()).toEqual(true);
//     });

//     it('isPlayer2Active should return the right value', () => {
//         gameServiceSpy.currentGameService.game.opponentPlayer.isActive = true;
//         expect(component.isPlayer2Active()).toEqual(true);
//     });

//     it('getTimer should return game service timer', () => {
//         gameServiceSpy.currentGameService.timer = '1:00';
//         expect(component.getTimer()).toEqual('1:00');
//     });

//     it('hasWinner should return true if one winner exists', () => {
//         gameServiceSpy.currentGameService.game.opponentPlayer.isWinner = true;
//         gameServiceSpy.currentGameService.game.creatorPlayer.isWinner = false;
//         expect(component.hasWinner()).toEqual(true);
//     });

//     it('hasWinner should return false if no winner exists', () => {
//         gameServiceSpy.currentGameService.game.opponentPlayer.isWinner = false;
//         gameServiceSpy.currentGameService.game.creatorPlayer.isWinner = false;
//         expect(component.hasWinner()).toEqual(false);
//     });

//     it('isDrawnGame should return false if one winner exists', () => {
//         gameServiceSpy.currentGameService.game.opponentPlayer.isWinner = true;
//         gameServiceSpy.currentGameService.game.creatorPlayer.isWinner = false;
//         expect(component.isDrawnGame()).toEqual(false);
//     });

//     it('isDrawnGame should return true if two winner exists', () => {
//         gameServiceSpy.currentGameService.game.opponentPlayer.isWinner = true;
//         gameServiceSpy.currentGameService.game.creatorPlayer.isWinner = true;
//         expect(component.isDrawnGame()).toEqual(true);
//     });

//     it('getWinnerName should set winnerName to right name if one winner exists', () => {
//         gameServiceSpy.currentGameService.game.opponentPlayer.isWinner = true;
//         gameServiceSpy.currentGameService.game.creatorPlayer.isWinner = false;
//         component.getWinnerName();
//         expect(component.winnerName).toEqual('Sara');
//     });

//     it('getWinnerName should set winnerName to right name if one winner exists', () => {
//         gameServiceSpy.currentGameService.game.opponentPlayer.isWinner = false;
//         gameServiceSpy.currentGameService.game.creatorPlayer.isWinner = true;
//         component.getWinnerName();
//         expect(component.winnerName).toEqual('Ariane');
//     });

//     it('getWinnerName should set winnerName to two names if two winners exists', () => {
//         gameServiceSpy.currentGameService.game.opponentPlayer.isWinner = true;
//         gameServiceSpy.currentGameService.game.creatorPlayer.isWinner = true;
//         component.getWinnerName();
//         expect(component.winnerName).toEqual('Ariane et Sara');
//     });

//     it('quitGame should call router', () => {
//         isClosed = true;
//         const routerRefSpyObj = jasmine.createSpyObj({ navigate: '/start' });
//         const router = spyOn(TestBed.get(Router), 'navigate').and.returnValue(routerRefSpyObj); // eslint-disable-line deprecation/deprecation
//         component.quitGame();
//         expect(router).toHaveBeenCalled();
//     });

//     it('quitGame() should open dialog', () => {
//         const matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefStub); // eslint-disable-line deprecation/deprecation
//         component.quitGame();
//         expect(matdialog).toHaveBeenCalled();
//     });

//     it('quitGame should call not router is dialog is not closed', () => {
//         isClosed = false;
//         const routerRefSpyObj = jasmine.createSpyObj({ navigate: '/start' });
//         const router = spyOn(TestBed.get(Router), 'navigate').and.returnValue(routerRefSpyObj); // eslint-disable-line deprecation/deprecation
//         component.quitGame();
//         expect(router).not.toHaveBeenCalled();
//     });
//     it('socketOnConnect should handle socket.on event roomdeleted', () => {
//         component.roomLeft();
//         const game = new GameParameters('dieyba', 0, false);
//         socketMock.triggerEvent('roomLeft', game);
//         expect(socketMockSpy).toHaveBeenCalled();
//     });
// });
