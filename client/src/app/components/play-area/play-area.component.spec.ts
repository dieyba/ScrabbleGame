/* eslint-disable max-len */
// import { HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatCardModule } from '@angular/material/card';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { Router, RouterModule } from '@angular/router';
// import { DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID, GameParameters, GameType } from '@app/classes/game-parameters/game-parameters';
// import { LetterStock } from '@app/classes/letter-stock/letter-stock';
// import { Player } from '@app/classes/player/player';
// import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
// import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
// import { DEFAULT_HEIGHT, DEFAULT_WIDTH, PlayAreaComponent } from '@app/components/play-area/play-area.component';
// import { CommandInvokerService } from '@app/services/command-invoker.service/command-invoker.service';
// import { ExchangeService } from '@app/services/exchange.service/exchange.service';
// import { DEFAULT_LETTER_COUNT, GameService } from '@app/services/game.service/game.service';
// import { GridService } from '@app/services/grid.service/grid.service';
// import { MouseWordPlacerService } from '@app/services/mouse-word-placer.service/mouse-word-placer.service';
// import { RackService, RACK_HEIGHT, RACK_WIDTH } from '@app/services/rack.service/rack.service';
// import { BehaviorSubject, Observable } from 'rxjs';

// /* eslint-disable  @typescript-eslint/no-unused-expressions */
// /* eslint-disable  no-unused-expressions */
// describe('PlayAreaComponent', () => {
//     let component: PlayAreaComponent;
//     let fixture: ComponentFixture<PlayAreaComponent>;
//     let gridServiceSpy: jasmine.SpyObj<GridService>;
//     let gameServiceSpy: jasmine.SpyObj<GameService>;
//     let rackServiceSpy: jasmine.SpyObj<RackService>;
//     let commandInvokerServiceSpy: jasmine.SpyObj<CommandInvokerService>;
//     let mouseWordPlacerServiceSpy: jasmine.SpyObj<MouseWordPlacerService>;
//     let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;

//     beforeEach(async () => {
//         TestBed.configureTestingModule({
//             imports: [MatCardModule, RouterModule, HttpClientModule, MatSnackBarModule],
//         });
//         gridServiceSpy = jasmine.createSpyObj('GridService', ['sizeUpLetters', 'sizeDownLetters', 'drawGrid', 'drawColors', 'drawLetter']);
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['currentGameService', 'initializeGameType', 'startNewGame', 'addRackLetters', 'resetTimer']);
//         commandInvokerServiceSpy = jasmine.createSpyObj('CommandInvokerService', ['executeCommand']);
//         mouseWordPlacerServiceSpy = jasmine.createSpyObj('MouseWordPlacerService', ['onKeyDown', 'onBlur', 'onMouseClick', 'confirmWord']);
//         exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['atLeastOneLetterSelected', 'exchange', 'cancelExchange', 'atLeastOneLetterSelected']);
//         // pour les properties, cette fa??n de faire emp??che les modifs. check sur le lien suivant pour modifer ??a.
//         // https://stackoverflow.com/questions/64560390/jasmine-createspyobj-with-properties
//         rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'select', 'deselect', 'deselectAll', 'handleExchangeSelection'], {
//             ['exchangeSelected']: [false, false, false, false, false, false, false],
//         });
//         await TestBed.configureTestingModule({
//             declarations: [PlayAreaComponent],
//             providers: [
//                 { provide: GridService, useValue: gridServiceSpy },
//                 { provide: GameService, useValue: gameServiceSpy },
//                 { provide: RackService, useValue: rackServiceSpy },
//                 { provide: CommandInvokerService, useValue: commandInvokerServiceSpy },
//                 { provide: MouseWordPlacerService, useValue: mouseWordPlacerServiceSpy },
//                 { provide: ExchangeService, useValue: exchangeServiceSpy },
//                 { provide: Router, useValue: { navigate: () => new Observable() } },
//             ],
//         }).compileComponents();

//         gameServiceSpy.game = new GameParameters();
//         //gameServiceSpy.initializeSoloGame(gameInfo, Difficulty.Easy);
//         gameServiceSpy.game.scrabbleBoard = new ScrabbleBoard(false);
//         gameServiceSpy.game.stock = new LetterStock()
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
//         gridServiceSpy.scrabbleBoard = gameServiceSpy.game.scrabbleBoard;
//         gameServiceSpy.addRackLetters(gameServiceSpy.game.getLocalPlayer().letters);
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(PlayAreaComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('onKeyDown should call mouseWordPlacerService onKeyDown method', () => {
//         const keyboardEvent = {
//             code: 'a',
//         } as KeyboardEvent;
//         component.onKeyDown(keyboardEvent);
//         expect(mouseWordPlacerServiceSpy.onKeyDown).toHaveBeenCalled();
//     });

//     it('onBlur should do nothing if document doesn\'t have focus or relatedTarget is null or relatedTarget is "confirm"', () => {
//         let focusEventMock: unknown = { relatedTarget: null };
//         const hasFocusSpy = spyOn(document, 'hasFocus').and.returnValue(false);
//         mouseWordPlacerServiceSpy.onBlur.calls.reset(); // Reset previous calls. I don't know why this function is called before the test

//         component.onBlur(focusEventMock as FocusEvent);

//         hasFocusSpy.and.returnValue(true);

//         component.onBlur(focusEventMock as unknown as FocusEvent);

//         focusEventMock = { relatedTarget: { id: 'confirm' } };

//         component.onBlur(focusEventMock as unknown as FocusEvent);

//         expect(hasFocusSpy).toHaveBeenCalled();
//         expect(mouseWordPlacerServiceSpy.onBlur).not.toHaveBeenCalled();
//     });

//     // it('onBlur should call MouseWordPlacerService.onBlur when relatedTarget.id is not confirm', () => {
//     //     const focusEventMock = { relatedTarget: { id: 'notConfirm' } };
//     //     spyOn(document, 'hasFocus').and.returnValue(true);
//     //     mouseWordPlacerServiceSpy.onBlur.calls.reset(); // Reset previous calls. I don't know why this function is called before the test

//     //     component.onBlur(focusEventMock as unknown as FocusEvent);

//     //     expect(mouseWordPlacerServiceSpy.onBlur).toHaveBeenCalled();
//     // }); // TODO fix this test

//     it('ngAfterViewInit should call drawGrid and drawColors', () => {
//         component.ngAfterViewInit();
//         expect(gameServiceSpy.startNewGame).toHaveBeenCalled();
//         expect(gridServiceSpy.drawGrid).toHaveBeenCalled();
//         expect(gridServiceSpy.drawColors).toHaveBeenCalled();
//     });

//     it('passTurn should call commandInvokerService.executeCommand', () => {
//         component.passTurn();
//         expect(commandInvokerServiceSpy.executeCommand).toHaveBeenCalled();
//     });

//     it('width should return the width of the canvas', () => {
//         expect(component.width).toEqual(DEFAULT_WIDTH);
//     });

//     it('height should return the height of the canvas', () => {
//         expect(component.height).toEqual(DEFAULT_HEIGHT);
//     });

//     it('rackHeight should return play area rack height', () => {
//         expect(component.rackHeight).toEqual(RACK_HEIGHT);
//     });

//     it('rackWidth should return play area rack width', () => {
//         expect(component.rackWidth).toEqual(RACK_WIDTH);
//     });

//     it('sizeUpLetters should call gridservices sizeUpLetters', () => {
//         component.sizeUpLetters();
//         expect(gridServiceSpy.sizeUpLetters).toHaveBeenCalled();
//     });

//     it('sizeDownLetters should call gridservices sizeDownLetters', () => {
//         component.sizeDownLetters();
//         expect(gridServiceSpy.sizeDownLetters).toHaveBeenCalled();
//     });

//     it('onMouseDown should call mouseWordPlacerService onMouseClick method', () => {
//         const mouseEvent = {
//             offsetX: 25,
//             offsetY: 25,
//             button: 0,
//         } as MouseEvent;
//         component.onMouseDown(mouseEvent);
//         expect(mouseWordPlacerServiceSpy.onMouseClick).toHaveBeenCalled();
//     });

//     it('confirmWord should call confirmWord mouseWordPlacerService', () => {
//         component.confirmWord();
//         expect(mouseWordPlacerServiceSpy.confirmWord).toHaveBeenCalled();
//     });

//     it('atLeastOneLetterSelected should call exchangeService atLeastOneLetterSelected', () => {
//         component.atLeastOneLetterSelected();
//         expect(exchangeServiceSpy.atLeastOneLetterSelected).toHaveBeenCalled();
//     });

//     it('lessThanSevenLettersInStock should return the right value', () => {
//         expect(component.lessThanSevenLettersInStock()).toEqual(false);
//     });

//     it('lessThanSevenLettersInStock should return true if there is less than seven letters in the letter stock', () => {
//         gameServiceSpy.game.stock.letterStock = [new ScrabbleLetter('j'), new ScrabbleLetter('p')];
//         expect(component.lessThanSevenLettersInStock()).toBeTrue();

//         gameServiceSpy.game.stock.letterStock = [
//             new ScrabbleLetter('j'),
//             new ScrabbleLetter('p'),
//             new ScrabbleLetter('b'),
//             new ScrabbleLetter('l'),
//             new ScrabbleLetter('d'),
//             new ScrabbleLetter('w'),
//             new ScrabbleLetter('z'),
//         ];
//         expect(component.lessThanSevenLettersInStock()).toBeFalse();
//     });

//     it('exchange should call exchangeService exchange method', () => {
//         component.exchange();
//         expect(exchangeServiceSpy.exchange).toHaveBeenCalled();
//     });

//     it('cancelExchange should call exchangeService cancelExchange method', () => {
//         component.cancelExchange();
//         expect(exchangeServiceSpy.cancelExchange).toHaveBeenCalled();
//     });
// });
