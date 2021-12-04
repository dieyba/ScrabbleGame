// import { HttpClientModule } from '@angular/common/http';
// import { Renderer2 } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { Router, RouterModule } from '@angular/router';
// import { DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID, GameParameters, GameType } from '@app/classes/game-parameters/game-parameters';
// import { LetterStock } from '@app/classes/letter-stock/letter-stock';
// import { Player } from '@app/classes/player/player';
// import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
// import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
// import { ChatDisplayComponent } from '@app/components/chat-display/chat-display.component';
// import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
// import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
// import { DEFAULT_LETTER_COUNT, GameService } from '@app/services/game.service/game.service';
// import { GridService } from '@app/services/grid.service/grid.service';
// import { RackService } from '@app/services/rack.service/rack.service';
// import { ValidationService } from '@app/services/validation.service/validation.service';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { GamePageComponent } from './game-page.component';

// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable prefer-arrow/prefer-arrow-functions */
// describe('GamePageComponent', () => {
//     let component: GamePageComponent;
//     let fixture: ComponentFixture<GamePageComponent>;
//     let gameServiceSpy: jasmine.SpyObj<GameService>;
//     let rackServiceSpy: jasmine.SpyObj<RackService>;
//     let validationServiceSpy: jasmine.SpyObj<ValidationService>;
//     let gridServiceSpy: jasmine.SpyObj<GridService>;
//     let gameParametersSpy: jasmine.SpyObj<GameParameters>;
//     let rendererSpy: jasmine.SpyObj<Renderer2>;
//     let isClosed = true;

//     const dialogRefStub = {
//         // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
//         afterClosed() {
//             return of(isClosed);
//         },
//     };
//     const dialogStub = { open: () => dialogRefStub };

//     beforeEach(async () => {
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['startNewGame', 'initializeSoloGame', 'getLocalPlayer', 'canNavBack', 'addRackLetters', 'resetTimer']);
//         gameParametersSpy = jasmine.createSpyObj('GameParameters', ['getLocalPlayer']);
//         rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'deselectForExchange', 'selectForExchange'], {
//             ['exchangeSelected']: [false, false, false, false, false, false, false],
//         });
//         validationServiceSpy = jasmine.createSpyObj('ValidationService', ['validWordsFormed']);
//         gridServiceSpy = jasmine.createSpyObj('GridService', ['scrabbleBoard', 'drawGrid', 'drawColors']);
//         rendererSpy = jasmine.createSpyObj('Renderer2', ['style', 'setStyle']);
//         await TestBed.configureTestingModule({
//             declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent, ChatDisplayComponent],
//             imports: [RouterModule, MatDialogModule, HttpClientModule, MatSnackBarModule],
//             providers: [
//                 { provide: Router, useValue: { navigate: () => new Observable() } },
//                 { provide: MatDialog, dialogStub },
//                 { provide: GameService, useValue: gameServiceSpy },
//                 { provide: RackService, useValue: rackServiceSpy },
//                 { provide: GameParameters, useValue: gameParametersSpy },
//                 { provide: GridService, useValue: gridServiceSpy },
//                 { provide: ValidationService, useValue: validationServiceSpy },
//                 { provide: Renderer2, useValue: rendererSpy },
//             ],
//         }).compileComponents();
//         //const gameInfo = new WaitingAreaGameParameters(GameType.Solo, 2, DictionaryType.Default, 60, false, false, 'Ariane', 'Sara');
//         gameServiceSpy.game = new GameParameters();
//         //gameServiceSpy.initializeSoloGame(gameInfo, Difficulty.Easy);
//         gameServiceSpy.game.scrabbleBoard = new ScrabbleBoard(false);
//         gameServiceSpy.game.stock = new LetterStock();
//         gameServiceSpy.game.gameMode = GameType.Solo;
//         gameServiceSpy.game.isLog2990 = false;
//         gameServiceSpy.game.isEndGame = false;
//         gameServiceSpy.game.gameTimer.initializeTotalCountDown(60);
//         gameServiceSpy.game.setLocalAndOpponentId(DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID);
//         gameServiceSpy.game.setLocalPlayer(new Player('Ariane'));
//         gameServiceSpy.game.setOpponent(new VirtualPlayer('Sara', Difficulty.Easy));
//         gameServiceSpy.game.getLocalPlayer().letters = gameServiceSpy.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
//         gameServiceSpy.game.getOpponent().letters = gameServiceSpy.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
//         const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
//         gameServiceSpy.game.players[starterPlayerIndex].isActive = true;
//         gameServiceSpy.isTurnEndSubject = new BehaviorSubject<boolean>(gameServiceSpy.isTurnPassed);
//         gameServiceSpy.isTurnEndObservable = gameServiceSpy.isTurnEndSubject.asObservable();
//         rackServiceSpy.rackLetters = [];
//         validationServiceSpy.validWordsFormed = [];
//         gridServiceSpy.scrabbleBoard = gameServiceSpy.game.scrabbleBoard;
//         gameServiceSpy.addRackLetters(gameServiceSpy.game.getLocalPlayer().letters);
//     });
//     beforeEach(() => {
//         TestBed.createComponent(SidebarComponent);
//         fixture = TestBed.createComponent(GamePageComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('onPopState should open end game dialog if canNavBack is false (leave)', () => {
//         const matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefStub); // eslint-disable-line deprecation/deprecation
//         component.canNavBack = false;
//         isClosed = true;
//         component.onPopState();
//         expect(matdialog).toHaveBeenCalled();
//         expect(component.canNavBack).toBeTruthy();
//     });

//     it('onPopState should open end game dialog if canNavBack is false (stay)', () => {
//         const matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefStub); // eslint-disable-line deprecation/deprecation
//         component.canNavBack = false;
//         isClosed = false;
//         component.onPopState();
//         expect(matdialog).toHaveBeenCalled();
//         expect(component.canNavBack).not.toBeTruthy();
//     });

//     it('onPopState should not open end game dialog if canNavBack is true', () => {
//         const matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefStub); // eslint-disable-line deprecation/deprecation
//         component.canNavBack = true;
//         component.onPopState();
//         expect(matdialog).not.toHaveBeenCalled();
//         expect(component.canNavBack).toBeTruthy();
//     });
// });
