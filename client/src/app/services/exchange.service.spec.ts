import { TestBed } from '@angular/core/testing';
import { ExchangeService } from './exchange.service';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';

describe('ExchangeService', () => {
    let service: ExchangeService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;

    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'select', 'deselect', 'deselectAll', 'handleExchangeSelection'], {
            ['exchangeSelected']: [false, false, false, false, false, false, false],
            ['handlingSelected']: [false, false, false, false, false, false, false],
        });
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', [
            'localPlayer',
            'virtualPlayer',
            'createNewGame',
            'passTurn',
            'changeActivePlayer',
            'removeRackLetter',
            'stock',
            'exchangeLettersSelected',
        ]);
        TestBed.configureTestingModule({
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: SoloGameService, useValue: soloGameServiceSpy },
            ],
        });
        service = TestBed.inject(ExchangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('handleSelection should deselect the letter for handling at the specified position if it is already selected', () => {
        const position = 2;
        rackServiceSpy.handlingSelected[position - 1] = true;
        service.handleSelection(position);

        expect(rackServiceSpy.handlingSelected[position - 1]).toBeFalse();
    });

    it('handleSelection should call rackService select if the letter at the specified position is not already selected', () => {
        const position = 2;
        service.handleSelection(position);

        expect(rackServiceSpy.select).toHaveBeenCalled();
    });

    it('handleSelection should call rackService deselect if the letter at the specified position is already selected', () => {
        const position = 2;
        rackServiceSpy.exchangeSelected[position - 1] = true;
        service.handleSelection(position);

        expect(rackServiceSpy.deselect).toHaveBeenCalled();
        expect(rackServiceSpy.select).not.toHaveBeenCalled();
    });

    it('exchange should call soloGameService exchangeLettersSelected', () => {
        service.exchange();

        expect(soloGameServiceSpy.exchangeLettersSelected).toHaveBeenCalled();
    });

    // it('cancelExchange should call rackService deselect seven times', () => {
    //     service.cancelExchange();

    //     expect(rackServiceSpy.deselect).toHaveBeenCalledTimes(7);
    // });
});
