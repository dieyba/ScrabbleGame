import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { GameParameters, GameType } from '@app/classes/game-parameters';
// import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ExchangeService } from './exchange.service';
import { GameService } from './game.service';
import { LetterStock } from './letter-stock.service';
import { RackService } from './rack.service';
import { DEFAULT_LETTER_COUNT, SoloGameService } from './solo-game.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('ExchangeService', () => {
    let service: ExchangeService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;

    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'select', 'deselect', 'deselectAll', 'handleExchangeSelection'], {
            ['exchangeSelected']: [false, false, false, false, false, false, false],
            ['handlingSelected']: [false, false, false, false, false, false, false],
        });
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', [
            'game',
            'createNewGame',
            'passTurn',
            'changeActivePlayer',
            'removeRackLetter',
            'stock',
            'getLettersSelected',
            'exchangeLetters ',
        ]);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['currentGameService', 'initializeGameType']);
        TestBed.configureTestingModule({
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: SoloGameService, useValue: soloGameServiceSpy },
            ],
        });

        // gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
        gameServiceSpy.initializeGameType(GameType.Solo);
        gameServiceSpy.currentGameService = soloGameServiceSpy;
        const form = new FormGroup({
            name: new FormControl('dieyna'),
            timer: new FormControl('1:00'),
            bonus: new FormControl(true),
            level: new FormControl('easy'),
            dictionaryForm: new FormControl('Francais'),
            opponent: new FormControl('Sara'),
        });
        gameServiceSpy.currentGameService.game = new GameParameters(form.controls.name.value, +form.controls.timer.value, form.controls.bonus.value);
        gameServiceSpy.currentGameService.stock = new LetterStock();
        const localLetters = gameServiceSpy.currentGameService.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        gameServiceSpy.currentGameService.game.localPlayer.letters = localLetters;

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

        expect(soloGameServiceSpy.getLettersSelected).toHaveBeenCalled();
    });

    it('cancelExchange should call rackService deselect seven times', () => {
        gameServiceSpy.currentGameService.game.localPlayer.letters = [
            new ScrabbleLetter('j'),
            new ScrabbleLetter('p'),
            new ScrabbleLetter('b'),
            new ScrabbleLetter('l'),
            new ScrabbleLetter('d'),
            new ScrabbleLetter('w'),
            new ScrabbleLetter('z'),
        ];
        service.cancelExchange();

        expect(rackServiceSpy.deselect).toHaveBeenCalledTimes(7);
    });

    it('atLeastOneLetterSelected should return true if there is at least one letter selected for exchange', () => {
        expect(service.atLeastOneLetterSelected()).toBeFalse();

        rackServiceSpy.exchangeSelected[3] = true;
        expect(service.atLeastOneLetterSelected()).toBeTrue();
    });
});
