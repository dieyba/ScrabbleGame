import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { RackService } from './rack.service';

export const RACK_WIDTH = 500;
export const RACK_HEIGHT = 60;

/* eslint-disable  @typescript-eslint/no-magic-numbers */
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
        const letter: ScrabbleLetter = new ScrabbleLetter('D', 1);
        service.addLetter(letter);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('drawLetter should handle double digit values', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const letter: ScrabbleLetter = new ScrabbleLetter('D', 12);
        service.addLetter(letter);
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
        const letter1 = new ScrabbleLetter('a', 1);
        const letter2 = new ScrabbleLetter('o', 1);
        const letter3 = new ScrabbleLetter('w', 10);
        const letter4 = new ScrabbleLetter('k', 2);
        service.rackLetters = [letter1, letter2, letter3, letter4];
        service.removeLetter(letter1);
        expect(service.rackLetters.length).toEqual(3);
    });
});
