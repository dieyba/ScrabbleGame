import { TestBed } from '@angular/core/testing';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Axis } from '@app/classes/utilities/utilities';
import { DEFAULT_VIRTUAL_PLAYER_WAIT_TIME, Points, VirtualPlayerService } from './virtual-player.service';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { GridService } from '@app/services/grid.service/grid.service';
import { GameService } from '@app/services/game.service/game.service';
import { CommandInvokerService } from '@app/services/command-invoker.service/command-invoker.service';
import { PlaceService } from '@app/services/place.service/place.service';
import { ValidationService } from '@app/services/validation.service/validation.service';
import { WordBuilderService } from '@app/services/word-builder.service/word-builder.service';
import { BOARD_SIZE, ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { GameParameters } from '@app/classes/game-parameters/game-parameters';
import { RACK_SIZE } from '@app/classes/scrabble-rack/scrabble-rack';
import { ScrabbleMove } from '@app/classes/scrabble-move/scrabble-move';
import { Vec2 } from '@app/classes/vec2/vec2';

const RANDOM_RNG = 0.5;
const RANDOM_RNG2 = 0.2;
const MIN_RNG = 0;
const MAX_RNG = 99;
const ERROR = -1;
const POINTS = 6;
const MIDDLE_OF_BOARD = 7;

fdescribe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let testWord: ScrabbleWord;
    let testWord2: ScrabbleWord;
    let testWord3: ScrabbleWord;
    let testMoves: ScrabbleMove[];
    let nonsenseWord: ScrabbleWord;
    let highValueWord: ScrabbleWord;
    let validationSpy: jasmine.SpyObj<ValidationService>;
    let gridSpy: jasmine.SpyObj<GridService>;
    let commandSpy: jasmine.SpyObj<CommandInvokerService>;

    beforeEach(() => {
        commandSpy = jasmine.createSpyObj('CommandInvokerService', ['executeCommand']);
        const gameSpy = jasmine.createSpyObj('GameService', ['']);
        gridSpy = jasmine.createSpyObj('GridService', ['']);
        const placeSpy = jasmine.createSpyObj('PlaceService', ['canPlaceWord']);
        validationSpy = jasmine.createSpyObj('ValidationService', ['isWordValid']);
        const wordBuilderSpy = jasmine.createSpyObj('WordBuilderService', ['buildWordsOnBoard']);
        // Provide both the service-to-test and its (spy) dependency
        TestBed.configureTestingModule({
            providers: [
                VirtualPlayerService,
                { provide: CommandInvokerService, useValue: commandSpy },
                { provide: GameService, useValue: gameSpy },
                { provide: GridService, useValue: gridSpy },
                { provide: PlaceService, useValue: placeSpy },
                { provide: ValidationService, useValue: validationSpy },
                { provide: WordBuilderService, useValue: wordBuilderSpy },
            ],
        });
        const thisVirtualPlayer = new VirtualPlayer('Buddy', Difficulty.Easy);
        thisVirtualPlayer.letters = [];
        gameSpy.game = new GameParameters();
        spyOn(gameSpy.game, 'getOpponent').and.returnValue(thisVirtualPlayer);
        gridSpy.scrabbleBoard = new ScrabbleBoard(false);
        gridSpy.scrabbleBoard.squares[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letter = new ScrabbleLetter('a', 1);
        gridSpy.scrabbleBoard.squares[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].occupied = true;
        gridSpy.scrabbleBoard.squares[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].isValidated = true;
        gridSpy.scrabbleBoard.squares[MIDDLE_OF_BOARD - 1][MIDDLE_OF_BOARD].letter = new ScrabbleLetter('t', 1);
        gridSpy.scrabbleBoard.squares[MIDDLE_OF_BOARD - 1][MIDDLE_OF_BOARD].occupied = true;
        gridSpy.scrabbleBoard.squares[MIDDLE_OF_BOARD - 1][MIDDLE_OF_BOARD].isValidated = true;
        service = TestBed.inject(VirtualPlayerService);
        const lettersInRack: ScrabbleLetter[] = [];
        const letterAlphabet = ['a', 'r', 'o', 'z', 'i', 'n', 'c'];
        for (let i = 0; i < RACK_SIZE; i++) {
            lettersInRack[i] = new ScrabbleLetter(letterAlphabet[i], 1);
        }
        service.rack = lettersInRack;
        testWord = new ScrabbleWord();
        testWord2 = new ScrabbleWord();
        testWord3 = new ScrabbleWord();
        nonsenseWord = new ScrabbleWord();
        highValueWord = new ScrabbleWord();
        const wordContent = ['t', 'e', 's', 't'];
        const wordContent2 = ['b', 'o', 'n', 'j', 'o', 'u', 'r'];
        const wordContent3 = ['t', 'a', 'r', 't', 'e'];
        const nonsenseWordContent = ['l', 'm', 'a', 'o'];
        const wordManyPoints = ['r', 'i', 'c', 'h', 'e'];
        for (let i = 0; i < wordContent.length; i++) {
            testWord.content[i] = new ScrabbleLetter('', 1);
            testWord.content[i].character = wordContent[i];
        }
        for (let i = 0; i < wordContent2.length; i++) {
            testWord2.content[i] = new ScrabbleLetter('', 1);
            testWord2.content[i].character = wordContent2[i];
        }
        for (let i = 0; i < wordContent3.length; i++) {
            testWord3.content[i] = new ScrabbleLetter('', 1);
            testWord3.content[i].character = wordContent3[i];
        }
        testWord3.content[0].tile.occupied = true;
        testWord3.content[0].tile.isValidated = true;
        testMoves = [];
        for (let i = 0; i < 2; i++) {
            testMoves[i] = new ScrabbleMove();
        }
        testMoves[0].word = testWord;
        testMoves[0].axis = Axis.H;
        testMoves[0].position = new Vec2(MIDDLE_OF_BOARD, MIDDLE_OF_BOARD);
        testMoves[0].value = 1;
        testMoves[1].word = testWord2;
        testMoves[1].axis = Axis.V;
        testMoves[1].position = new Vec2(MIDDLE_OF_BOARD, MIDDLE_OF_BOARD);
        testMoves[1].value = 1;
        for (let i = 0; i < nonsenseWordContent.length; i++) {
            nonsenseWord.content[i] = new ScrabbleLetter('', 1);
            nonsenseWord.content[i].character = nonsenseWordContent[i];
        }
        for (let i = 0; i < wordManyPoints.length; i++) {
            highValueWord.content[i] = new ScrabbleLetter('', POINTS);
            highValueWord.content[i].character = wordManyPoints[i];
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    // playTurn
    it('playTurn should skip a turn 10% of the time in Easy mode', () => {
        jasmine.clock().install();
        spyOn(service, 'getRandomIntInclusive').and.returnValue(1); // skip turn
        service.playTurn();
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(commandSpy.executeCommand).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('playTurn should exchange letters 10% of the time in Easy mode', () => {
        jasmine.clock().install();
        const exchangeRNGValue = 15;
        spyOn(service, 'getRandomIntInclusive').and.returnValue(exchangeRNGValue);
        const chooseTileSpy = spyOn(service, 'chooseTilesFromRack').and.returnValue([service.rack[0]]);
        service.playTurn();
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(chooseTileSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('playTurn should make the VP end turn if there it cannot exchange letters', () => {
        jasmine.clock().install();
        const exchangeRNGValue = 15;
        spyOn(service, 'getRandomIntInclusive').and.returnValue(exchangeRNGValue);
        const chooseTileSpy = spyOn(service, 'chooseTilesFromRack').and.returnValue([]);
        service.playTurn();
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(chooseTileSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('playTurn should try and play a move in easy mode 80% of the time', () => {
        spyOn(service, 'permutationsWithBoard').and.returnValue([testWord]);
        spyOn(service, 'makeMoves').and.returnValue(testMoves);
        spyOn(service, 'getRandomIntInclusive').and.returnValue(MAX_RNG); // Always play a move
        jasmine.clock().install();
        service.playTurn();
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(commandSpy.executeCommand).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('playTurn should always try to play a move in Expert mode', () => {
        service.type = Difficulty.Difficult;
        spyOn(service, 'permutationsWithBoard').and.returnValue([testWord]);
        spyOn(service, 'makeMoves').and.returnValue(testMoves);
        jasmine.clock().install();
        service.playTurn();
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(commandSpy.executeCommand).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('playTurn should always try to play a move in Expert mode (first turn)', () => {
        service.type = Difficulty.Difficult;
        spyOn(service, 'permutationsWithBoard').and.returnValue([]);
        const firstTurnSpy = spyOn(service, 'playFirstTurn');
        jasmine.clock().install();
        service.playTurn();
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(firstTurnSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('playTurn should always try to play a move in Expert mode, but if it does not find any it should skip the turn', () => {
        service.type = Difficulty.Easy;
        spyOn(service, 'permutationsWithBoard').and.returnValue([testWord]);
        spyOn(service, 'makeMoves').and.returnValue([]);
        jasmine.clock().install();
        service.playTurn();
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(commandSpy.executeCommand).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('playTurn should always try to play a move in Expert mode, but if it does not find any it should exchange letters', () => {
        service.type = Difficulty.Difficult;
        spyOn(service, 'permutationsWithBoard').and.returnValue([testWord]);
        spyOn(service, 'makeMoves').and.returnValue([]);
        jasmine.clock().install();
        service.playTurn();
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(commandSpy.executeCommand).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
    // debugMessageGenerator
    it('debugMessageGenerator should return a string', () => {
        expect(service.debugMessageGenerator(testMoves)).toEqual(jasmine.any(String));
        const otherTestMove: ScrabbleMove[] = [new ScrabbleMove(testWord, new Vec2(0, 0), Axis.V, 2)];
        expect(service.debugMessageGenerator(otherTestMove)).toEqual(jasmine.any(String));
    });
    // filterPermutations
    it('filterPermutations should return an array', () => {
        expect(service.filterPermutations([])).toEqual(jasmine.any(Array));
        expect(service.filterPermutations([testWord])).toEqual(jasmine.any(Array));
    });
    // isPossiblePermutation
    it('isPossiblePermutation should return true if the word can be placed on the board', () => {
        expect(service.isPossiblePermutation(testWord, Axis.H)).toBeTruthy();
        testWord.content[0].tile.isValidated = true;
        expect(service.isPossiblePermutation(testWord, Axis.H)).toBeTruthy();
        expect(service.isPossiblePermutation(testWord, Axis.V)).toBeTruthy();
        testWord3.content[0].tile.isValidated = true;
        testWord3.content[0].tile.position = new Vec2(BOARD_SIZE - 1, BOARD_SIZE - 1);
        expect(service.isPossiblePermutation(testWord3, Axis.H)).toBeTruthy();
    });
    // playFirstTurn
    it('playFirstTurn should try to make moves with the rack', () => {
        service.type = Difficulty.Difficult;
        spyOn(service, 'findFirstValidMoves').and.returnValue(testMoves);
        jasmine.clock().install();
        const wordList = [testWord, testWord2];
        service.playFirstTurn(wordList, 1);
        jasmine.clock().tick(DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        expect(commandSpy.executeCommand).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
    // getRandomIntExclusive
    it('getRandomIntExclusive should call Math.random() and return middle of the interval', () => {
        // Inspired by commandercoriander.net/blog/2014/03/02/testing-around-random-numbers-in-javascript/
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG);
        const median = (MAX_RNG + 1) / 2;
        expect(service.getRandomIntInclusive(MIN_RNG, MAX_RNG)).toBe(median);
    });

    it('getRandomIntInclusive should return a number between min and max', () => {
        const result = service.getRandomIntInclusive(MIN_RNG, MAX_RNG);
        expect(result >= MIN_RNG && result <= MAX_RNG).toBeTruthy();
    });
    // chooseTilesFromRack
    it('chooseTilesFromRack should select a random number of tiles to exchange from the rack, except for the Expert VP', () => {
        expect(service.chooseTilesFromRack(Points.MaxValue1).length).toBeLessThanOrEqual(service.rack.length);
        expect(service.chooseTilesFromRack(Points.MaxValue1).length).toBeGreaterThanOrEqual(1);
        expect(service.chooseTilesFromRack(Points.MaxValue4).length).toEqual(service.rack.length);
    });

    it('chooseTilesFromRack should select tiles to exchange from the rack ', () => {
        const testArrayEasy = service.chooseTilesFromRack(Points.MaxValue1);
        const foundEasy = testArrayEasy.every((elem) => service.rack.includes(elem));
        expect(foundEasy).toBeTruthy();
        const testArrayExpert = service.chooseTilesFromRack(Points.MaxValue4);
        const foundExpert = service.rack.every((elem) => testArrayExpert.includes(elem));
        expect(foundExpert).toBeTruthy();
    });
    // findPosition
    it('findPosition should return a position in the middle row if it is the first turn', () => {
        const horizontalResult = service.findPosition(testWord, Axis.H, true);
        const verticalResult = service.findPosition(testWord, Axis.V, true);
        expect(horizontalResult.x).toBe(MIDDLE_OF_BOARD);
        expect(verticalResult.y).toBe(MIDDLE_OF_BOARD);
    });

    it('findPosition should return (-1, -1) if it cannot find a position for the word on the board', () => {
        expect(service.findPosition(testWord, Axis.V).x).toBe(ERROR);
        expect(service.findPosition(testWord, Axis.V).y).toBe(ERROR);
        expect(service.findPosition(testWord, Axis.H).x).toBe(ERROR);
        expect(service.findPosition(testWord, Axis.H).y).toBe(ERROR);
    });
    // selectRandomValue
    it('selectRandomValue should decide on a points interval (0-40% chance of aiming for less than 6 points for Easy VP)', () => {
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG2); // Fix the 40% chance for 6 point and less (0-40)
        const result = service.selectRandomValue();
        expect(result).toBe(Points.MaxValue1);
    });

    it('selectRandomValue should decide on a points interval (30% chance of aiming for 7-12 points for Easy VP)', () => {
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG); // Fix the 30% chance for 7-12 points (40-70)
        const result = service.selectRandomValue();
        expect(result).toBe(Points.MaxValue2);
    });

    it('selectRandomValue should decide on a points interval (30% chance of aiming for 13-18 points for Easy VP)', () => {
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG + RANDOM_RNG2 + RANDOM_RNG2); // Fix the 30% chance for 13-18 points (70-100)
        const result = service.selectRandomValue();
        expect(result).toBe(Points.MaxValue3);
    });

    it('selectRandomValue should aim for the maximum amount of points automatically if the VP is set to Expert', () => {
        // No need to fix the random number generator, the function will return the maximum value
        service.type = Difficulty.Difficult;
        const result = service.selectRandomValue();
        expect(result).toBe(Points.MaxValue4);
    });

    // movesWithGivenLetter
    it('movesWithGivenLetter should return permutations of the rack and the letter on the board', () => {
        const letterOnBoard = new ScrabbleLetter('e', POINTS);
        letterOnBoard.tile.position.x = 1;
        letterOnBoard.tile.position.y = 1;
        letterOnBoard.tile.occupied = true;
        letterOnBoard.tile.isValidated = true;
        const expectedPermutation = new ScrabbleWord();
        expectedPermutation.content = [
            letterOnBoard,
            new ScrabbleLetter('c', 1),
            new ScrabbleLetter('r', 1),
            new ScrabbleLetter('a', 1),
            new ScrabbleLetter('n', 1),
        ];
        service.rack = [new ScrabbleLetter('c', 1), new ScrabbleLetter('r', 1), new ScrabbleLetter('a', 1), new ScrabbleLetter('n', 1)];
        const permLength = expectedPermutation.content.length;
        spyOn(service, 'isWordValid').and.returnValue(true);
        // Expected permutation : [E C R A N]
        const resultPermutations = service.movesWithGivenLetter(letterOnBoard, permLength);
        expect(resultPermutations).toContain(jasmine.objectContaining(expectedPermutation));
    });

    // isWordValid
    it('isWordValid should return true if a word is valid in the dictionary', () => {
        const wordValidSpy = validationSpy.isWordValid;
        service.isWordValid('infolog');
        expect(wordValidSpy).toHaveBeenCalled();
    });

    // permutationsWithBoard
    it('permutationsWithBoard should return an empty array if there are no valid words that can be placed on the board', () => {
        gridSpy.scrabbleBoard = new ScrabbleBoard(false);
        const result = service.permutationsWithBoard();
        expect(result).toEqual([]);
    });
    it('permutationsWithBoard should call function allSubsetPermutations if there is at least one letter on the board', () => {
        gridSpy.scrabbleBoard = new ScrabbleBoard(false);
        gridSpy.scrabbleBoard.squares[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letter = new ScrabbleLetter('x', 1);
        gridSpy.scrabbleBoard.squares[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letter.tile.occupied = true;
        const fakeWordList: ScrabbleWord[][] = [];
        const fakeWordListInit: ScrabbleWord[] = [];
        fakeWordList[0] = fakeWordListInit;
        fakeWordList[0][0] = testWord;
        fakeWordList[0][1] = testWord2;
        fakeWordList[0][2] = testWord3;
        const subsetSpy = spyOn(service, 'allSubsetPermutations').and.returnValue(fakeWordList);
        service.permutationsWithBoard();
        expect(subsetSpy).toHaveBeenCalled();
    });

    // permutationOfLetters
    it('permutationOfLetters should return permutations of the the array of letters in parameter', () => {
        const letterA = new ScrabbleLetter('a', 0);
        const letterB = new ScrabbleLetter('b', 0);
        const letterC = new ScrabbleLetter('c', 0);
        const letterZ = new ScrabbleLetter('z', POINTS);
        const initialArray = [letterA, letterB, letterC, letterZ];
        // Expected permutation : [A B Z C]
        const expectedPermutation = [letterA, letterB, letterZ, letterC];
        const resultPermutations = service.permutationsOfLetters(initialArray);
        expect(resultPermutations).toContain(expectedPermutation);
    });
    it('permutationOfLetters should return permutations of the the array of letters in parameter', () => {
        const letterA = new ScrabbleLetter('a', 0);
        const letterB = new ScrabbleLetter('b', 0);
        const letterC = new ScrabbleLetter('c', 0);
        const letterZ = new ScrabbleLetter('z', POINTS);
        const initialArray = [letterA, letterB, letterC, letterZ];
        // Expected permutation : [A B Z C]
        const expectedPermutation = [letterA, letterB, letterZ, letterC];
        const resultPermutations = service.permutationsOfLetters(initialArray);
        expect(resultPermutations).toContain(expectedPermutation);
    });
});
