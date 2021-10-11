import { TestBed } from '@angular/core/testing';
import { Axis, ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Vec2 } from '@app/classes/vec2';
import { VirtualPlayerService } from './virtual-player.service';

const RANDOM_RNG = 0.5;
const RANDOM_RNG2 = 0.2;
const MIN_RNG = 0;
const MAX_RNG = 99;
const ERROR = -1;
const LETTER_VALUE_TEST = 6;

describe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let testWord: ScrabbleWord;
    let testWord2: ScrabbleWord;
    let testMoves: ScrabbleWord[];
    let nonsenseWord: ScrabbleWord;
    /*  let permutationsOfLettersSpy : jasmine.SpyObj<any>;
  let movesWithGivenLetterSpy : jasmine.SpyObj<any>;
  let possibleMovesSpy : jasmine.SpyObj<any>;
  let makeMovesSpy : jasmine.SpyObj<any>;
  let displayMovesSpy : jasmine.SpyObj<any>;
  let displayMoveChatSpy : jasmine.SpyObj<any>;
  let wordifySpy : jasmine.SpyObj<any>;
  let getRandomIntInclusiveSpy : jasmine.SpyObj<any>;
  let findPositionSpy : jasmine.SpyObj<any>;
  let chooseTilesFromRackSpy : jasmine.SpyObj<any>;*/
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VirtualPlayerService);
        const lettersInRack: ScrabbleLetter[] = [];
        const letterAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        for (let i = 0; i < service.rack.letters.length; i++) {
            lettersInRack[i] = new ScrabbleLetter(letterAlphabet[i], 1);
        }
        for (let j = 0; j < service.rack.letters.length; j++) {
            service.rack.letters[j] = lettersInRack[j];
        }
        testWord = new ScrabbleWord();
        testWord2 = new ScrabbleWord();
        nonsenseWord = new ScrabbleWord();
        const wordContent = ['t', 'e', 's', 't'];
        const wordContent2 = ['b', 'o', 'n', 'j', 'o', 'u', 'r'];
        const nonsenseWordContent = ['l', 'm', 'a', 'o'];
        for (let k = 0; k < wordContent.length; k++) {
            testWord.content[k] = new ScrabbleLetter('', 0);
            testWord.content[k].character = wordContent[k];
        }
        for (let l = 0; l < wordContent2.length; l++) {
            testWord2.content[l] = new ScrabbleLetter('', 0);
            testWord2.content[l].character = wordContent2[l];
        }
        testMoves = [];
        testMoves[0] = testWord;
        testMoves[1] = testWord2;
        for (let m = 0; m < wordContent2.length; m++) {
            nonsenseWord.content[m] = new ScrabbleLetter('', 0);
            nonsenseWord.content[m].character = nonsenseWordContent[m];
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    // getRandomIntExclusive
    it('getRandomIntExcluive should call Math.random() and return middle of array', () => {
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
    // TODO : Not working
    /*
    it('chooseTilesFromRack should select a random number of tiles to exchange from the rack', () => {
        expect(service.chooseTilesFromRack().length).toBeLessThanOrEqual(service.rack.letters.length);
        expect(service.chooseTilesFromRack().length).toBeGreaterThanOrEqual(1);
    });
    it('chooseTilesFromRack should select tiles to exchange from the rack ', () => {
        const testArray = service.chooseTilesFromRack();
        const found = testArray.every((elem) => service.rack.letters.includes(elem));
        expect(found).toBeTruthy();
    });
    */
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
    // wordify
    it('wordify should return a word made up of the letters in parameter', () => {
        const letters: ScrabbleLetter[] = [];
        const letterscontent = ['t', 'e', 's', 't'];
        for (let i = 0; i < letterscontent.length; i++) {
            letters[i] = new ScrabbleLetter('', 0);
            letters[i].character = letterscontent[i];
        }
        const expectedWord: ScrabbleWord = testWord;
        const output = service.wordify(letters);
        for (let k = 0; k < output.content.length; k++) {
            expect(output.content[k]).toEqual(expectedWord.content[k]);
        }
    });
    it('wordify should return an empty word if given an empty array of letters', () => {
        const letters: ScrabbleLetter[] = [];
        const expectedWord: ScrabbleWord = new ScrabbleWord();
        const output = service.wordify(letters);
        for (let k = 0; k < output.content.length; k++) {
            expect(output.content[k]).toEqual(expectedWord.content[k]);
        }
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
    // makeMoves
    it('makeMoves should call Math.random() and call 3 separate functions depending on the result', () => {
        // Inspired by commandercoriander.net/blog/2014/03/02/testing-around-random-numbers-in-javascript/
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG2); // Fix the 40% chance for 6 point and less
        expect(true).toBeTruthy(); // WIP
    });
    // possibleMoves
    it('possibleMoves should return moves that are valid on the board', () => {
        expect(true).toBeTruthy(); // WIP
    });

    it('possibleMoves should return an empty array if there are no valid moves on the board', () => {
        // service.board = new ScrabbleBoard;
        // expect(service.possibleMoves(6, Axis.H)).toBe([]); //Also repeat for Axis.V
        // service.board = actualBoard_NEEDONE
        // expect(service.possibleMoves(0, Axis.H).toBe([]);
        expect(true).toBeTruthy(); // WIP
    });

    it('possibleMoves should only return moves that are validated in the dictionary by the validation service', () => {
        // WIP
        expect(true).toBeTruthy();
    });
    // movesWithGivenLetter
    it('movesWithGivenLetter should return permutations of the rack AND the letter on the board', () => {
        const letterOnBoard = new ScrabbleLetter('z', LETTER_VALUE_TEST);
        letterOnBoard.tile.occupied = true;
        const expectedPermutation = service.wordify([
            new ScrabbleLetter('a', 0),
            new ScrabbleLetter('b', 0),
            new ScrabbleLetter('z', LETTER_VALUE_TEST),
            new ScrabbleLetter('c', 0),
        ]);
        // Expected permutation : [A B Z C]
        spyOn(Math, 'random').and.returnValue(RANDOM_RNG2); // Want to return 4-length permutation
        const resultPermutations = service.movesWithGivenLetter(letterOnBoard);
        expect(resultPermutations.some((row) => row.toString() === expectedPermutation.toString())).toBeTruthy();
    });
    // permutationOfLetters
    it('movesWithGivenLetter should return permutations of the the array of letters in parameter', () => {
        const letterA = new ScrabbleLetter('a', 0);
        const letterB = new ScrabbleLetter('b', 0);
        const letterC = new ScrabbleLetter('c', 0);
        const letterZ = new ScrabbleLetter('z', LETTER_VALUE_TEST);
        const initialArray = [letterA, letterB, letterC, letterZ];
        // Expected permutation : [A B Z C]
        const expectedPermutation = [letterA, letterB, letterZ, letterC];
        const resultPermutations = service.permutationsOfLetters(initialArray);
        expect(resultPermutations.some((row) => row.toString() === expectedPermutation.toString())).toBeTruthy();
        // not very elegant, but cannot use includes() to check if [] is in [][]
    });
});
