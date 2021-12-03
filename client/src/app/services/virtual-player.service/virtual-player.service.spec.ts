import { TestBed } from '@angular/core/testing';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Axis } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { Points, VirtualPlayerService } from './virtual-player.service';
import { Difficulty } from '@app/classes/virtual-player/virtual-player';

const RANDOM_RNG = 0.5;
const RANDOM_RNG2 = 0.2;
const MIN_RNG = 0;
const MAX_RNG = 99;
const ERROR = -1;
const POINTS = 6;
const ARRAY_LENGTH = 5;

fdescribe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let testWord: ScrabbleWord;
    let testWord2: ScrabbleWord;
    let testMoves: ScrabbleWord[];
    let nonsenseWord: ScrabbleWord;
    let highValueWord: ScrabbleWord;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VirtualPlayerService);
        const lettersInRack: ScrabbleLetter[] = [];
        const letterAlphabet = ['a', 'r', 'o', 'z', 'i', 'n', 'c'];
        for (let i = 0; i < service.rack.length; i++) {
            lettersInRack[i] = new ScrabbleLetter(letterAlphabet[i], 1);
        }
        for (let j = 0; j < service.rack.length; j++) {
            service.rack[j] = lettersInRack[j];
        }
        testWord = new ScrabbleWord();
        testWord2 = new ScrabbleWord();
        nonsenseWord = new ScrabbleWord();
        highValueWord = new ScrabbleWord();
        const wordContent = ['t', 'e', 's', 't'];
        const wordContent2 = ['b', 'o', 'n', 'j', 'o', 'u', 'r'];
        const nonsenseWordContent = ['l', 'm', 'a', 'o'];
        const wordManyPoints = ['r', 'i', 'c', 'h', 'e'];
        for (let k = 0; k < wordContent.length; k++) {
            testWord.content[k] = new ScrabbleLetter('', 1);
            testWord.content[k].character = wordContent[k];
        }
        for (let l = 0; l < wordContent2.length; l++) {
            testWord2.content[l] = new ScrabbleLetter('', 1);
            testWord2.content[l].character = wordContent2[l];
        }
        testMoves = [];
        testMoves[0] = testWord;
        testMoves[1] = testWord2;
        for (let m = 0; m < nonsenseWordContent.length; m++) {
            nonsenseWord.content[m] = new ScrabbleLetter('', 1);
            nonsenseWord.content[m].character = nonsenseWordContent[m];
        }
        for (let n = 0; n < wordManyPoints.length; n++) {
            highValueWord.content[n] = new ScrabbleLetter('', POINTS);
            highValueWord.content[n].character = wordManyPoints[n];
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
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
    it('chooseTilesFromRack should select a random number of tiles to exchange from the rack', () => {
        expect(service.chooseTilesFromRack(Points.MaxValue1).length).toBeLessThanOrEqual(service.rack.length);
        expect(service.chooseTilesFromRack(Points.MaxValue1).length).toBeGreaterThanOrEqual(1);
        expect(service.chooseTilesFromRack(Points.MaxValue4).length).toBe(service.rack.length);
    });

    it('chooseTilesFromRack should select tiles to exchange from the rack ', () => {
        const testArrayEasy = service.chooseTilesFromRack(Points.MaxValue1);
        const foundEasy = testArrayEasy.every((elem) => service.rack.includes(elem));
        expect(foundEasy).toBeTruthy();
        const testArrayExpert = service.chooseTilesFromRack(Points.MaxValue1);
        const foundExpert = service.rack.every((elem) => testArrayExpert.includes(elem));
        expect(foundExpert).toBeTruthy();
    });
    // findPosition
    it('findPosition should return the position of the first letter of the word', () => {
        const gap = 1;
        testWord.content[gap].tile.occupied = true;
        testWord.content[gap].tile.position.x = gap;
        testWord.content[gap].tile.position.y = gap;
        expect(service.findPosition(testWord, Axis.V).y).toBe(0);
        expect(service.findPosition(testWord, Axis.H).x).toBe(0);
    });
    it('findPosition should return (-1, -1) if there is no letter on the board', () => {
        expect(service.findPosition(testWord, Axis.V).x).toBe(ERROR);
        expect(service.findPosition(testWord, Axis.V).y).toBe(ERROR);
        expect(service.findPosition(testWord, Axis.H).x).toBe(ERROR);
        expect(service.findPosition(testWord, Axis.H).y).toBe(ERROR);
    });
    // displayMovesChat
    it('displayMovesChat should return a string starting with "!placer" if the move is valid', () => {
        const position: Vec2 = new Vec2();
        position.x = 1;
        position.y = 1;
        expect(service.displayMoveChat(testWord, position, Axis.V).startsWith('!placer')).toBeTruthy();
    });
    it('displayMovesChat should return a string starting with "Erreur" if the position or the move are invalid', () => {
        const positionError: Vec2 = new Vec2();
        positionError.x = -1;
        positionError.y = -1;
        expect(service.displayMoveChat(testWord, positionError, Axis.V).startsWith('Erreur')).toBeTruthy();
        const wordError: ScrabbleWord = new ScrabbleWord();
        expect(service.displayMoveChat(wordError, positionError, Axis.V).startsWith('Erreur')).toBeTruthy();
        const position: Vec2 = new Vec2();
        position.x = 1;
        position.y = 1;
        expect(service.displayMoveChat(wordError, position, Axis.V).startsWith('Erreur')).toBeTruthy();
    });
    // displayMoves
    it('displayMoves should return a string representing the moves in parameter', () => {
        expect(service.displayMoves(testMoves)).toBeTruthy();
    });
    it('displayMoves should return a string when the move made was the only one possible, or when there are no possible moves', () => {
        const testMoveEmpty: ScrabbleWord[] = [];
        expect(service.displayMoves(testMoveEmpty)).toBe(
            "Il n'y a aucun placement valide pour la plage de points et la longueur de mot sélectionnées par le joueur virtuel.",
        );
        const testMoveSingle: ScrabbleWord[] = [];
        testMoveSingle[0] = testWord;
        expect(service.displayMoves(testMoveSingle)).toBe(
            'Le placement joué est le seul valide pour la plage de points et la longueur sélectionnée par le joueur virtuel.',
        );
    });
    // playTurn
    it('playTurn should call Math.random() and call 3 separate functions depending on the result (0-40% for Easy VP)', () => {
        // Inspired by commandercoriander.net/blog/2014/03/02/testing-around-random-numbers-in-javascript/
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG2); // Fix the 40% chance for 6 point and less
        service.type = Difficulty.Easy;
        const spy = spyOn(service, 'makeMoves');
        service.playTurn();
        expect(spy).toHaveBeenCalled();
    });

    it('playTurn should call Math.random() and call 3 separate functions depending on the result (40-70% for Easy VP)', () => {
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG); // Fix the 30% chance for 7-12 points
        service.type = Difficulty.Easy;
        const spy = spyOn(service, 'makeMoves');
        service.playTurn();
        expect(spy).toHaveBeenCalled();
    });

    it('makeMoves should call Math.random() and call 3 separate functions depending on the result (70-100% for Easy VP)', () => {
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG + RANDOM_RNG2 + RANDOM_RNG2); // Fix the 30% chance for 13-18 points
        service.type = Difficulty.Easy;
        const spy = spyOn(service, 'makeMoves');
        service.playTurn();
        expect(spy).toHaveBeenCalled();
    });

    it('makeMoves should always try to make moves when the virtual player is on expert mode.', () => {
        // Fix the 30% chance for 13-18 points
        service.type = Difficulty.Difficult;
        const spy = spyOn(service, 'makeMoves').and.returnValue([]);
        service.playTurn();
        expect(spy).toHaveBeenCalled();
    });

    // movesWithGivenLetter
    it('movesWithGivenLetter should return permutations of the rack AND the letter on the board', () => {
        const letterOnBoard = new ScrabbleLetter('e', POINTS);
        letterOnBoard.tile.position.x = 1;
        letterOnBoard.tile.position.y = 1;
        letterOnBoard.tile.occupied = true;
        const expectedPermutation = new ScrabbleWord();
        expectedPermutation.content = [
            letterOnBoard,
            new ScrabbleLetter('c', 1),
            new ScrabbleLetter('r', 1),
            new ScrabbleLetter('a', 1),
            new ScrabbleLetter('n', 1),
        ];
        expectedPermutation.startPosition = new Vec2(1, 1);
        expectedPermutation.orientation = Axis.V;
        const permLength = expectedPermutation.content.length;
        // Expected permutation : [E C R A N]
        spyOn(service, 'getRandomIntInclusive').and.returnValue(ARRAY_LENGTH); // Want to return 5-length permutation
        const resultPermutations = service.movesWithGivenLetter(letterOnBoard, permLength);
        expect(resultPermutations).toContain(expectedPermutation);
    });
    it('movesWithGivenLetter should add permutations that are words in the dictionary', () => {
        const permutation1: ScrabbleLetter[] = [];
        const permutation2: ScrabbleLetter[] = [];
        const permutation3: ScrabbleLetter[] = [];
        permutation1[0] = new ScrabbleLetter('c', 0);
        permutation1[1] = new ScrabbleLetter('r', 0);
        permutation1[2] = new ScrabbleLetter('a', 0);
        permutation1[3] = new ScrabbleLetter('b', 0);
        permutation1[4] = new ScrabbleLetter('e', 0);
        // crabe 👆 berca 👇
        permutation2[0] = new ScrabbleLetter('b', 0);
        permutation2[1] = new ScrabbleLetter('e', 0);
        permutation2[2] = new ScrabbleLetter('r', 0);
        permutation2[3] = new ScrabbleLetter('c', 0);
        permutation2[4] = new ScrabbleLetter('a', 0);
        // nonsense word 👇
        permutation3[0] = new ScrabbleLetter('a', 0);
        permutation3[1] = new ScrabbleLetter('b', 0);
        permutation3[2] = new ScrabbleLetter('c', 0);
        permutation3[3] = new ScrabbleLetter('e', 0);
        permutation3[4] = new ScrabbleLetter('r', 0);
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
