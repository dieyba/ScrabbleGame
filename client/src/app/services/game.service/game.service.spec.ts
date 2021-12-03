/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { PlaceParams } from '@app/classes/commands/commands';
import { Dictionary, DictionaryType } from '@app/classes/dictionary/dictionary';
import { ErrorType } from '@app/classes/errors';
import { FormAnExistingWord } from '@app/classes/form-an-existing-word/form-an-existing-word';
import { GameInitInfo, GameParameters, GameType } from '@app/classes/game-parameters/game-parameters';
import { GameTimer } from '@app/classes/game-timer/game-timer';
import { GoalType } from '@app/classes/goal/goal';
import { LetterStock } from '@app/classes/letter-stock/letter-stock';
import { PlaceLetterWorthTenPts } from '@app/classes/place-letter-worth-ten-pts/place-letter-worth-ten-pts';
import { Player } from '@app/classes/player/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { BoardUpdate, LettersUpdate } from '@app/classes/server-message';
import { Square, SquareColor } from '@app/classes/square/square';
import { Axis } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { Difficulty } from '@app/classes/virtual-player/virtual-player';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters/waiting-area-game-parameters';
import { ChatDisplayService } from '@app/services/chat-display.service/chat-display.service';
import { GameService } from '@app/services/game.service/game.service';
import { GoalsService } from '@app/services/goals.service/goals.service';
import { GridService } from '@app/services/grid.service/grid.service';
import { PlaceService } from '@app/services/place.service/place.service';
import { RackService } from '@app/services/rack.service/rack.service';
import { ValidationService } from '@app/services/validation.service/validation.service';
import { WordBuilderService } from '@app/services/word-builder.service/word-builder.service';
import { BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

class SocketMock {
    id: string = 'Socket mock';
    events: Map<string, CallableFunction> = new Map();
    on(eventName: string, cb: CallableFunction) {
        this.events.set(eventName, cb);
    }

    triggerEvent(eventName: string, ...args: any[]) {
        const arrowFunction = this.events.get(eventName) as CallableFunction;
        arrowFunction(...args);
    }

    join() {
        return;
    }
    emit() {
        return;
    }

    disconnect() {
        return;
    }
}

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
    let socketMock: SocketMock;
    let socketOnMockSpy: jasmine.SpyObj<any>;
    let socketEmitMockSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['sendMessageToServer', 'createEndGameMessages', 'updateBoard']);
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
        service.game.stock = new LetterStock();
        service.game.scrabbleBoard = new ScrabbleBoard(false);
        validationServiceSpy.dictionary = new Dictionary(DictionaryType.Default);
        socketMock = new SocketMock();
        service['socket'] = socketMock as unknown as io.Socket;
        socketOnMockSpy = spyOn(socketMock, 'on').and.callThrough();
        socketEmitMockSpy = spyOn(socketMock, 'emit').and.callThrough();
        clearInterval(service.game.gameTimer.intervalValue);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // socketOnConnect tests
    it('socketOnConnect call socket on event update board', () => {
        const boardUpdate: BoardUpdate = { word: 'test', orientation: Axis.V, positionX: 4, positionY: 8 };
        service['socketOnConnect']();
        socketMock.triggerEvent('update board', boardUpdate);
        expect(socketOnMockSpy).toHaveBeenCalled();
    });

    it('socketOnConnect call socket on event update letters', () => {
        const creator: Player = new Player('Riri');
        const joiner: Player = new Player('Lulu');
        service.game.players[0] = creator;
        service.game.players[1] = joiner;

        const stock: ScrabbleLetter[] = service.game.stock.letterStock;
        const letters: ScrabbleLetter[] = [new ScrabbleLetter('k'), new ScrabbleLetter('r')];
        const lettersUpdate: LettersUpdate = { newStock: stock, newLetters: letters, newScore: 48 };
        service['socketOnConnect']();
        socketMock.triggerEvent('update letters', lettersUpdate);
        expect(socketOnMockSpy).toHaveBeenCalled();
    });

    it('socketOnConnect call socket on event convert to solo', () => {
        const creator: Player = new Player('Riri');
        creator.socketId = '0';
        const joiner: Player = new Player('Lulu');
        joiner.socketId = '1';
        service.game.players[0] = creator;
        service.game.players[1] = joiner;
        service['socket'].id = '1';
        service['socketOnConnect']();
        socketMock.triggerEvent('convert to solo', { previousPlayerSocketId: '1', virtualPlayerName: 'Riri' });
        expect(socketOnMockSpy).toHaveBeenCalled();
    });

    // TODO: entrer dans le if
    // it('socketOnConnect call chatDisplayService addEntry if it is not endGame and if the player exists', () => {
    //     const creator: Player = new Player('Riri');
    //     creator.socketId = '0';
    //     const joiner: Player = new Player('Lulu');
    //     joiner.socketId = '1';
    //     service.game.players[0] = creator;
    //     service.game.players[1] = joiner;
    //     service['socket'].id = '1';
    //     service.game.isEndGame = true;
    //     service.socketOnConnect();
    //     // console.log(service.game.players.findIndex((p) => p.socketId === '1'));
    //     socketMock.triggerEvent('convert to solo', { previousPlayerSocketId: '1', virtualPlayerName: 'Riri' });
    //     expect(socketOnMockSpy).toHaveBeenCalled();
    //     // expect(chatDisplayServiceSpy.addEntry).toHaveBeenCalled();
    // });

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
        service.startCountdown();
        jasmine.clock().tick(1000);
        expect(secondsToMinutesSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('startCountdown should set isTurnPassed to true if the timer is over', () => {
        jasmine.clock().install();
        service.game.gameTimer.timerMs = 0;
        service.isTurnPassed = false;
        service.game.isEndGame = false;
        service.isTurnEndSubject = new BehaviorSubject<boolean>(true);
        service.startCountdown();
        jasmine.clock().tick(1000);

        expect(service.isTurnPassed).toBeTrue();
        jasmine.clock().uninstall();
    });

    // resetTimer tests
    it('resetTimer should call startCountdown', () => {
        const startCountDownSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'startCountdown');
        service.resetTimer();
        expect(startCountDownSpy).toHaveBeenCalled();
    });

    // passTurn tests
    it('passTurn should call return NoError if the player is active', () => {
        const player: Player = new Player('Riri');
        service.isTurnEndSubject = new BehaviorSubject<boolean>(true);
        expect(service.passTurn(player)).toEqual(ErrorType.ImpossibleCommand);

        player.isActive = true;
        expect(service.passTurn(player)).toEqual(ErrorType.NoError);
    });

    // exchangeLetters tests
    it('exchangeLetters should return ImpossibleCommand if the player is not active or if there is not enough letters in stock', () => {
        const player: Player = new Player('Riri');
        player.isActive = true;
        service.game.stock.letterStock = [];

        expect(service.exchangeLetters(player, 'sd')).toEqual(ErrorType.ImpossibleCommand);

        player.isActive = false;
        const randomLetters: ScrabbleLetter[] = [
            new ScrabbleLetter('k'),
            new ScrabbleLetter('d'),
            new ScrabbleLetter('v'),
            new ScrabbleLetter('h'),
            new ScrabbleLetter('r'),
            new ScrabbleLetter('a'),
            new ScrabbleLetter('l'),
            new ScrabbleLetter('e'),
        ];
        service.game.stock.letterStock = randomLetters;
        expect(service.exchangeLetters(player, 'aks')).toEqual(ErrorType.ImpossibleCommand);
    });

    it('exchangeLetters should return ImpossibleCommand if the player has not the letters he want to delete', () => {
        const randomLetters: ScrabbleLetter[] = [
            new ScrabbleLetter('k'),
            new ScrabbleLetter('d'),
            new ScrabbleLetter('v'),
            new ScrabbleLetter('h'),
            new ScrabbleLetter('r'),
            new ScrabbleLetter('a'),
            new ScrabbleLetter('l'),
            new ScrabbleLetter('e'),
        ];
        const player: Player = new Player('Riri');
        player.isActive = true;
        player.letters = randomLetters;

        expect(service.exchangeLetters(player, 'x')).toEqual(ErrorType.ImpossibleCommand);
    });

    it('exchangeLetters should return NoError and set isTurnPassed to false', () => {
        const randomLetters: ScrabbleLetter[] = [
            new ScrabbleLetter('k'),
            new ScrabbleLetter('d'),
            new ScrabbleLetter('v'),
            new ScrabbleLetter('h'),
            new ScrabbleLetter('r'),
            new ScrabbleLetter('a'),
            new ScrabbleLetter('l'),
            new ScrabbleLetter('e'),
        ];
        const player: Player = new Player('Riri');
        player.isActive = true;
        player.letters = randomLetters;
        service.isTurnEndSubject = new BehaviorSubject<boolean>(false);

        expect(service.exchangeLetters(player, 'dv')).toEqual(ErrorType.NoError);
        expect(service.isTurnPassed).toBeFalse();
    });

    it('exchangeLetters should call socket emit if it is multiplayer mode', () => {
        const randomLetters: ScrabbleLetter[] = [
            new ScrabbleLetter('k'),
            new ScrabbleLetter('d'),
            new ScrabbleLetter('v'),
            new ScrabbleLetter('h'),
            new ScrabbleLetter('r'),
            new ScrabbleLetter('a'),
            new ScrabbleLetter('l'),
            new ScrabbleLetter('e'),
        ];
        const player: Player = new Player('Riri');
        player.isActive = true;
        player.letters = randomLetters;
        service.isTurnEndSubject = new BehaviorSubject<boolean>(false);
        service.game.gameMode = GameType.MultiPlayer;
        service.exchangeLetters(player, 'dv');

        expect(socketEmitMockSpy).toHaveBeenCalled();
    });

    // place tests
    it('place should return ImpossibleCommand if the player is not active', async () => {
        const placeParams: PlaceParams = { position: new Vec2(1, 1), orientation: Axis.H, word: 'test' };
        const player: Player = new Player('Riri');

        expect(await service.place(player, placeParams)).toEqual(ErrorType.ImpossibleCommand);
    });

    it('place should call placeService place and just return the error result if the result is not NoError', async () => {
        const placeParams: PlaceParams = { position: new Vec2(1, 1), orientation: Axis.H, word: 'test' };
        const player: Player = new Player('Riri');
        player.isActive = true;

        placeServiceSpy.place.and.returnValue(ErrorType.SyntaxError);
        expect(await service.place(player, placeParams)).toEqual(ErrorType.SyntaxError);

        placeServiceSpy.place.and.returnValue(ErrorType.InvalidCommand);
        expect(await service.place(player, placeParams)).toEqual(ErrorType.InvalidCommand);
    });

    // synchronizeAfterPlaceCommand
    it('synchronizeAfterPlaceCommand should call socket emit if it is multiplayer mode and if there is no error', () => {
        const placeParams: PlaceParams = { position: new Vec2(0, 0), orientation: Axis.H, word: 'tes*' };
        const square1 = new Square(0, 0);
        const square2 = new Square(1, 0);
        const square3 = new Square(2, 0);
        const square4 = new Square(3, 0);
        square1.letter = new ScrabbleLetter('t');
        square2.letter = new ScrabbleLetter('e');
        square3.letter = new ScrabbleLetter('s');
        square4.letter = new ScrabbleLetter('*');
        service.game.scrabbleBoard.squares[0][0] = square1;
        service.game.scrabbleBoard.squares[1][0] = square2;
        service.game.scrabbleBoard.squares[2][0] = square3;
        service.game.scrabbleBoard.squares[3][0] = square4;

        const player: Player = new Player('Riri');
        player.letters = [new ScrabbleLetter('r'), new ScrabbleLetter('a'), new ScrabbleLetter('l'), new ScrabbleLetter('e')];
        player.score = 193;
        service.game.gameMode = GameType.Solo;

        service.synchronizeAfterPlaceCommand(ErrorType.ImpossibleCommand, placeParams, player);
        expect(socketEmitMockSpy).not.toHaveBeenCalled();

        service.synchronizeAfterPlaceCommand(ErrorType.NoError, placeParams, player);
        expect(socketEmitMockSpy).not.toHaveBeenCalled();

        service.game.gameMode = GameType.MultiPlayer;
        service.synchronizeAfterPlaceCommand(ErrorType.NoError, placeParams, player);
        expect(socketEmitMockSpy).toHaveBeenCalledTimes(2);

        const placeParams2: PlaceParams = { position: new Vec2(0, 0), orientation: Axis.V, word: 'ta' };
        const square5 = new Square(0, 1);
        square5.letter = new ScrabbleLetter('a');
        service.game.scrabbleBoard.squares[0][1] = square5;
        service.synchronizeAfterPlaceCommand(ErrorType.NoError, placeParams2, player);
        expect(socketEmitMockSpy).toHaveBeenCalled();
    });

    // addRackLetter tests
    it('addRackLetter should call rackService addLetter', () => {
        const randomLetters: ScrabbleLetter[] = [new ScrabbleLetter('r'), new ScrabbleLetter('a'), new ScrabbleLetter('l'), new ScrabbleLetter('e')];
        rackServiceSpy.rackLetters = randomLetters;
        const creator: Player = new Player('Riri');
        service.game.players[0] = creator;
        service.addRackLetters([new ScrabbleLetter('e')]);

        expect(rackServiceSpy.addLetter).toHaveBeenCalled();
    });

    // removeRackLetter tests
    it('removeRackLetter should call rackService removeLetter', () => {
        const randomLetters: ScrabbleLetter[] = [
            new ScrabbleLetter('k'),
            new ScrabbleLetter('d'),
            new ScrabbleLetter('v'),
            new ScrabbleLetter('h'),
            new ScrabbleLetter('r'),
            new ScrabbleLetter('a'),
            new ScrabbleLetter('l'),
            new ScrabbleLetter('e'),
        ];
        rackServiceSpy.rackLetters = randomLetters;
        const creator: Player = new Player('Riri');
        service.game.players[0] = creator;
        service.removeRackLetter(new ScrabbleLetter('e'));

        expect(rackServiceSpy.removeLetter).toHaveBeenCalled();
    });

    // drawRack tests
    it('drawRack should call rackService addLetter', () => {
        gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
        gridServiceSpy.scrabbleBoard.squares[0][0].isValidated = true;
        const word1: ScrabbleLetter[] = [new ScrabbleLetter('t'), new ScrabbleLetter('e'), new ScrabbleLetter('s'), new ScrabbleLetter('t')];
        const word2: ScrabbleLetter[] = [new ScrabbleLetter('f'), new ScrabbleLetter('i'), new ScrabbleLetter('n')];

        const scrabbleWord1: ScrabbleWord = new ScrabbleWord();
        const scrabbleWord2: ScrabbleWord = new ScrabbleWord();
        scrabbleWord1.content = word1;
        scrabbleWord2.content = word2;
        scrabbleWord1.orientation = Axis.H;
        scrabbleWord2.orientation = Axis.V;

        const newWords: ScrabbleWord[] = [scrabbleWord1, scrabbleWord2];
        service.drawRack(newWords);
        expect(rackServiceSpy.addLetter).toHaveBeenCalled();
    });
});
