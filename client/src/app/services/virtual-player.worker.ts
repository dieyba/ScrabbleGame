/// <reference lib="webworker" />

// import { Dictionary, DictionaryType } from '@app/classes/dictionary';
// import { ScrabbleBoard } from '@app/classes/scrabble-board';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter';
// import { ScrabbleRack } from '@app/classes/scrabble-rack';
// import { ScrabbleWord } from '@app/classes/scrabble-word';
// import { Difficulty } from '@app/classes/virtual-player';

// let vpRack: ScrabbleRack;
// let vpType: Difficulty;
// let board: ScrabbleBoard;
// // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// function getRandomIntInclusive(min: number, max: number): number {
//     // found on developer.mozilla.org under Math.random()
//     min = Math.ceil(min);
//     max = Math.ceil(max);
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }
// // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// function possibleMoves(points: number): ScrabbleWord[] {
//     let moveOnSquare = [new ScrabbleWord()]
//     for (const row of board.squares) {
//         for (const square of row) {
//             if (square.occupied === true) {
//                 moveOnSquare = movesWithGivenLetter(square.letter);
//             }
//         }
//     }
//     return moveOnSquare;
// }

// // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// function movesWithGivenLetter(letter: ScrabbleLetter): ScrabbleWord[] {
//     const lettersAvailable: ScrabbleLetter[] = [];
//     lettersAvailable[0] = letter;
//     const lettersInArray: boolean[] = [false, false, false, false, false, false, false];
//     for (let i = 1; i < getRandomIntInclusive(2, vpRack.letters.length); i++) {
//         // Randomize length of word
//         let index = getRandomIntInclusive(0, vpRack.letters.length - 1);
//         while (lettersInArray[index] === true) {
//             // If we've already generated this number before
//             if (index !== lettersInArray.length - 1) {
//                 index++;
//             } else index = 0; // Code coverage on this line
//         }
//         lettersAvailable[i] = vpRack.letters[index];
//         lettersInArray[index] = true;
//     }
//     // check all possible permutations. Maximum of O(8!)
//     const permutations = permutationsOfLetters(lettersAvailable);
//     const movesList = [];
//     let movesFound = 0;
//     const charArray = [];
//     for (const j of permutations) {
//         let index = 0;
//         for (const char of j) {
//             if (char) charArray[index] = char.character;
//             index++;
//         }
//         if (isWordValid(charArray.join(''))) {
//             movesList[movesFound] = wordify(j);
//             movesFound++;
//         }
//     }
//     return movesList;
// }

// // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// function isWordValid(word: string): boolean {
//     // TODO: see where to access dictionary downloaded
//     const dictionary: Dictionary = new Dictionary(DictionaryType.Default);
//     return dictionary.words.includes(word) && word.length >= 2 && !word.includes('-') && !word.includes("'") ? true : false;
// }

// // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// function wordify(letters: ScrabbleLetter[]): ScrabbleWord {
//     const word = new ScrabbleWord();
//     for (let i = 0; i < letters.length; i++) {
//         word.content[i] = letters[i];
//     }
//     return word;
// }

// // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// function permutationsOfLetters(letters: ScrabbleLetter[]): ScrabbleLetter[][] {
//     // Adapted from medium.com/weekly-webtips/step-by-step-guide-to-array-permutation-using-recursion-in-javascript-4e76188b88ff
//     const result = [];
//     if (letters.length === 1) {
//         result[0] = letters;
//         return result;
//     }
//     for (let i = 0; i < letters.length; i++) {
//         const currentLetter = letters[i];
//         const remainingLetters = letters.slice(0, i).concat(letters.slice(i + 1));
//         const remainingLettersPermuted = permutationsOfLetters(remainingLetters);
//         for (const j of remainingLettersPermuted) {
//             const permutedArray = [currentLetter].concat(j);
//             result.push(permutedArray);
//         }
//     }
//     return result;
// }

// addEventListener('message', ({ data }) => {
//     const response = `worker response to ${data}`;
//     vpRack = data.rack as ScrabbleRack;
//     permutationsOfLetters(vpRack.letters);
//     vpType = data.type as Difficulty;
//     board = data.board as ScrabbleBoard;
//     possibleMoves(6);
//     console.log(response);
// });
