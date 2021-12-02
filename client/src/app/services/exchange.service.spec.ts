import { TestBed } from '@angular/core/testing';
import { GameParameters } from '@app/classes/game-parameters';
import { LetterStock } from '@app/classes/letter-stock';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { CommandInvokerService } from './command-invoker.service';
import { ExchangeService } from './exchange.service';
import { DEFAULT_LETTER_COUNT, GameService } from './game.service';
import { RackService } from './rack.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('ExchangeService', () => {
    let service: ExchangeService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let commandInvokerService: jasmine.SpyObj<CommandInvokerService>;

    beforeEach(() => {
        commandInvokerService = jasmine.createSpyObj('CommandInvokerService', ['executeCommand']);
        rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'select', 'deselect', 'deselectAll', 'handleExchangeSelection'], {
            ['exchangeSelected']: [false, false, false, false, false, false, false],
            ['handlingSelected']: [false, false, false, false, false, false, false],
        });
        gameServiceSpy = jasmine.createSpyObj('GameService', ['game', 'removeRackLetter', 'getLettersSelected', 'exchangeLetters']);
        TestBed.configureTestingModule({
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: CommandInvokerService, useValue: commandInvokerService },
            ],
        });

        // gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
        gameServiceSpy.game = new GameParameters();
        gameServiceSpy.game.players = [new Player('local player name'), new Player('opponent name')];
        gameServiceSpy.game.setLocalAndOpponentId(0, 1);
        gameServiceSpy.game.stock = new LetterStock();
        const localLetters = gameServiceSpy.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        gameServiceSpy.game.getLocalPlayer().letters = localLetters;

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

    it('exchange should call gameService exchangeLettersSelected', () => {
        service.exchange();

        expect(gameServiceSpy.getLettersSelected).toHaveBeenCalled();
    });

    it('exchange should call command invoker execute command', () => {
        service.exchange();
        expect(commandInvokerService.executeCommand).toHaveBeenCalled();
    });

    it('cancelExchange should call rackService deselect seven times', () => {
        gameServiceSpy.game.getLocalPlayer().letters = [
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
