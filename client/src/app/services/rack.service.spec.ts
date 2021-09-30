import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Square } from '@app/classes/square';
import { RackService } from './rack.service';

export const RACK_WIDTH = 500;
export const RACK_HEIGHT = 60;

describe('RackService', () => {
    let service: RackService;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RackService);
        ctxStub = CanvasTestHelper.createCanvas(RACK_WIDTH, RACK_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawLetter should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        let letter: ScrabbleLetter = new ScrabbleLetter('D', 1);
        service.drawLetter(letter);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('drawLetter should handle double digit values', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        let letter: ScrabbleLetter = new ScrabbleLetter('D', 12);
        service.drawLetter(letter);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('drawRack should call moveTo and lineTo 10 times', () => {
        const expectedCallTimes = 10;
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        service.drawRack();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('removeLetter should decrease rack length by 1', () => {
        const square1 = new Square(0, 0);
        square1.letter = new ScrabbleLetter('a', 1);
        square1.occupied = true;
        const square2 = new Square(1, 0);
        const letter = new ScrabbleLetter('o', 1);
        square2.letter = letter;
        square2.occupied = true;
        const square3 = new Square(2, 0);
        square3.letter = new ScrabbleLetter('w', 10);
        square3.occupied = true;
        const square4 = new Square(0, 0);
        square4.letter = new ScrabbleLetter('k', 2);
        square4.occupied = true;
        service.scrabbleRack.squares = [square1, square2, square3, square4];
        service.removeLetter(letter);
        expect(service.scrabbleRack.squares[3].occupied).toEqual(false);
    });
});
