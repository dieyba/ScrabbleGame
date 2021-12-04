/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper/canvas-test-helper';
import { GameParameters } from '@app/classes/game-parameters/game-parameters';
import { Player } from '@app/classes/player/player';
import { BOARD_SIZE, ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { Axis } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { CommandInvokerService } from '@app/services/command-invoker.service/command-invoker.service';
import { GameService } from '@app/services/game.service/game.service';
import {
    ABSOLUTE_BOARD_SIZE,
    ACTUAL_SQUARE_SIZE,
    BOARD_OFFSET,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    GridService
} from '@app/services/grid.service/grid.service';
import { MouseWordPlacerCompanionService } from '@app/services/mouse-word-placer-companion.service/mouse-word-placer-companion.service';
import { MouseWordPlacerService } from '@app/services/mouse-word-placer.service/mouse-word-placer.service';
import { RackService, RACK_HEIGHT, RACK_WIDTH } from '@app/services/rack.service/rack.service';

describe('MouseWordPlacerService', () => {
    let service: MouseWordPlacerService;
    let ctxSpy: CanvasRenderingContext2D;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let cmdServiceSpy: jasmine.SpyObj<CommandInvokerService>;
    let companionServiceSpy: jasmine.SpyObj<MouseWordPlacerCompanionService>;
    const SEVEN_INDEX = 6;
    const H_INDEX = 7;
    const SEVEN_POS = 236;
    const H_POS = 272;
    beforeEach(() => {
        const gridSpy = jasmine.createSpyObj('GridService', ['drawLetter', 'drawLetters', 'drawSingleSquareColor']); // Every method I need
        const rackSpy = jasmine.createSpyObj('RackService', ['addLetter', 'drawExistingLetters', 'drawRack']);
        const gameSpy = jasmine.createSpyObj('GameService', ['currentGameService']);
        const cmdSpy = jasmine.createSpyObj('CommandInvokerService', ['executeCommand']);
        const companionSpy = jasmine.createSpyObj('MouseWordPlacerCompanionService', [
            'convertPositionToGridIndex',
            'findPreviousSquare',
            'convertColorToString',
            'changeFillStyleColor',
            'findNextSquare',
            'samePosition',
        ]);
        ctxSpy = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        // Provide both the service-to-test and its (spy) dependency
        // Inject both the service-to-test and its (spy) dependency
        TestBed.configureTestingModule({
            providers: [
                MouseWordPlacerService,
                { provide: GridService, useValue: gridSpy },
                { provide: RackService, useValue: rackSpy },
                { provide: GameService, useValue: gameSpy },
                { provide: CommandInvokerService, useValue: cmdSpy },
                { provide: MouseWordPlacerCompanionService, useValue: companionSpy },
            ],
        });
        gridServiceSpy = TestBed.inject(GridService) as jasmine.SpyObj<GridService>;
        rackServiceSpy = TestBed.inject(RackService) as jasmine.SpyObj<RackService>;
        gameServiceSpy = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
        cmdServiceSpy = TestBed.inject(CommandInvokerService) as jasmine.SpyObj<CommandInvokerService>;
        companionServiceSpy = TestBed.inject(MouseWordPlacerCompanionService) as jasmine.SpyObj<MouseWordPlacerCompanionService>;
        service = TestBed.inject(MouseWordPlacerService);
        // Add functionality to companion service methods
        companionServiceSpy.convertPositionToGridIndex.and.callFake(MouseWordPlacerCompanionService.prototype.convertPositionToGridIndex);
        companionServiceSpy.findNextSquare.and.callFake(MouseWordPlacerCompanionService.prototype.findNextSquare);
        companionServiceSpy.findPreviousSquare.and.callFake(MouseWordPlacerCompanionService.prototype.findPreviousSquare);
        companionServiceSpy.changeFillStyleColor.and.callFake(MouseWordPlacerCompanionService.prototype.changeFillStyleColor);
        // Set spy attributes
        rackServiceSpy.rackLetters = [new ScrabbleLetter('t', 1)];
        rackServiceSpy.gridContext = CanvasTestHelper.createCanvas(RACK_WIDTH, RACK_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
        gameServiceSpy.game = new GameParameters();
        gameServiceSpy.game.setLocalAndOpponentId(0, 1);
        gameServiceSpy.game.setLocalPlayer(new Player('Étienne'));
        gameServiceSpy.game.getLocalPlayer().isActive = true;
        // Set service attributes
        service.wordString = 'test';
        service.currentWord = [new ScrabbleLetter('t', 1), new ScrabbleLetter('e', 1), new ScrabbleLetter('s', 1), new ScrabbleLetter('t', 1)];
        service.initialPosition = new Vec2(SEVEN_POS, H_POS); // First T: on square H7.
        service.latestPosition = new Vec2(SEVEN_POS, H_POS);
        const wordLength = service.currentWord.length;
        service.currentPosition = new Vec2(SEVEN_POS + ACTUAL_SQUARE_SIZE * wordLength, H_POS);
        service.currentAxis = Axis.H;
        service.overlayContext = ctxSpy;
        // Create spies that are reused in two onKeyDown tests
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('onMouseClick should not do anything if player is it is not the turn of the player', () => {
        const clearSpy = spyOn(service, 'clearOverlay');
        service.currentWord = [];
        gameServiceSpy.game.getLocalPlayer().isActive = false;
        const mouseEvent = new MouseEvent('click', {
            clientX: SEVEN_POS,
            clientY: H_POS,
        });
        service.onMouseClick(mouseEvent);
        // First function of the method should not be called
        expect(clearSpy).not.toHaveBeenCalled();
    });
    it('onMouseClick should not do anything if a word is being built on the canvas', () => {
        const clearSpy = spyOn(service, 'clearOverlay');
        // service.currentWord = [t, e, s, t]; (defined in beforeEach)
        const mouseEvent = new MouseEvent('click', {
            clientX: SEVEN_POS,
            clientY: H_POS,
        });
        service.onMouseClick(mouseEvent);
        // First function of the method should not be called
        expect(clearSpy).not.toHaveBeenCalled();
    });
    it('onMouseClick should not do anything if the game is over', () => {
        const clearSpy = spyOn(service, 'clearOverlay');
        service.currentWord = [];
        gameServiceSpy.game.isEndGame = true;
        const mouseEvent = new MouseEvent('click', {
            clientX: SEVEN_POS,
            clientY: H_POS,
        });
        service.onMouseClick(mouseEvent);
        // First function of the method should not be called
        expect(clearSpy).not.toHaveBeenCalled();
    });
    it('onMouseClick should draw an arrow on the initial position if an initial position is defined', () => {
        const clearSpy = spyOn(service, 'clearOverlay');
        const drawArrowSpy = spyOn(service, 'drawArrow');
        const removeAllLettersSpy = spyOn(service, 'removeAllLetters');
        service.currentWord = [];
        service.initialPosition = new Vec2(SEVEN_POS, H_POS);
        const mouseEvent = new MouseEvent('click', {
            clientX: SEVEN_POS,
            clientY: H_POS,
        });
        service.onMouseClick(mouseEvent);
        // First function of the method should not be called
        expect(clearSpy).toHaveBeenCalled();
        expect(drawArrowSpy).toHaveBeenCalled();
        expect(removeAllLettersSpy).toHaveBeenCalled();
    });
    it('onMouseClick should draw an arrow on clicked square if it is not the same as the latest clicked square', () => {
        const clearSpy = spyOn(service, 'clearOverlay');
        const drawArrowSpy = spyOn(service, 'drawArrow');
        const removeAllLettersSpy = spyOn(service, 'removeAllLetters');
        service.currentWord = [];
        const mouseEvent = new MouseEvent('click', {
            clientX: SEVEN_POS,
            clientY: H_POS,
        });
        service.onMouseClick(mouseEvent);
        // First function of the method should not be called
        expect(clearSpy).toHaveBeenCalled();
        expect(drawArrowSpy).toHaveBeenCalled();
        expect(removeAllLettersSpy).toHaveBeenCalled();
        // Since SEVEN_POS and H_POS are on the top left square corner, we can assert:
        expect(service.currentPosition).toEqual(new Vec2(SEVEN_POS, H_POS));
        expect(service.currentAxis).toEqual(Axis.H);
    });
    it('onMouseClick should draw a flipped arrow on the clicked square if it is the same as the latest clicked square', () => {
        const clearSpy = spyOn(service, 'clearOverlay');
        const drawArrowSpy = spyOn(service, 'drawArrow');
        const removeAllLettersSpy = spyOn(service, 'removeAllLetters');
        service.currentWord = [];
        service.latestPosition = new Vec2(SEVEN_POS, H_POS);
        const mouseEvent = new MouseEvent('click', {
            clientX: SEVEN_POS,
            clientY: H_POS,
        });
        companionServiceSpy.samePosition.and.returnValue(true);
        service.onMouseClick(mouseEvent);
        // First function of the method should not be called
        expect(clearSpy).toHaveBeenCalled();
        expect(drawArrowSpy).toHaveBeenCalled();
        expect(removeAllLettersSpy).toHaveBeenCalled();
        // Since SEVEN_POS and H_POS are on the top left square corner, we can assert:
        expect(service.currentPosition).toEqual(new Vec2(SEVEN_POS, H_POS));
        expect(service.currentAxis).toEqual(Axis.V);
        // Another click flips back the arrow
        service.onMouseClick(mouseEvent);
        expect(service.currentAxis).toEqual(Axis.H);
    });
    it('onMouseClick should reset the axis to Axis.H when clicking on a different square', () => {
        service.currentWord = [];
        service.latestPosition = new Vec2(SEVEN_POS + ACTUAL_SQUARE_SIZE, H_POS);
        const mouseEvent = new MouseEvent('click', {
            clientX: SEVEN_POS,
            clientY: H_POS,
        });
        service.currentAxis = Axis.V;
        companionServiceSpy.samePosition.and.returnValue(false);
        service.onMouseClick(mouseEvent);
        // First function of the method should not be called
        // Since SEVEN_POS and H_POS are on the top left square corner, we can assert:
        expect(service.currentPosition).toEqual(new Vec2(SEVEN_POS, H_POS));
        expect(service.currentAxis).toEqual(Axis.H);
    });
    it('onKeyDown should consider Backspace, Enter, Escape, or a letter on the keyboard', () => {
        gameServiceSpy.game.getLocalPlayer().letters = [
            new ScrabbleLetter('t', 1),
            new ScrabbleLetter('e', 1),
            new ScrabbleLetter('s', 1),
            new ScrabbleLetter('t', 1),
        ];
        const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
        const removeSpy = spyOn(service, 'removeLetter');
        service.onKeyDown(backspaceEvent);
        expect(removeSpy).toHaveBeenCalled();
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        const confirmSpy = spyOn(service, 'confirmWord');
        service.onKeyDown(enterEvent);
        expect(confirmSpy).toHaveBeenCalled();
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        const blurSpy = spyOn(service, 'onBlur');
        service.onKeyDown(escapeEvent);
        expect(blurSpy).toHaveBeenCalled();
        const letterEvent = new KeyboardEvent('keydown', { key: 'a' });
        const findPlaceSpy = spyOn(service, 'findPlaceForLetter');
        service.onKeyDown(letterEvent);
        expect(findPlaceSpy).toHaveBeenCalled();
    });
    it('onKeyDown should not consider keys that are not Backspace, Enter, Escape or a letter', () => {
        const noneEvent = new KeyboardEvent('keydown', { key: 'Alt' });
        service.onKeyDown(noneEvent);
        const removeSpy = spyOn(service, 'removeLetter');
        const confirmSpy = spyOn(service, 'confirmWord');
        const blurSpy = spyOn(service, 'onBlur');
        const findPlaceSpy = spyOn(service, 'findPlaceForLetter');
        expect(removeSpy).not.toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
        expect(blurSpy).not.toHaveBeenCalled();
        expect(findPlaceSpy).not.toHaveBeenCalled();
    });
    it('onKeyDown should not do anything if player is not active', () => {
        const keyEvent = new KeyboardEvent('keydown', { key: 'a' });
        gameServiceSpy.game.getLocalPlayer().isActive = false;
        const removeSpy = spyOn(service, 'removeLetter');
        const confirmSpy = spyOn(service, 'confirmWord');
        const blurSpy = spyOn(service, 'onBlur');
        const findPlaceSpy = spyOn(service, 'findPlaceForLetter');
        service.onKeyDown(keyEvent);
        expect(removeSpy).not.toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
        expect(blurSpy).not.toHaveBeenCalled();
        expect(findPlaceSpy).not.toHaveBeenCalled();
    });
    it('onKeyDown should not do anything if no position was defined with the mouse', () => {
        const keyEvent = new KeyboardEvent('keydown', { key: 'a' });
        service.initialPosition = new Vec2(0, 0);
        const removeSpy = spyOn(service, 'removeLetter');
        const confirmSpy = spyOn(service, 'confirmWord');
        const blurSpy = spyOn(service, 'onBlur');
        const findPlaceSpy = spyOn(service, 'findPlaceForLetter');
        service.onKeyDown(keyEvent);
        expect(removeSpy).not.toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
        expect(blurSpy).not.toHaveBeenCalled();
        expect(findPlaceSpy).not.toHaveBeenCalled();
    });
    it('onBlur should clear the canvas and remove all letters', () => {
        const removeSpy = spyOn(service, 'removeAllLetters').and.callThrough();
        const clearSpy = spyOn(service, 'clearOverlay').and.callThrough();
        service.onBlur();
        expect(removeSpy).toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalled();
        expect(rackServiceSpy.addLetter).toHaveBeenCalled();
    });
    it('clearOverlay should clear the canvas', () => {
        const clearSpy = spyOn(ctxSpy, 'clearRect').and.callThrough();
        service.clearOverlay();
        expect(clearSpy).toHaveBeenCalled();
    });
    it('drawCurrentWord should call drawLetter for as many letters as there are in the word', () => {
        const drawLetterSpy = spyOn(service, 'drawLetter' as any).and.callThrough();
        const posStub = [SEVEN_INDEX, H_INDEX];
        const convertPosSpy = companionServiceSpy.convertPositionToGridIndex;
        convertPosSpy.and.returnValue(posStub);
        gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
        service.drawCurrentWord();
        expect(convertPosSpy).toHaveBeenCalled();
        expect(drawLetterSpy).toHaveBeenCalledTimes(service.currentWord.length);
    });
    it('drawCurrentWord should skip occupied spaces (horizontal)', () => {
        const drawLetterSpy = spyOn(service, 'drawLetter' as any).and.callThrough();
        gridServiceSpy.scrabbleBoard.squares[SEVEN_INDEX + 1][H_INDEX].occupied = true;
        const posStub: number[] = [SEVEN_INDEX, H_INDEX];
        const convertPosSpy = companionServiceSpy.convertPositionToGridIndex;
        convertPosSpy.and.returnValue(posStub);
        service.drawCurrentWord();
        expect(convertPosSpy).toHaveBeenCalled();
        expect(drawLetterSpy).toHaveBeenCalledTimes(service.currentWord.length);
    });
    it('drawCurrentWord should skip occupied spaces (vertical)', () => {
        const drawLetterSpy = spyOn(service, 'drawLetter' as any).and.callThrough();
        service.currentAxis = Axis.V;
        gridServiceSpy.scrabbleBoard.squares[SEVEN_INDEX][H_INDEX + 1].occupied = true;
        const posStub: number[] = [SEVEN_INDEX, H_INDEX];
        const convertPosSpy = companionServiceSpy.convertPositionToGridIndex;
        convertPosSpy.and.returnValue(posStub);
        service.drawCurrentWord();
        expect(convertPosSpy).toHaveBeenCalled();
        expect(drawLetterSpy).toHaveBeenCalledTimes(service.currentWord.length);
    });
    it('drawLetter should not execute if the given position is outside of the board', () => {
        const drawSquareSpy = spyOn(service, 'drawSquare').and.callThrough();
        const letter = new ScrabbleLetter('o', 1);
        service['drawLetter'](letter, new Vec2(BOARD_SIZE, BOARD_SIZE));
        expect(drawSquareSpy).not.toHaveBeenCalled();
    });
    it('drawLetter should not execute if the given position is inside the board', () => {
        const drawSquareSpy = spyOn(service, 'drawSquare').and.callThrough();
        const DOUBLE_DIGIT = 10;
        const letter = new ScrabbleLetter('y', DOUBLE_DIGIT);
        service['drawLetter'](letter, new Vec2(SEVEN_INDEX, H_INDEX));
        expect(drawSquareSpy).toHaveBeenCalled();
    });
    it('removeLetter should add a letter to the rack the rack and remove the last character from the wordString', () => {
        const drawCurrentWordSpy = spyOn(service, 'drawCurrentWord');
        const wordStringExpected = 'tes';
        service.removeLetter();
        expect(drawCurrentWordSpy).toHaveBeenCalled();
        expect(service.wordString).toBe(wordStringExpected);
    });
    it('removeLetter should call drawCurrentWord and drawArrow', () => {
        const drawCurrentWordSpy = spyOn(service, 'drawCurrentWord');
        const drawArrowSpy = spyOn(service, 'drawArrow');
        service.removeLetter();
        expect(drawCurrentWordSpy).toHaveBeenCalled();
        expect(drawArrowSpy).toHaveBeenCalled();
    });
    it('removeLetter should redraw the rack when it is called', () => {
        rackServiceSpy.rackLetters = [new ScrabbleLetter('t', 1), new ScrabbleLetter('e', 1), new ScrabbleLetter('s', 1), new ScrabbleLetter('t', 1)];
        service.removeLetter();
        expect(rackServiceSpy.drawExistingLetters).toHaveBeenCalled();
    });
    it('removeLetter should remove the letter on deletePosition when it is declared', () => {
        const drawCurrentWordSpy = spyOn(service, 'drawCurrentWord');
        const drawArrowSpy = spyOn(service, 'drawArrow');
        service.deletePosition = new Vec2(ABSOLUTE_BOARD_SIZE, ABSOLUTE_BOARD_SIZE);
        service.removeLetter();
        expect(drawCurrentWordSpy).toHaveBeenCalled();
        expect(drawArrowSpy).toHaveBeenCalled();
        expect(service.deletePosition).toEqual(new Vec2(0, 0));
    });
    it('removeAllLetters should remove all letters from the word, and add them all in the rack', () => {
        const rackAddStub = service.currentWord.length;
        const currentWordStub: ScrabbleLetter[] = [];
        const currentWordStringStub = '';
        service.removeAllLetters();
        expect(service.currentWord).toEqual(currentWordStub);
        expect(service.wordString).toEqual(currentWordStringStub);
        expect(rackServiceSpy.addLetter).toHaveBeenCalledTimes(rackAddStub);
    });
    it('removeArrow should call clearRect', () => {
        const clearRectSpy = spyOn(ctxSpy, 'clearRect');
        service.removeArrow();
        expect(clearRectSpy).toHaveBeenCalled();
    });
    it('confirmWord should remove all letters, execute a command and clear the overlay', () => {
        const removeAllLettersSpy = spyOn(service, 'removeAllLetters');
        const clearSpy = spyOn(service, 'clearOverlay');
        service.confirmWord();
        expect(removeAllLettersSpy).toHaveBeenCalled();
        expect(cmdServiceSpy.executeCommand).toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalled();
    });
    it('updateRack should redraw the rack', () => {
        service.updateRack();
        expect(rackServiceSpy.drawRack).toHaveBeenCalled();
        expect(rackServiceSpy.drawExistingLetters).toHaveBeenCalled();
    });
    it('placeLetter should set deletePosition as the last square on the board if we get there', () => {
        service.currentPosition = new Vec2(ABSOLUTE_BOARD_SIZE, ABSOLUTE_BOARD_SIZE);
        service.initialPosition = new Vec2(ABSOLUTE_BOARD_SIZE - ACTUAL_SQUARE_SIZE * service.currentWord.length, ABSOLUTE_BOARD_SIZE);
        companionServiceSpy.convertPositionToGridIndex.and.returnValue([BOARD_SIZE, BOARD_SIZE]);
        service['placeLetter']('t');
        expect(service.deletePosition).toEqual(new Vec2(ABSOLUTE_BOARD_SIZE, ABSOLUTE_BOARD_SIZE));
    });
    it('placeLetter should not do anything if the position is outside of the board', () => {
        service.initialPosition = new Vec2(ABSOLUTE_BOARD_SIZE + 1, ABSOLUTE_BOARD_SIZE + 1);
        service.currentPosition = new Vec2(ABSOLUTE_BOARD_SIZE + 1, ABSOLUTE_BOARD_SIZE + 1);
        const drawSpy = spyOn(service, 'drawCurrentWord');
        service['placeLetter']('t');
        expect(drawSpy).not.toHaveBeenCalled();
        expect(service.deletePosition).toEqual(new Vec2(0, 0)); // 0, 0 means it is not set to any value by the method
    });
    it('placeLetter should draw a letter on the overlay if it is inside the board (horizontal)', () => {
        rackServiceSpy.rackLetters.push(new ScrabbleLetter('s', 1));
        const drawLetterSpy = spyOn(service, 'drawLetter' as any);
        companionServiceSpy.convertPositionToGridIndex.and.returnValue([SEVEN_INDEX, H_INDEX]);
        companionServiceSpy.findNextSquare.and.returnValue(new Vec2(SEVEN_POS + ACTUAL_SQUARE_SIZE * service.currentWord.length, H_POS));
        service['placeLetter']('s');
        expect(drawLetterSpy).toHaveBeenCalled();
    });
    it('placeLetter should draw a letter on the overlay if it is inside the board (vertical)', () => {
        rackServiceSpy.rackLetters.push(new ScrabbleLetter('s', 1));
        const drawLetterSpy = spyOn(service, 'drawLetter' as any);
        service.currentAxis = Axis.V;
        service.currentPosition = new Vec2(SEVEN_POS, H_POS + service.currentWord.length * ACTUAL_SQUARE_SIZE);
        companionServiceSpy.convertPositionToGridIndex.and.returnValue([SEVEN_INDEX, H_INDEX]);
        companionServiceSpy.findNextSquare.and.returnValue(new Vec2(SEVEN_POS, H_POS + ACTUAL_SQUARE_SIZE * service.currentWord.length));
        service['placeLetter']('s');
        expect(drawLetterSpy).toHaveBeenCalled();
    });
    it('placeLetter should be able to place a blank letter', () => {
        rackServiceSpy.rackLetters.push(new ScrabbleLetter('*', 0));
        const drawLetterSpy = spyOn(service, 'drawLetter' as any);
        service.currentAxis = Axis.V;
        service.currentPosition = new Vec2(SEVEN_POS, H_POS + service.currentWord.length * ACTUAL_SQUARE_SIZE);
        companionServiceSpy.convertPositionToGridIndex.and.returnValue([SEVEN_INDEX, H_INDEX]);
        companionServiceSpy.findNextSquare.and.returnValue(new Vec2(SEVEN_POS, H_POS + ACTUAL_SQUARE_SIZE * service.currentWord.length));
        service['placeLetter']('S');
        expect(drawLetterSpy).toHaveBeenCalled();
    });
    it('placeLetter should not place letters when an unsupported key is pressed', () => {
        rackServiceSpy.rackLetters.push(new ScrabbleLetter('s', 1));
        const drawLetterSpy = spyOn(service, 'drawLetter' as any);
        service.currentAxis = Axis.V;
        service.currentPosition = new Vec2(SEVEN_POS, H_POS + service.currentWord.length * ACTUAL_SQUARE_SIZE);
        companionServiceSpy.convertPositionToGridIndex.and.returnValue([SEVEN_INDEX, H_INDEX]);
        companionServiceSpy.findNextSquare.and.returnValue(new Vec2(SEVEN_POS, H_POS + ACTUAL_SQUARE_SIZE * service.currentWord.length));
        service['placeLetter']('#');
        expect(drawLetterSpy).not.toHaveBeenCalled();
    });
    it('placeLetter should draw an arrow on the last position if there is an error in the next position', () => {
        rackServiceSpy.rackLetters.push(new ScrabbleLetter('s', 1));
        const drawArrowSpy = spyOn(service, 'drawArrow');
        const drawCurrentWordSpy = spyOn(service, 'drawCurrentWord');
        service.currentAxis = Axis.V;
        companionServiceSpy.findNextSquare.and.returnValue(new Vec2(SEVEN_POS, H_POS + ACTUAL_SQUARE_SIZE * service.currentWord.length));
        service['placeLetter']('s');
        expect(drawCurrentWordSpy).toHaveBeenCalled();
        expect(drawArrowSpy).toHaveBeenCalled();
    });
    it('placeLetter should skip the current square and search for the next one if it is occupied', () => {
        rackServiceSpy.rackLetters.push(new ScrabbleLetter('s', 1));
        const drawArrowSpy = spyOn(service, 'drawArrow');
        const drawCurrentWordSpy = spyOn(service, 'drawCurrentWord');
        companionServiceSpy.convertPositionToGridIndex.and.returnValue([SEVEN_INDEX + 1, H_INDEX]);
        companionServiceSpy.findNextSquare.and.returnValue(new Vec2(service.currentPosition.x + ACTUAL_SQUARE_SIZE, service.currentPosition.y));
        gridServiceSpy.scrabbleBoard.squares[SEVEN_INDEX + 1][H_INDEX].letter = new ScrabbleLetter('s', 1);
        gridServiceSpy.scrabbleBoard.squares[SEVEN_INDEX + 1][H_INDEX].occupied = true;
        service['placeLetter']('s');
        expect(drawCurrentWordSpy).toHaveBeenCalled();
        expect(drawArrowSpy).toHaveBeenCalled();
    });
    it('placeLetter should not draw an arrow if the position is out of bounds', () => {
        rackServiceSpy.rackLetters.push(new ScrabbleLetter('s', 1));
        const drawArrowSpy = spyOn(service, 'drawArrow');
        const drawCurrentWordSpy = spyOn(service, 'drawCurrentWord');
        // findNextSquare returns something outside of the board
        companionServiceSpy.findNextSquare.and.returnValue(
            new Vec2(ABSOLUTE_BOARD_SIZE + ACTUAL_SQUARE_SIZE, ABSOLUTE_BOARD_SIZE + ACTUAL_SQUARE_SIZE),
        );
        service['placeLetter']('s');
        expect(drawCurrentWordSpy).toHaveBeenCalled();
        expect(drawArrowSpy).not.toHaveBeenCalled();
    });
    it('findPlaceForLetter should call placeLetter if there is space for the letter on the board', () => {
        const placeLetterSpy = spyOn(service, 'placeLetter' as any);
        service.currentPosition = new Vec2(SEVEN_POS + service.currentWord.length * ACTUAL_SQUARE_SIZE, H_POS);
        service.findPlaceForLetter('s');
        expect(placeLetterSpy).toHaveBeenCalled();
    });
    it('findPlaceForLetter should not call placeLetter if the position is outside of the board', () => {
        const placeLetterSpy = spyOn(service, 'placeLetter' as any);
        // Set current position to be outside of the board (too far right and too far up)
        service.currentPosition = new Vec2(ABSOLUTE_BOARD_SIZE + ACTUAL_SQUARE_SIZE, 0 - ACTUAL_SQUARE_SIZE);
        service.findPlaceForLetter('s');
        expect(placeLetterSpy).not.toHaveBeenCalled();
    });
    it('findPlaceForLetter should not call placeLetter on the edge of the board', () => {
        const placeLetterSpy = spyOn(service, 'placeLetter' as any);
        const MAX_POS_X_Y = ABSOLUTE_BOARD_SIZE + BOARD_OFFSET;
        service.currentPosition = new Vec2(MAX_POS_X_Y, MAX_POS_X_Y); // Square bottom right
        service.findPlaceForLetter('s');
        expect(placeLetterSpy).not.toHaveBeenCalled();
    });
    it('findPlaceForLetter should be able to skip ahead of the letters occupying the board (horizontal)', () => {
        const placeLetterSpy = spyOn(service, 'placeLetter' as any);
        service.currentPosition = new Vec2(SEVEN_POS + service.currentWord.length * ACTUAL_SQUARE_SIZE, H_POS);
        const pos = [SEVEN_INDEX + service.currentWord.length, H_INDEX];
        gridServiceSpy.scrabbleBoard.squares[pos[0]][pos[1]].letter = new ScrabbleLetter('s', 1); // T E S T ^S => T E S T S S^
        gridServiceSpy.scrabbleBoard.squares[pos[0]][pos[1]].occupied = true;
        service.findPlaceForLetter('s');
        expect(placeLetterSpy).toHaveBeenCalled();
    });
    it('findPlaceForLetter should be able to skip ahead of the letters occupying the board (vertical)', () => {
        const placeLetterSpy = spyOn(service, 'placeLetter' as any);
        service.currentAxis = Axis.V;
        service.currentPosition = new Vec2(SEVEN_POS, H_POS + service.currentWord.length * ACTUAL_SQUARE_SIZE);
        const pos = [SEVEN_INDEX, H_INDEX + service.currentWord.length];
        gridServiceSpy.scrabbleBoard.squares[pos[0]][pos[1]].letter = new ScrabbleLetter('s', 1); // T E S T ^S => T E S T S S^
        gridServiceSpy.scrabbleBoard.squares[pos[0]][pos[1]].occupied = true;
        service.findPlaceForLetter('s');
        expect(placeLetterSpy).toHaveBeenCalled();
    });
    it('findPlaceForLetter should not place a letter if after skipping the occupied spaces, the position is out of bounds', () => {
        const placeLetterSpy = spyOn(service, 'placeLetter' as any);
        service.currentAxis = Axis.V;
        gridServiceSpy.scrabbleBoard.squares[BOARD_SIZE - 1][BOARD_SIZE - 1].letter = new ScrabbleLetter('s', 1); // T E S T ^S => T E S T S S^
        gridServiceSpy.scrabbleBoard.squares[BOARD_SIZE - 1][BOARD_SIZE - 1].occupied = true;
        companionServiceSpy.convertPositionToGridIndex.and.returnValue([BOARD_SIZE - 1, BOARD_SIZE - 1]);
        service.currentPosition = new Vec2(ABSOLUTE_BOARD_SIZE + BOARD_OFFSET, ABSOLUTE_BOARD_SIZE + BOARD_OFFSET); // Square bottom right
        service.findPlaceForLetter('s');
        expect(placeLetterSpy).not.toHaveBeenCalled();
    });
});
