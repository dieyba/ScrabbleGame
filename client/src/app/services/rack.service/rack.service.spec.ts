import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper/canvas-test-helper';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { MAX_LETTER_COUNT, RackService } from './rack.service';

export const RACK_WIDTH = 440;
export const RACK_HEIGHT = 50;

/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-explicit-any */
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

    it('removeLetter should decrease rack length by 1 and return position', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        const letter2 = new ScrabbleLetter('o', 1);
        const letter3 = new ScrabbleLetter('w', 10);
        const letter4 = new ScrabbleLetter('k', 2);
        service.rackLetters = [letter1, letter2, letter3, letter4];
        expect(service.removeLetter(letter1)).toEqual(0);
    });

    it('removeLetter should not remove letter not in the rack', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        const letter2 = new ScrabbleLetter('o', 1);
        const letter3 = new ScrabbleLetter('w', 10);
        const letter4 = new ScrabbleLetter('k', 2);
        service.rackLetters = [letter1, letter2, letter4];
        service.removeLetter(letter3);
        expect(service.rackLetters.length).toEqual(3);
    });

    it('addLetter should not call drawLetter when rack length is 7', () => {
        const drawLetterSpy = spyOn<any>(service, 'drawLetter').and.callThrough();
        const letter1 = new ScrabbleLetter('a', 1);
        const letter2 = new ScrabbleLetter('o', 1);
        const letter3 = new ScrabbleLetter('w', 10);
        const letter4 = new ScrabbleLetter('k', 2);
        const letter5 = new ScrabbleLetter('k', 2);
        const letter6 = new ScrabbleLetter('k', 2);
        const letter7 = new ScrabbleLetter('k', 2);
        service.rackLetters = [letter1, letter2, letter3, letter4, letter5, letter6, letter7];
        service.addLetter(letter7);
        expect(service.rackLetters.length).toEqual(7);
        expect(drawLetterSpy).not.toHaveBeenCalled();
    });

    it('redrawRack should call "gridContext.redrawRack()", "drawRack" and "drawExistingLetters"', () => {
        const clearRectSpy = spyOn<any>(ctxStub, 'clearRect').and.stub();
        const drawRackSpy = spyOn<any>(service, 'drawRack').and.stub();
        const drawExistingLettersSpy = spyOn<any>(service, 'drawExistingLetters').and.stub();

        service.redrawRack();

        expect(clearRectSpy).toHaveBeenCalled();
        expect(drawRackSpy).toHaveBeenCalled();
        expect(drawExistingLettersSpy).toHaveBeenCalled();
    });

    it('findSquareOrigin should return the right coordinates of the upper left corner of a letter position', () => {
        for (let i = 1; i <= MAX_LETTER_COUNT; i++) {
            const coordX = service.findSquareOrigin(i);
            expect(coordX).toEqual((RACK_WIDTH * (i - 1)) / MAX_LETTER_COUNT);
        }
    });

    it('select should accumulate "selection" on multiple call for "exchange selection"', () => {
        const drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.stub();
        const drawRackSpy = spyOn<any>(service, 'drawRack').and.stub();

        service.select(1, ctxStub, true);

        expect(ctxStub.fillStyle).toEqual('#ffa07a'); // lightsalmon
        expect(service.exchangeSelected[0]).toEqual(true);
        expect(service.exchangeSelected[MAX_LETTER_COUNT - 1]).toEqual(false);
        expect(drawSelectionSpy).toHaveBeenCalled();
        expect(drawRackSpy).toHaveBeenCalled();

        service.select(MAX_LETTER_COUNT, ctxStub, true);

        expect(service.exchangeSelected[0]).toEqual(true);
        expect(service.exchangeSelected[MAX_LETTER_COUNT - 1]).toEqual(true);
    });

    it('select should color letters for handling one at a time', () => {
        const drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.stub();
        const drawRackSpy = spyOn<any>(service, 'drawRack').and.stub();

        service.select(1, ctxStub, false);

        expect(ctxStub.fillStyle).toEqual('#add8e6'); // lightblue
        expect(service.handlingSelected[0]).toEqual(true);
        expect(service.handlingSelected[MAX_LETTER_COUNT - 1]).toEqual(false);
        expect(drawSelectionSpy).toHaveBeenCalled();
        expect(drawRackSpy).toHaveBeenCalled();

        service.select(MAX_LETTER_COUNT, ctxStub, false);

        expect(service.handlingSelected[0]).toEqual(false);
        expect(service.handlingSelected[MAX_LETTER_COUNT - 1]).toEqual(true);
    });

    it('deselect should recolor the letter as normal', () => {
        const drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.stub();
        const drawRackSpy = spyOn<any>(service, 'drawRack').and.stub();

        // initial conditions
        ctxStub.fillStyle = 'notWhite';
        service.exchangeSelected[0] = true;

        service.deselect(1, ctxStub, true);

        expect(service.exchangeSelected[0]).toEqual(false);
        expect(drawSelectionSpy).toHaveBeenCalled();
        expect(drawRackSpy).toHaveBeenCalled();
        expect(ctxStub.fillStyle).toEqual('#ffffff'); // White

        // initial conditions
        ctxStub.fillStyle = 'notWhite';
        service.handlingSelected[0] = true;

        service.deselect(1, ctxStub, false);

        expect(service.handlingSelected[0]).toEqual(false);
        expect(drawSelectionSpy).toHaveBeenCalled();
        expect(drawRackSpy).toHaveBeenCalled();
        expect(ctxStub.fillStyle).toEqual('#ffffff'); // White
    });

    it('deselectAll should call "deselect" 7×2 times (for 7 handling selections and 7 exchange selections', () => {
        const deselectSpy = spyOn(service, 'deselect');

        service.deselectAll(ctxStub);

        expect(deselectSpy).toHaveBeenCalledTimes(MAX_LETTER_COUNT * 2);
    });

    it('drawSelection should draw the "selection" square and rewrite the letters', () => {
        const findSquareOriginSpy = spyOn(service, 'findSquareOrigin');
        const drawExistingLetters = spyOn(service, 'drawExistingLetters');
        const ctxStubSpy = spyOn(ctxStub, 'fillRect');

        service.drawSelection(1, ctxStub);

        expect(findSquareOriginSpy).toHaveBeenCalled();
        expect(drawExistingLetters).toHaveBeenCalled();
        expect(ctxStubSpy).toHaveBeenCalled();
    });

    it('clear rack should remove all rack letters and clear the ui', () => {
        const drawRackSpy = spyOn(service, 'drawRack');
        const ctxStubSpy = spyOn(ctxStub, 'clearRect');
        const letter1 = new ScrabbleLetter('a', 1);
        service.addLetter(letter1);

        service.clearRack();

        expect(ctxStubSpy).toHaveBeenCalled();
        expect(drawRackSpy).toHaveBeenCalled();
        expect(service.rackLetters).toEqual([]);
    });
});
