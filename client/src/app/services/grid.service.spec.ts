import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { SquareColor } from '@app/classes/square';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    const DEFAULT_WIDTH = 540;
    const DEFAULT_HEIGHT = 540;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;

        service.scrabbleBoard = new ScrabbleBoard(false);
        service.scrabbleBoard.generateBoard(false);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(DEFAULT_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.width).toEqual(DEFAULT_HEIGHT);
    });

    it(' drawGrid should call moveTo and lineTo 32 times', () => {
        const expectedCallTimes = 32;
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        service.drawGrid();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('drawColors should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawColors();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('drawLetter should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const letter: ScrabbleLetter = new ScrabbleLetter('D', 1);
        service.drawLetter(letter, 5, 6);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('drawLetter should handle double digits', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const letter: ScrabbleLetter = new ScrabbleLetter('D', 11);
        service.drawLetter(letter, 5, 6);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('drawLetters should handle double digits', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const letter: ScrabbleLetter = new ScrabbleLetter('D', 11);
        service.scrabbleBoard.squares[5][6].letter = letter;
        service.scrabbleBoard.squares[5][6].occupied = true;
        service.drawLetters();
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('drawLetters should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const letter: ScrabbleLetter = new ScrabbleLetter('D', 1);
        service.scrabbleBoard.squares[5][6].letter = letter;
        service.scrabbleBoard.squares[5][6].occupied = true;
        service.drawLetters();
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('sizeUpLetters should change font to a bigger font', () => {
        service.sizeUpLetters();
        expect(service.currentLetterFont).toEqual('35px system-ui');
        expect(service.currentValueFont).toEqual('15px system-ui');
    });

    it('sizeDownLetters should change font to a smaller font', () => {
        service.sizeDownLetters();
        expect(service.currentLetterFont).toEqual('30px system-ui');
        expect(service.currentValueFont).toEqual('11px system-ui');
    });

    it('drawSingleSquareColor should change fillStyle to white', () => {
        service.scrabbleBoard.squares[6][6].color = SquareColor.None;
        service.drawSingleSquareColor(6, 6);
        expect(service.gridContext.fillStyle).toEqual('#ffffff');
    });

    it('removeSquare should call drawSingleSquareColor', () => {
        const spy = spyOn(service, 'drawSingleSquareColor');
        service.scrabbleBoard.squares[5][7].letter = new ScrabbleLetter('', 0);
        service.removeSquare(5, 7);
        expect(spy).toHaveBeenCalled();
    });

    // it('removeSquare should not remove validated letters', () => {
    //     const spy = spyOn(service, 'drawSingleSquareColor');
    //     service.scrabbleBoard.squares[5][5].isValidated = true;
    //     service.removeSquare(5, 5);
    //     expect(spy).not.toHaveBeenCalled();
    // });

    it('drawSingleSquareColor should use fillRect and fillText if square is unoccupied (dark blue)', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.scrabbleBoard.squares[5][5].color = SquareColor.DarkBlue;
        service.scrabbleBoard.squares[5][5].occupied = false;
        service.drawSingleSquareColor(5, 5);
        expect(fillTextSpy).toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('drawSingleSquareColor should use fillRect and not fillText if square is occupied (dark blue)', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.scrabbleBoard.squares[5][5].color = SquareColor.DarkBlue;
        service.scrabbleBoard.squares[5][5].occupied = true;
        service.drawSingleSquareColor(5, 5);
        expect(fillTextSpy).not.toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('drawSingleSquareColor should use fillRect and fillText if square is unoccupied (red)', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.scrabbleBoard.squares[0][0].color = SquareColor.Red;
        service.scrabbleBoard.squares[0][0].occupied = false;
        service.drawSingleSquareColor(0, 0);
        expect(fillTextSpy).toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('drawSingleSquareColor should use fillRect and not fillText if square is occupied (red)', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.scrabbleBoard.squares[0][0].color = SquareColor.Red;
        service.scrabbleBoard.squares[0][0].occupied = true;
        service.drawSingleSquareColor(0, 0);
        expect(fillTextSpy).not.toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('drawSingleSquareColor should use fillRect and fillText if square is unoccupied (teal)', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.scrabbleBoard.squares[6][6].color = SquareColor.Teal;
        service.scrabbleBoard.squares[6][6].occupied = false;
        service.drawSingleSquareColor(6, 6);
        expect(fillTextSpy).toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('drawSingleSquareColor should use fillRect and not fillText if square is occupied (teal)', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.scrabbleBoard.squares[6][6].color = SquareColor.Teal;
        service.scrabbleBoard.squares[6][6].occupied = true;
        service.drawSingleSquareColor(6, 6);
        expect(fillTextSpy).not.toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('drawSingleSquareColor should use fillRect and not fillText if square is occupied (teal)', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.scrabbleBoard.squares[1][1].color = SquareColor.Pink;
        service.scrabbleBoard.squares[1][1].occupied = true;
        service.drawSingleSquareColor(1, 1);
        expect(fillTextSpy).not.toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('removeInvalidLetters should set the board square to unoccupied (h)', () => {
        const startCoord = new Vec2(0, 0);
        const letter1 = new ScrabbleLetter('l', 1);
        service.drawLetter(letter1, 0, 0);
        const letter2 = new ScrabbleLetter('e', 1);
        service.drawLetter(letter2, 1, 0);
        service.removeInvalidLetters(startCoord, 2, Axis.H);
        expect(service.scrabbleBoard.squares[0][0].occupied).toEqual(false);
        expect(service.scrabbleBoard.squares[1][0].occupied).toEqual(false);
    });

    it('removeInvalidLetters should set the board square to unoccupied (v)', () => {
        const startCoord = new Vec2(0, 0);
        const letter1 = new ScrabbleLetter('l', 1);
        service.drawLetter(letter1, 0, 0);
        const letter2 = new ScrabbleLetter('e', 1);
        service.drawLetter(letter2, 0, 1);
        service.removeInvalidLetters(startCoord, 2, Axis.V);
        expect(service.scrabbleBoard.squares[0][0].occupied).toEqual(false);
        expect(service.scrabbleBoard.squares[0][1].occupied).toEqual(false);
    });

    it('removeInvalidLetters should remove only invalid letters (v)', () => {
        const startCoord = new Vec2(0, 0);
        const letter1 = new ScrabbleLetter('l', 1);
        service.drawLetter(letter1, 0, 0);
        const letter2 = new ScrabbleLetter('e', 1);
        service.drawLetter(letter2, 0, 1);
        service.scrabbleBoard.squares[0][1].isValidated = true;
        service.removeInvalidLetters(startCoord, 2, Axis.V);
        expect(service.scrabbleBoard.squares[0][0].occupied).toEqual(false);
        expect(service.scrabbleBoard.squares[0][1].occupied).toEqual(true);
    });

    it('removeInvalidLetters should remove only invalid letters (h)', () => {
        const startCoord = new Vec2(0, 0);
        const letter1 = new ScrabbleLetter('l', 1);
        service.drawLetter(letter1, 0, 0);
        const letter2 = new ScrabbleLetter('e', 1);
        service.drawLetter(letter2, 1, 0);
        service.scrabbleBoard.squares[1][0].isValidated = true;
        service.removeInvalidLetters(startCoord, 2, Axis.H);
        expect(service.scrabbleBoard.squares[0][0].occupied).toEqual(false);
        expect(service.scrabbleBoard.squares[1][0].occupied).toEqual(true);
    });
});
