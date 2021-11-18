import { TestBed } from '@angular/core/testing';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { ManipulationRackService } from './manipulation-rack.service';
import { RackService } from './rack.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-explicit-any */
describe('ManipulationRackService', () => {
    let service: ManipulationRackService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let findFisrtOccurenceSpy: jasmine.Spy<any>;

    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj(
            'RackService',
            ['drawRack', 'select', 'deselect', 'deselectAll', 'handleExchangeSelection', 'clearRack'],
            {
                ['exchangeSelected']: [false, false, false, false, false, false, false],
                ['handlingSelected']: [false, false, false, false, false, false, false],
            },
        );
        TestBed.configureTestingModule({
            providers: [{ provide: RackService, useValue: rackServiceSpy }],
        });
        service = TestBed.inject(ManipulationRackService);
        findFisrtOccurenceSpy = spyOn<any>(service, 'findFisrtOccurence').and.callThrough();

        rackServiceSpy.rackLetters = [
            new ScrabbleLetter('p'),
            new ScrabbleLetter('j'),
            new ScrabbleLetter('l'),
            new ScrabbleLetter('d'),
            new ScrabbleLetter('j'),
            new ScrabbleLetter('w'),
            new ScrabbleLetter('z'),
        ];

        // service.firstOccurence = ERROR_NUMBER;
        // service.selectedPosition = ERROR_NUMBER;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('handleSelection should call rackService select if the letter at the specifeid posotion is not selected for handling', () => {
        const position = 3;
        rackServiceSpy.handlingSelected[position - 1] = true;
        service.handleSelection(position);
        expect(rackServiceSpy.select).not.toHaveBeenCalled();

        rackServiceSpy.handlingSelected[position - 1] = false;
        service.handleSelection(position);
        expect(rackServiceSpy.select).toHaveBeenCalled();
    });

    it('handleSelection should deselect for exchange the letter at the specified position if it was already selected for exchange', () => {
        const position = 3;
        rackServiceSpy.exchangeSelected[position - 1] = true;
        service.handleSelection(position);
        expect(rackServiceSpy.exchangeSelected[position - 1]).toBeFalse();
    });

    it('clearManipValues should set the two properties at -1', () => {
        const position = 3;
        service.setLetterSelectedPosition = position;
        service.setFirstOccurencePosition = position;
        service.clearManipValues();

        expect(service.getLetterSelectedPosition).toEqual(ERROR_NUMBER);
        expect(service.getFirstOccurencePosition).toEqual(ERROR_NUMBER);
    });

    it('findFisrtOccurence should set firstOccurencePosition with the position of the fisrt occurence of the letter specified', () => {
        service.findFisrtOccurence('j');
        expect(service.getFirstOccurencePosition).toEqual(1);
    });

    it('selectByLetter should call findFisrtOccurence if no letter is selected for handling', () => {
        service.setFirstOccurencePosition = ERROR_NUMBER;
        service.selectByLetter('j');
        expect(findFisrtOccurenceSpy).toHaveBeenCalled();
    });

    it('selectByLetter should call findFisrtOccurence if the letter selected is different from the new letter we want to select', () => {
        service.setFirstOccurencePosition = 3;
        service.selectByLetter('w');
        expect(findFisrtOccurenceSpy).toHaveBeenCalled();
    });

    it('selectByLetter shouldn t call findFisrtOccurence if a letter is selected and if this one is the same as the letter we want to select', () => {
        service.setFirstOccurencePosition = 3;
        service.selectByLetter('d');
        expect(findFisrtOccurenceSpy).not.toHaveBeenCalled();
    });

    it('selectByLetter should call rackService deselectAll if the letter specified is not in the letters of the player', () => {
        service.selectByLetter('a');

        expect(rackServiceSpy.deselectAll).toHaveBeenCalled();
        expect(rackServiceSpy.select).not.toHaveBeenCalled();
    });

    it('selectByLetter should deselect the letter selected for exchange if the specified letter is not already', () => {
        service.setLetterSelectedPosition = 1;
        rackServiceSpy.exchangeSelected[1] = true;
        service.selectByLetter('j');

        expect(rackServiceSpy.exchangeSelected[1]).toBeFalse();
    });

    it('selectByLetter should select the first occuerence of a letter if the last occurence of this letter is already selected', () => {
        service.setLetterSelectedPosition = 4;
        service.setFirstOccurencePosition = 1;
        rackServiceSpy.handlingSelected[4] = true;
        service.selectByLetter('j');

        expect(service.getLetterSelectedPosition).toEqual(1);
    });

    it('selectByLetter should select the next occurence of a letter if the letter is already selected', () => {
        rackServiceSpy.rackLetters[6] = new ScrabbleLetter('j');
        service.setLetterSelectedPosition = 4;
        service.setFirstOccurencePosition = 1;
        rackServiceSpy.handlingSelected[4] = true;
        service.selectByLetter('j');

        expect(service.getLetterSelectedPosition).toEqual(6);
    });

    it('switchLeft should call rackService clearRack and select if a letter is selected', () => {
        service.switchLeft();
        expect(rackServiceSpy.clearRack).not.toHaveBeenCalled();
        expect(rackServiceSpy.select).not.toHaveBeenCalled();

        rackServiceSpy.handlingSelected[2] = true;
        service.setLetterSelectedPosition = 2;
        service.switchLeft();

        expect(rackServiceSpy.clearRack).toHaveBeenCalled();
        expect(rackServiceSpy.select).toHaveBeenCalled();
    });

    it('if the fisrt letter is selected, switchLeft should deselect it and select the last one of the rack', () => {
        rackServiceSpy.handlingSelected[0] = true;
        service.setLetterSelectedPosition = 0;
        service.switchLeft();

        expect(service.getLetterSelectedPosition).toEqual(6);
    });

    it('if a letter, except the first one, is selected, switchLeft should deselect it and select the one on the left', () => {
        rackServiceSpy.handlingSelected[3] = true;
        service.setLetterSelectedPosition = 3;
        service.switchLeft();

        expect(service.getLetterSelectedPosition).toEqual(2);
    });

    it('switchRight should call rackService clearRack and select if a letter is selected', () => {
        service.switchRight();
        expect(rackServiceSpy.clearRack).not.toHaveBeenCalled();
        expect(rackServiceSpy.select).not.toHaveBeenCalled();

        rackServiceSpy.handlingSelected[2] = true;
        service.setLetterSelectedPosition = 2;
        service.switchRight();

        expect(rackServiceSpy.clearRack).toHaveBeenCalled();
        expect(rackServiceSpy.select).toHaveBeenCalled();
    });

    it('if the last letter is selected, switchRight should deselect it and select the fisrt one of the rack', () => {
        rackServiceSpy.handlingSelected[6] = true;
        service.setLetterSelectedPosition = 6;
        service.switchRight();

        expect(service.getLetterSelectedPosition).toEqual(0);
    });

    it('if a letter, except the last one, is selected, switchRight should deselect it and select the one on the right', () => {
        rackServiceSpy.handlingSelected[3] = true;
        service.setLetterSelectedPosition = 3;
        service.switchRight();

        expect(service.getLetterSelectedPosition).toEqual(4);
    });
});
