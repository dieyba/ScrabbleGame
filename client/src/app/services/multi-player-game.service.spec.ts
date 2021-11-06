import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { MultiPlayerGameService } from './multi-player-game.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

describe('MultiPlayerGameService', () => {
    let service: MultiPlayerGameService;
    let chatDisplayServiceSpy: jasmine.SpyObj<ChatDisplayService>;
    let validationServiceSpy: jasmine.SpyObj<ValidationService>;
    let wordBuilderServiceSpy: jasmine.SpyObj<WordBuilderService>;
    let placeServiceSpy: jasmine.SpyObj<PlaceService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;

    const form = new FormGroup({
        name: new FormControl('Erika'),
        timer: new FormControl(60),
        bonus: new FormControl(true),
        level: new FormControl('easy'),
        dictionaryForm: new FormControl('Francais'),
        opponent: new FormControl('Sara'),
    });

    let gameParameters = new GameParameters('Erika', 60, true);

    const creatorLetters = [
        new ScrabbleLetter('d'),
        new ScrabbleLetter('c'),
        new ScrabbleLetter('j'),
        new ScrabbleLetter('a'),
        new ScrabbleLetter('t'),
        new ScrabbleLetter('l'),
        new ScrabbleLetter('i')
    ];
    const opponentLetters = [
        new ScrabbleLetter('p'),
        new ScrabbleLetter('f'),
        new ScrabbleLetter('s'),
        new ScrabbleLetter('b'),
        new ScrabbleLetter('r'),
        new ScrabbleLetter('o'),
        new ScrabbleLetter('l')
    ];

    beforeEach(() => {
        chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', ['sendMessageToServer']);
        validationServiceSpy = jasmine.createSpyObj('ValidationService', ['updatePlayerScore']);
        wordBuilderServiceSpy = jasmine.createSpyObj('WordBuilderService', ['buildWordsOnBoard']);
        placeServiceSpy = jasmine.createSpyObj('PlaceService', ['place']);
        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawLetter', 'drawLetters'], { scrabbleBoard: new ScrabbleBoard(false) });
        rackServiceSpy = jasmine.createSpyObj('RackService', ['gridContext', 'drawLetter', 'removeLetter', 'addLetter', 'rackLetters'], {
            rackLetters: [] as ScrabbleLetter[],
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
                { provide: ChatDisplayService, useValue: chatDisplayServiceSpy },
                { provide: ValidationService, useValue: validationServiceSpy },
                { provide: WordBuilderService, useValue: wordBuilderServiceSpy },
                { provide: PlaceService, useValue: placeServiceSpy },
            ],
        });
        service = TestBed.inject(MultiPlayerGameService);

        spyOn(SoloGameService.prototype, 'place');
        spyOn(SoloGameService.prototype, 'exchangeLetters');

        gameParameters.opponentPlayer = new LocalPlayer('Bob');
        gameParameters.stock = [
            new ScrabbleLetter('l'),
            new ScrabbleLetter('a'),
            new ScrabbleLetter('s'),
            new ScrabbleLetter('x'),
            new ScrabbleLetter('v'),
            new ScrabbleLetter('u'),
            new ScrabbleLetter('p'),
            new ScrabbleLetter('r'),
        ];
        gameParameters.creatorPlayer.letters = creatorLetters;
        gameParameters.opponentPlayer.letters = opponentLetters;
        gameParameters.players.push(gameParameters.creatorPlayer);
        gameParameters.players.push(gameParameters.opponentPlayer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeGame should set the game attribute with the parameter', () => {
        service.initializeGame(form);
        expect(service.game.localPlayer.name).toEqual('Erika');
        expect(service.game.totalCountDown).toEqual(60);
        expect(service.game.timerMs).toEqual(60);
        expect(service.game.randomBonus).toBeTrue();
    });

    it('initializeGame should call takeLettersFromStock letterStockService', () => {
        const spy = spyOn(service.stock, 'takeLettersFromStock');
        service.initializeGame(form);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('initializeGame2 should set the game attribute with the parameter', () => {
        service.initializeGame2(gameParameters);

        expect(service.stock.letterStock).toEqual(gameParameters.stock);
        expect(service.game.creatorPlayer).toEqual(gameParameters.creatorPlayer);
        expect(service.game.localPlayer).toEqual(gameParameters.localPlayer);
        expect(service.game.opponentPlayer).toEqual(gameParameters.opponentPlayer);
    });

    it('place should call place SoloGameService', () => {
        const placeParams = { position: new Vec2(), orientation: Axis.H, word: 'test' };
        service.game = gameParameters;
        service.place(service.game.localPlayer, placeParams);

        expect(SoloGameService.prototype.place).toHaveBeenCalled();
    });

    // it('place should return the same value as place SoloGameService', () => {
    //     const placeParams = { position: new Vec2(), orientation: Axis.H, word: 'test' };
    //     service.game = gameParameters;
    //     expect(service.place(service.game.localPlayer, placeParams)).toEqual(Promise.reject(ErrorType.NoError));
    // });

    it('exchangeLetters should call exchangeLetters SoloGameService', () => {
        service.game = gameParameters;
        service.exchangeLetters(service.game.localPlayer, 'ks');

        expect(SoloGameService.prototype.exchangeLetters).toHaveBeenCalled();
    });

    it('updateBoard should call drawLetter gridService', () => {
        service.game = gameParameters;
        service.updateBoard('test', 'h', new Vec2());

        expect(gridServiceSpy.drawLetter).toHaveBeenCalled();
    });

    it('updateBoard should set the attributes in the right direction (h or v)', () => {
        service.game = gameParameters;
        const word = 'test';
        const position = new Vec2();
        let startPosition = new Vec2();
        service.updateBoard(word, 'v', position);

        for (startPosition.y; startPosition.y < word.length; startPosition.y++) {
            console.log(gridServiceSpy.scrabbleBoard.squares[startPosition.x][startPosition.y]);
            expect(gridServiceSpy.scrabbleBoard.squares[startPosition.x][startPosition.y].isValidated).toBeTrue();
            expect(gridServiceSpy.scrabbleBoard.squares[startPosition.x][startPosition.y].isBonusUsed).toBeTrue();
        }
    });
});
