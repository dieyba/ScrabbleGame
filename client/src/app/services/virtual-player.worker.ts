// /// <reference lib="webworker" />

// import { ScrabbleBoard } from '@app/classes/scrabble-board';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter';
// import { ScrabbleRack } from '@app/classes/scrabble-rack';

// let vpRack: ScrabbleRack;
// let board: ScrabbleBoard;

// // The virtual player worker will be used to generate all permutations of letters that can be placed
// // They will then be sent to the main thread to be evaluated, and the thread will return the best move (expert)
// // Or a move in the point interval (easy)

// // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// function permutationsWithBoard(): ScrabbleLetter[][] {
//     const allLetters = vpRack.letters;
//     const permutations: ScrabbleLetter[][] = [];
//     for (const row of board.squares) {
//         for (const square of row) {
//             if (square.letter.tile.occupied) {
//                 allLetters.push(square.letter);
//                 const permutationsOfAllLetters = permutationsOfLetters(allLetters);
//                 for (const permutation of permutationsOfAllLetters) {
//                     permutations.push(permutation);
//                 }
//                 allLetters.pop();
//             }
//         }
//     }
//     return permutations;
//     // We will then try to place the word on each space on the board
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
//     vpRack = data.rack as ScrabbleRack;
//     // Respond with a simple object with 'permutations' representing all possible moves for the virtual player
//     // (excluding the ones that are not valid on the board or on the rack)
//     const response = { permutations: permutationsWithBoard() };
//     board = data.board as ScrabbleBoard;
//     console.log('data: ' + data);
//     postMessage('response: ' + response);
// });
