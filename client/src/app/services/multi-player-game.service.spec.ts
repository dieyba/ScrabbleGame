import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
// import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { Dictionary } from '@app/classes/dictionary';
// import { GameParameters } from '@app/classes/game-parameters';
// import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { ChatDisplayService } from './chat-display.service';
import { /* DEFAULT_HEIGHT, DEFAULT_WIDTH,*/ GridService } from './grid.service';
// import { LetterStock } from './letter-stock.service';
import { MultiPlayerGameService } from './multi-player-game.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';
// import { DEFAULT_LETTER_COUNT } from './solo-game.service';
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

    // let changeActivePlayerSpy: jasmine.Spy<any>;
    // let secondsToMinutesSpy: jasmine.Spy<any>;
    // let startCountdownSpy: jasmine.Spy<any>;
    // let addRackLettersSpy: jasmine.Spy<any>;
    // let ctxStub: CanvasRenderingContext2D;

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
        // ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
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

        // changeActivePlayerSpy = spyOn<any>(service, 'changeActivePlayer').and.callThrough();
        // secondsToMinutesSpy = spyOn<any>(service, 'secondsToMinutes').and.callThrough();
        // startCountdownSpy = spyOn<any>(service, 'startCountdown').and.callThrough();
        // addRackLettersSpy = spyOn<any>(service, 'addRackLetters').and.callThrough();
        // service.game = new GameParameters('Bob', 60, false);
        // const letter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        // service.game.creatorPlayer = new LocalPlayer('Bob');
        // service.game.creatorPlayer.score = 73;
        // service.game.creatorPlayer.letters = [letter];
        // addRackLetterSpy = spyOn<any>(service, 'addRackLetter').and.callThrough();
        // spyPlayer = new LocalPlayer('sara');

        // gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);

        // service.game = new GameParameters(form.controls.name.value, +form.controls.timer.value, form.controls.bonus.value);
        // service.stock = new LetterStock();
        // service.game.creatorPlayer = new LocalPlayer(form.controls.name.value);
        // service.game.creatorPlayer.isActive = true;
        // service.game.localPlayer = new LocalPlayer(form.controls.name.value);
        // const localLetters = service.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        // service.game.localPlayer.letters = localLetters;
        // const opponentLetters = service.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        // service.game.opponentPlayer.letters = opponentLetters;
        // service.game.dictionary = new Dictionary(+form.controls.dictionaryForm.value);
        // service.game.randomBonus = form.controls.bonus.value;
        // service.game.totalCountDown = form.controls.timer.value;
        // service.game.timerMs = form.controls.timer.value;
        // service.game.localPlayer = service.game.creatorPlayer;
        // // service = new BehaviorSubject<boolean>(gameServiceSpy.currentGameService.game.localPlayer.isActive);
        // // service.isVirtualPlayerObservable = soloGameServiceSpy.virtualPlayerSubject.asObservable();
        // // service.game.creatorPlayer = service.game.localPlayer;
        // // service.game.opponentPlayer = new VirtualPlayer(form.controls.opponent.value, form.controls.level.value);
        // service.virtualPlayerSubject.next(true);

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
