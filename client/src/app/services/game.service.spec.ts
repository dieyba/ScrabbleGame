/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { FormAnExistingWord } from '@app/classes/form-an-existing-word';
import { GameInitInfo, GameParameters, GameType } from '@app/classes/game-parameters';
import { GameTimer } from '@app/classes/game-timer';
import { GoalType } from '@app/classes/goal';
import { PlaceLetterWorthTenPts } from '@app/classes/place-letter-worth-ten-pts';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { SquareColor } from '@app/classes/square';
import { Difficulty } from '@app/classes/virtual-player';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters';
import { BehaviorSubject } from 'rxjs';
import { ChatDisplayService } from './chat-display.service';
import { GameService } from './game.service';
import { GoalsService } from './goals.service';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

describe('GameService', () => {
    let service: GameService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let placeServiceSpy: jasmine.SpyObj<PlaceService>;
    let validationServiceSpy: jasmine.SpyObj<ValidationService>;
    let wordBuilderServiceSpy: jasmine.SpyObj<WordBuilderService>;
    let chatDisplayServiceSpy: jasmine.SpyObj<ChatDisplayService>;
    let goalsServiceSpy: jasmine.SpyObj<GoalsService>;

    let initInfoSolo: WaitingAreaGameParameters;
    let initInfoMulti: GameInitInfo;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['sendMessageToServer', 'createEndGameMessages']);
        rackServiceSpy = jasmine.createSpyObj('RackService', ['gridContext', 'drawLetter', 'removeLetter', 'addLetter', 'rackLetters'], {
            rackLetters: [] as ScrabbleLetter[],
        });
        placeServiceSpy = jasmine.createSpyObj('PlaceService', ['place']);
        validationServiceSpy = jasmine.createSpyObj('ValidationService', ['updatePlayerScore']);
        wordBuilderServiceSpy = jasmine.createSpyObj('WordBuilderService', ['buildWordsOnBoard']);
        chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', ['sendMessageToServer', 'createEndGameMessages']);
        goalsServiceSpy = jasmine.createSpyObj('GoalsService', [
            'initialize',
            'pickSharedGoals',
            'pickPrivateGoals',
            'pickRandomLetterAndColor',
            'addSharedGoal',
            'addPrivateGoal',
            'achieveGoals',
            'getGoalOfAPlayer',
            'getGoalByType',
        ]);

        TestBed.configureTestingModule({
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
                { provide: PlaceService, useValue: placeServiceSpy },
                { provide: ValidationService, useValue: validationServiceSpy },
                { provide: WordBuilderService, useValue: wordBuilderServiceSpy },
                { provide: ChatDisplayService, useValue: chatDisplayServiceSpy },
                { provide: GoalsService, useValue: goalsServiceSpy },
            ],
        });
        service = TestBed.inject(GameService);
        initInfoSolo = new WaitingAreaGameParameters(GameType.Solo, 2, DictionaryType.Default, 60, false, false, 'Riri', 'Lulu');
        initInfoMulti = {
            players: [],
            totalCountDown: 60,
            scrabbleBoard: [],
            stockLetters: [],
            gameMode: GameType.MultiPlayer,
            isLog2990: false,
            isRandomBonus: false,
            sharedGoals: [],
            randomLetterAndColor: new ScrabbleLetter('a'),
        };
        service.game = new GameParameters();
        service.game.gameTimer = new GameTimer();
        validationServiceSpy.dictionary = new Dictionary(DictionaryType.Default);
        clearInterval(service.game.gameTimer.intervalValue);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // initializeSoloGame tests
    it('initializeSoloGame should call game setLocalPlayer, setOpponent, getLocalPlayer and getOpponent if it is solo mode', () => {
        const setLocalPlayerSpy: jasmine.Spy<jasmine.Func> = spyOn(service.game, 'setLocalPlayer').and.callThrough();
        const setOpponentSpy: jasmine.Spy<jasmine.Func> = spyOn(service.game, 'setOpponent').and.callThrough();
        const getLocalPlayerSpy: jasmine.Spy<jasmine.Func> = spyOn(service.game, 'getLocalPlayer').and.callThrough();
        const getOpponentSpy: jasmine.Spy<jasmine.Func> = spyOn(service.game, 'getOpponent').and.callThrough();

        initInfoSolo.gameMode = GameType.MultiPlayer;
        service.initializeSoloGame(initInfoSolo, Difficulty.Easy);
        expect(setLocalPlayerSpy).not.toHaveBeenCalled();
        expect(setOpponentSpy).not.toHaveBeenCalled();
        expect(getLocalPlayerSpy).not.toHaveBeenCalled();
        expect(getOpponentSpy).not.toHaveBeenCalled();

        initInfoSolo.gameMode = GameType.Solo;
        service.initializeSoloGame(initInfoSolo, Difficulty.Difficult);
        expect(setLocalPlayerSpy).toHaveBeenCalled();
        expect(setOpponentSpy).toHaveBeenCalled();
        expect(getLocalPlayerSpy).toHaveBeenCalled();
        expect(getOpponentSpy).toHaveBeenCalled();
    });

    // eslint-disable-next-line max-len
    it('initializeSoloGame should call createGoals goalsService pickSharedGoals, pickPrivateGoals, pickRandomLetterAndColor when it is log2990 mode', () => {
        const createGalsSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'createGoals');

        service.initializeSoloGame(initInfoSolo, Difficulty.Easy);
        expect(goalsServiceSpy.pickSharedGoals).not.toHaveBeenCalled();
        expect(goalsServiceSpy.pickPrivateGoals).not.toHaveBeenCalled();
        expect(goalsServiceSpy.pickRandomLetterAndColor).not.toHaveBeenCalled();
        expect(createGalsSpy).not.toHaveBeenCalled();

        initInfoSolo.isLog2990 = true;
        service.initializeSoloGame(initInfoSolo, Difficulty.Easy);
        expect(goalsServiceSpy.pickSharedGoals).toHaveBeenCalled();
        expect(goalsServiceSpy.pickPrivateGoals).toHaveBeenCalled();
        expect(goalsServiceSpy.pickRandomLetterAndColor).toHaveBeenCalled();
        expect(createGalsSpy).toHaveBeenCalled();
    });

    // initializeMultiplayerGame tests
    it('initializeMultiplayerGame should call game setLocalAndOpponentId, setLocalPlayer and setOpponent if it is multiplayer mode', () => {
        const creator: Player = new Player('Riri');
        creator.socketId = '0';
        const joiner: Player = new Player('Lulu');
        joiner.socketId = '1';
        initInfoMulti.players[0] = creator;
        initInfoMulti.players[1] = joiner;
        service['socket'].id = '1';
        const setLocalAndOpponentIdSpy: jasmine.Spy<jasmine.Func> = spyOn(service.game, 'setLocalAndOpponentId').and.callThrough();
        const setLocalPlayerSpy: jasmine.Spy<jasmine.Func> = spyOn(service.game, 'setLocalPlayer').and.callThrough();
        const setOpponentSpy: jasmine.Spy<jasmine.Func> = spyOn(service.game, 'setOpponent').and.callThrough();

        initInfoMulti.gameMode = GameType.Solo;
        service.initializeMultiplayerGame(initInfoMulti);
        expect(setLocalAndOpponentIdSpy).not.toHaveBeenCalled();
        expect(setLocalPlayerSpy).not.toHaveBeenCalled();
        expect(setOpponentSpy).not.toHaveBeenCalled();

        initInfoMulti.gameMode = GameType.MultiPlayer;
        service.initializeMultiplayerGame(initInfoMulti);
        expect(setLocalAndOpponentIdSpy).toHaveBeenCalled();
        expect(setLocalPlayerSpy).toHaveBeenCalled();
        expect(setOpponentSpy).toHaveBeenCalled();
    });

    it('initializeMultiplayerGame should call createGoals if it is log2990 mode', () => {
        const createGalsSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'createGoals');
        const creator: Player = new Player('Riri');
        creator.socketId = '0';
        const joiner: Player = new Player('Lulu');
        joiner.socketId = '1';
        initInfoMulti.players[0] = creator;
        initInfoMulti.players[1] = joiner;
        service['socket'].id = '1';

        service.initializeMultiplayerGame(initInfoMulti);
        expect(createGalsSpy).not.toHaveBeenCalled();

        initInfoMulti.players[0].socketId = '1';
        initInfoMulti.players[1].socketId = '0';
        initInfoMulti.isLog2990 = true;
        service.initializeMultiplayerGame(initInfoMulti);
        expect(createGalsSpy).toHaveBeenCalled();
    });

    // createGoals tests
    // TODO : coverage
    it('createGoals should call goalsService initialize', () => {
        const sharedGoalsType = [GoalType.PlaceLetterWorthTenPts, GoalType.FormAnExistingWord];
        const randomLetterAndColor = new ScrabbleLetter('a');
        randomLetterAndColor.color = SquareColor.Teal;
        const sharedGoals = [new PlaceLetterWorthTenPts(), new FormAnExistingWord()];
        service.game.players = [new Player('Riri'), new Player('Lulu')];

        goalsServiceSpy.sharedGoals = sharedGoals;
        // console.log('goals ', goalsServiceSpy.sharedGoals);

        service.createGoals(sharedGoalsType, randomLetterAndColor);
        // console.log(goalsServiceSpy.getGoalByType(GoalType.FormAnExistingWord));
        expect(goalsServiceSpy.initialize).toHaveBeenCalled();
    });

    // startNewGame tests
    it('startNewGame should call addRackLetters and startCountdown', () => {
        const addRackLettersSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'addRackLetters');
        const startCountDownSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'startCountdown');
        service.game.players[0] = new Player('Riri');

        service.startNewGame();
        expect(addRackLettersSpy).toHaveBeenCalled();
        expect(startCountDownSpy).toHaveBeenCalled();
    });

    // startCountdown tests
    it('startCountdown should call secondsToMinutes if it is not endGame', () => {
        jasmine.clock().install();
        const secondsToMinutesSpy: jasmine.Spy<jasmine.Func> = spyOn(service.game.gameTimer, 'secondsToMinutes');
        service.game.players[0] = new Player('Riri');
        service.game.gameTimer.timerMs = 10;

        service.game.isEndGame = true;
        service.startCountdown();
        jasmine.clock().tick(1001);
        expect(secondsToMinutesSpy).not.toHaveBeenCalled();

        service.game.isEndGame = false;
        // service.startCountdown();
        jasmine.clock().tick(1000);
        expect(secondsToMinutesSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    // TODO: isTurnPassedTurn ne st pas mis à jour alors que la ligne est couverte
    it('startCountdown should set isTurnPassed to true if the timer is over', () => {
        jasmine.clock().install();
        service.game.gameTimer.timerMs = 0;
        service.isTurnPassed = false;
        service.game.isEndGame = false;
        service.isTurnEndSubject = new BehaviorSubject<boolean>(true);
        service.startCountdown();
        jasmine.clock().tick(1000);
        // console.log(service.game.gameTimer.timerMs);

        expect(service.isTurnPassed).toBeTrue();
        jasmine.clock().uninstall();
    });

    it('resetTimer should call startCountdown', () => {
        const startCountDownSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'startCountdown');
        service.resetTimer();
        expect(startCountDownSpy).toHaveBeenCalled();
    });

    it('passTurn should call return NoError if the player is active', () => {
        const player: Player = new Player('Riri');
        service.isTurnEndSubject = new BehaviorSubject<boolean>(true);
        expect(service.passTurn(player)).toEqual(ErrorType.ImpossibleCommand);

        player.isActive = true;
        expect(service.passTurn(player)).toEqual(ErrorType.NoError);
    });
});
