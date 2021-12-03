// import { TestBed } from '@angular/core/testing';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter';
// import { Axis } from '@app/classes/utilities';
// import { ScrabbleWord } from '@app/classes/scrabble-word';
// import { Vec2 } from '@app/classes/vec2';
// import { VirtualPlayerService } from './virtual-player.service';

// const RANDOM_RNG = 0.5;
// const RANDOM_RNG2 = 0.2;
// const MIN_RNG = 0;
// const MAX_RNG = 99;
// const ERROR = -1;
// const POINTS = 6;
// const ARRAY_LENGTH = 5;

// describe('VirtualPlayerService', () => {
//     let service: VirtualPlayerService;
//     let testWord: ScrabbleWord;
//     let testWord2: ScrabbleWord;
//     let testMoves: ScrabbleWord[];
//     let nonsenseWord: ScrabbleWord;
//     let highValueWord: ScrabbleWord;
//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(VirtualPlayerService);
//         const lettersInRack: ScrabbleLetter[] = [];
//         const letterAlphabet = ['a', 'r', 'o', 'z', 'i', 'n', 'c'];
//         for (let i = 0; i < service.rack.letters.length; i++) {
//             lettersInRack[i] = new ScrabbleLetter(letterAlphabet[i], 1);
//         }
//         for (let j = 0; j < service.rack.letters.length; j++) {
//             service.rack.letters[j] = lettersInRack[j];
//         }
//         testWord = new ScrabbleWord();
//         testWord2 = new ScrabbleWord();
//         nonsenseWord = new ScrabbleWord();
//         highValueWord = new ScrabbleWord();
//         const wordContent = ['t', 'e', 's', 't'];
//         const wordContent2 = ['b', 'o', 'n', 'j', 'o', 'u', 'r'];
//         const nonsenseWordContent = ['l', 'm', 'a', 'o'];
//         const wordManyPoints = ['r', 'i', 'c', 'h', 'e'];
//         for (let k = 0; k < wordContent.length; k++) {
//             testWord.content[k] = new ScrabbleLetter('', 1);
//             testWord.content[k].character = wordContent[k];
//         }
//         for (let l = 0; l < wordContent2.length; l++) {
//             testWord2.content[l] = new ScrabbleLetter('', 1);
//             testWord2.content[l].character = wordContent2[l];
//         }
//         testMoves = [];
//         testMoves[0] = testWord;
//         testMoves[1] = testWord2;
//         for (let m = 0; m < nonsenseWordContent.length; m++) {
//             nonsenseWord.content[m] = new ScrabbleLetter('', 1);
//             nonsenseWord.content[m].character = nonsenseWordContent[m];
//         }
//         for (let n = 0; n < wordManyPoints.length; n++) {
//             highValueWord.content[n] = new ScrabbleLetter('', POINTS);
//             highValueWord.content[n].character = wordManyPoints[n];
//         }
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });
//     // getRandomIntExclusive
//     it('getRandomIntExclusive should call Math.random() and return middle of array', () => {
//         // Inspired by commandercoriander.net/blog/2014/03/02/testing-around-random-numbers-in-javascript/
//         spyOn(Math, 'random').and.returnValue(RANDOM_RNG);

//         const median = (MAX_RNG + 1) / 2;
//         expect(service.getRandomIntInclusive(MIN_RNG, MAX_RNG)).toBe(median);
//     });
//     it('getRandomIntInclusive should return a number between min and max', () => {
//         const result = service.getRandomIntInclusive(MIN_RNG, MAX_RNG);
//         expect(result >= MIN_RNG && result <= MAX_RNG).toBeTruthy();
//     });
//     // chooseTilesFromRack
//     it('chooseTilesFromRack should select a random number of tiles to exchange from the rack', () => {
//         expect(service.chooseTilesFromRack().length).toBeLessThanOrEqual(service.rack.letters.length);
//         expect(service.chooseTilesFromRack().length).toBeGreaterThanOrEqual(1);
//     });
//     it('chooseTilesFromRack should select tiles to exchange from the rack ', () => {
//         const testArray = service.chooseTilesFromRack();
//         const found = testArray.every((elem) => service.rack.letters.includes(elem));
//         expect(found).toBeTruthy();
//     });
//     // findPosition
//     it('findPosition should return the position of the first letter of the word', () => {
//         const gap = 1;
//         testWord.content[gap].tile.occupied = true;
//         testWord.content[gap].tile.position.x = gap;
//         testWord.content[gap].tile.position.y = gap;
//         expect(service.findPosition(testWord, Axis.V).y).toBe(0);
//         expect(service.findPosition(testWord, Axis.H).x).toBe(0);
//     });
//     it('findPosition should return (-1, -1) if there is no letter on the board', () => {
//         expect(service.findPosition(testWord, Axis.V).x).toBe(ERROR);
//         expect(service.findPosition(testWord, Axis.V).y).toBe(ERROR);
//         expect(service.findPosition(testWord, Axis.H).x).toBe(ERROR);
//         expect(service.findPosition(testWord, Axis.H).y).toBe(ERROR);
//     });
//     // wordify
//     it('wordify should return a word made up of the letters in parameter', () => {
//         const letters: ScrabbleLetter[] = [];
//         const lettersContent = ['t', 'e', 's', 't'];
//         for (let i = 0; i < lettersContent.length; i++) {
//             letters[i] = new ScrabbleLetter('', 1);
//             letters[i].character = lettersContent[i];
//         }
//         const expectedWord: ScrabbleWord = testWord;
//         const output = service.wordify(letters);
//         for (let k = 0; k < output.content.length; k++) {
//             expect(output.content[k]).toEqual(expectedWord.content[k]);
//         }
//     });
//     it('wordify should return an empty word if given an empty array of letters', () => {
//         const letters: ScrabbleLetter[] = [];
//         const output = service.wordify(letters);
//         expect(output.content.length).toEqual(0);
//     });
//     // displayMovesChat
//     it('displayMovesChat should return a string starting with "!placer" if the move is valid', () => {
//         const position: Vec2 = new Vec2();
//         position.x = 1;
//         position.y = 1;
//         expect(service.displayMoveChat(testWord, position, Axis.V).startsWith('!placer')).toBeTruthy();
//     });
//     it('displayMovesChat should return a string starting with "Erreur" if the position or the move are invalid', () => {
//         const positionError: Vec2 = new Vec2();
//         positionError.x = -1;
//         positionError.y = -1;
//         expect(service.displayMoveChat(testWord, positionError, Axis.V).startsWith('Erreur')).toBeTruthy();
//         const wordError: ScrabbleWord = new ScrabbleWord();
//         expect(service.displayMoveChat(wordError, positionError, Axis.V).startsWith('Erreur')).toBeTruthy();
//         const position: Vec2 = new Vec2();
//         position.x = 1;
//         position.y = 1;
//         expect(service.displayMoveChat(wordError, position, Axis.V).startsWith('Erreur')).toBeTruthy();
//     });
//     // displayMoves
//     it('displayMoves should return a string representing the moves in parameter', () => {
//         expect(service.displayMoves(testMoves)).toBeTruthy();
//     });
//     it('displayMoves should return a string when the move made was the only one possible, or when there are no possible moves', () => {
//         const testMoveEmpty: ScrabbleWord[] = [];
//         expect(service.displayMoves(testMoveEmpty)).toBe(
//             "Il n'y a aucun placement valide pour la plage de points et la longueur de mot sélectionnées par le joueur virtuel.",
//         );
//         const testMoveSingle: ScrabbleWord[] = [];
//         testMoveSingle[0] = testWord;
//         expect(service.displayMoves(testMoveSingle)).toBe(
//             'Le placement joué est le seul valide pour la plage de points et la longueur sélectionnée par le joueur virtuel.',
//         );
//     });
//     // makeMoves
//     it('makeMoves should call Math.random() and call 3 separate functions depending on the result (0-40%)', () => {
//         // Inspired by commandercoriander.net/blog/2014/03/02/testing-around-random-numbers-in-javascript/
//         spyOn(Math, 'random').and.returnValue(RANDOM_RNG2); // Fix the 40% chance for 6 point and less
//         const spy = spyOn(service, 'possibleMoves').and.returnValue([]);
//         service.makeMoves();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('makeMoves should call Math.random() and call 3 separate functions depending on the result (40-70%)', () => {
//         spyOn(Math, 'random').and.returnValue(RANDOM_RNG); // Fix the 30% chance for 7-12 points
//         const spy = spyOn(service, 'possibleMoves').and.returnValue([]);
//         service.makeMoves();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('makeMoves should call Math.random() and call 3 separate functions depending on the result (70-100%)', () => {
//         spyOn(Math, 'random').and.returnValue(RANDOM_RNG + RANDOM_RNG2 + RANDOM_RNG2); // Fix the 30% chance for 13-18 points
//         const spy = spyOn(service, 'possibleMoves').and.returnValue([]);
//         service.makeMoves();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('makeMoves should randomly select between the horizontal or vertical axis', () => {
//         spyOn(service, 'getRandomIntInclusive').and.returnValue(1); // invert axis
//         const spy = spyOn(service, 'possibleMoves').and.returnValue([]);
//         service.makeMoves();
//         expect(spy).toHaveBeenCalled();
//     });
//     // possibleMoves
//     it('possibleMoves should return an empty array if there are no valid moves on the board', () => {
//         expect(service.possibleMoves(0, Axis.H)).toEqual([]);
//         expect(service.possibleMoves(0, Axis.V)).toEqual([]);
//         expect(service.possibleMoves(POINTS, Axis.H)).toEqual([]); // Also repeat for Axis.V
//         expect(service.possibleMoves(POINTS, Axis.V)).toEqual([]);
//     });

//     it('possibleMoves should not return moves that are not validated in the dictionary by the validation service', () => {
//         // eslint-disable-next-line dot-notation
//         spyOn(service['validationService'], 'isPlacable').and.returnValue(true); // Method not implemented; change later
//         // eslint-disable-next-line dot-notation
//         service['gridService'].scrabbleBoard.squares[0][0].letter = new ScrabbleLetter('😎', 1); // Random letter
//         // eslint-disable-next-line dot-notation
//         service['gridService'].scrabbleBoard.squares[0][0].occupied = true;
//         expect(service.possibleMoves(POINTS, Axis.H)).toEqual([]);
//     });

//     it('possibleMoves should only return moves that are validated in the dictionary by the validation service', () => {
//         // eslint-disable-next-line dot-notation
//         spyOn(service['validationService'], 'isPlacable').and.returnValue(true); // Method not implemented; change later
//         // eslint-disable-next-line dot-notation
//         service['gridService'].scrabbleBoard.squares[0][0].letter = new ScrabbleLetter('😎', 1); // Random letter
//         // eslint-disable-next-line dot-notation
//         service['gridService'].scrabbleBoard.squares[0][0].occupied = true;
//         spyOn(service, 'movesWithGivenLetter').and.returnValue([testWord]);
//         expect(service.possibleMoves(POINTS, Axis.H)).toEqual([testWord]);
//     });

//     it('possibleMoves should not return moves if they are worth too many or too few points', () => {
//         // eslint-disable-next-line dot-notation
//         spyOn(service['validationService'], 'isPlacable').and.returnValue(true); // Method not implemented; change later
//         // eslint-disable-next-line dot-notation
//         service['gridService'].scrabbleBoard.squares[0][0].letter = new ScrabbleLetter('😎', 1); // Random letter
//         // eslint-disable-next-line dot-notation
//         service['gridService'].scrabbleBoard.squares[0][0].occupied = true;
//         spyOn(service, 'movesWithGivenLetter').and.returnValue([highValueWord]);
//         expect(service.possibleMoves(POINTS, Axis.H)).toEqual([]);
//     });
//     // TODO : Complete this test when allWordsCreated is done.
//     // it('possibleMoves should account for words created when a move is placed', () => {
//     //     // eslint-disable-next-line dot-notation
//     //     spyOn(service['validationService'], 'isPlacable').and.returnValue(true); // Method not implemented; change later
//     //     // eslint-disable-next-line dot-notation
//     //     service['gridService'].scrabbleBoard.squares[0][0].letter = new ScrabbleLetter('a', 1); // Random letter
//     //     // eslint-disable-next-line dot-notation
//     //     service['gridService'].scrabbleBoard.squares[0][0].occupied = true;
//     //     // ... Other squares ...
//     //     spyOn(service, 'movesWithGivenLetter').and.returnValue([testWord]);
//     //     expect(service.possibleMoves(POINTS, Axis.H)).toEqual([testWord]);
//     // });
//     // movesWithGivenLetter
//     it('movesWithGivenLetter should return permutations of the rack AND the letter on the board', () => {
//         const letterOnBoard = new ScrabbleLetter('e', POINTS);
//         letterOnBoard.tile.occupied = true;
//         const expectedPermutation = service.wordify([
//             letterOnBoard,
//             new ScrabbleLetter('c', 1),
//             new ScrabbleLetter('r', 1),
//             new ScrabbleLetter('a', 1),
//             new ScrabbleLetter('n', 1),
//         ]);
//         // Expected permutation : [E C R A N]
//         spyOn(service, 'getRandomIntInclusive').and.returnValue(ARRAY_LENGTH); // Want to return 5-length permutation
//         const resultPermutations = service.movesWithGivenLetter(letterOnBoard);
//         expect(resultPermutations).toContain(expectedPermutation);
//     });
//     it('movesWithGivenLetter should add permutations that are words in the dictionary', () => {
//         const permutation1: ScrabbleLetter[] = [];
//         const permutation2: ScrabbleLetter[] = [];
//         const permutation3: ScrabbleLetter[] = [];
//         permutation1[0] = new ScrabbleLetter('c', 0);
//         permutation1[1] = new ScrabbleLetter('r', 0);
//         permutation1[2] = new ScrabbleLetter('a', 0);
//         permutation1[3] = new ScrabbleLetter('b', 0);
//         permutation1[4] = new ScrabbleLetter('e', 0);
//         // crabe 👆 berca 👇
//         permutation2[0] = new ScrabbleLetter('b', 0);
//         permutation2[1] = new ScrabbleLetter('e', 0);
//         permutation2[2] = new ScrabbleLetter('r', 0);
//         permutation2[3] = new ScrabbleLetter('c', 0);
//         permutation2[4] = new ScrabbleLetter('a', 0);
//         // nonsense word 👇
//         permutation3[0] = new ScrabbleLetter('a', 0);
//         permutation3[1] = new ScrabbleLetter('b', 0);
//         permutation3[2] = new ScrabbleLetter('c', 0);
//         permutation3[3] = new ScrabbleLetter('e', 0);
//         permutation3[4] = new ScrabbleLetter('r', 0);
//         const permutations: ScrabbleLetter[][] = [permutation1, permutation2, permutation3];
//         spyOn(service, 'permutationsOfLetters').and.returnValue(permutations);
//         const expectedWords = [service.wordify(permutation1), service.wordify(permutation2)];
//         expect(service.movesWithGivenLetter(new ScrabbleLetter('a', 0))).toEqual(expectedWords);
//     });

//     // permutationOfLetters
//     it('permutationOfLetters should return permutations of the the array of letters in parameter', () => {
//         const letterA = new ScrabbleLetter('a', 0);
//         const letterB = new ScrabbleLetter('b', 0);
//         const letterC = new ScrabbleLetter('c', 0);
//         const letterZ = new ScrabbleLetter('z', POINTS);
//         const initialArray = [letterA, letterB, letterC, letterZ];
//         // Expected permutation : [A B Z C]
//         const expectedPermutation = [letterA, letterB, letterZ, letterC];
//         const resultPermutations = service.permutationsOfLetters(initialArray);
//         expect(resultPermutations).toContain(expectedPermutation);
//     });
// });
