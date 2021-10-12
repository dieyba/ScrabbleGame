import { Injectable } from '@angular/core';
import { Axis, ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleRack } from '@app/classes/scrabble-rack';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Vec2 } from '@app/classes/vec2';
import { BonusService } from './bonus.service';
import { GridService } from './grid.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

export enum Probability {
    EndTurn = 10,
    ExchangeTile = 10,
    MakeAMove = 80,
    MaxValue1 = 40,
    MaxValue2 = 30,
    MaxValue3 = 30,
}
export enum Points {
    MaxValue1 = 6,
    MaxValue2 = 12,
    MaxValue3 = 18,
}
const POINTS_INTERVAL = 5;
const PERCENTAGE = 100;
const POSITION_ERROR = -1;

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    rack: ScrabbleRack;

    constructor(
        private validationService: ValidationService,
        private gridService: GridService,
        private wordBuilderService: WordBuilderService,
        private bonusService: BonusService,
    ) {
        // TODO Implement timer (3s and 20s limit)
        this.rack = new ScrabbleRack();
        // const currentMove = this.getRandomIntInclusive(1, PERCENTAGE);
        // if (currentMove <= Probability.EndTurn) {
        //     // 10% chance to end turn
        // } else if (currentMove <= Probability.EndTurn + Probability.ExchangeTile) {
        //     this.chooseTilesFromRack(); // 10% chance to exchange tiles
        // } else if (currentMove <= Probability.EndTurn + Probability.ExchangeTile + Probability.MakeAMove) {
        //     // =100
        //     this.makeMoves(); // 80% chance to make a move
        // }
    }
    permutationsOfLetters(letters: ScrabbleLetter[]): ScrabbleLetter[][] {
        // Adapted from medium.com/weekly-webtips/step-by-step-guide-to-array-permutation-using-recursion-in-javascript-4e76188b88ff
        const result = [];
        if (letters.length === 1) {
            result[0] = letters;
            return result;
        }
        for (let i = 0; i < letters.length; i++) {
            const currentLetter = letters[i];
            const remainingLetters = letters.slice(0, i).concat(letters.slice(i + 1));
            const remainingLettersPermuted = this.permutationsOfLetters(remainingLetters);
            for (const j of remainingLettersPermuted) {
                const permutedArray = [currentLetter].concat(j);
                result.push(permutedArray);
            }
        }
        return result;
    }
    // Returns all valid combinations of the letter + the letters currently in the rack
    movesWithGivenLetter(letter: ScrabbleLetter): ScrabbleWord[] {
        const lettersAvailable: ScrabbleLetter[] = [];
        lettersAvailable[0] = letter;
        const lettersInArray: boolean[] = [false, false, false, false, false, false, false];
        for (let i = 1; i < this.getRandomIntInclusive(2, this.rack.letters.length); i++) {
            // Randomize length of word
            let index = this.getRandomIntInclusive(0, this.rack.letters.length - 1);
            while (lettersInArray[index] === true) {
                // If we've already generated this number before
                if (index !== lettersInArray.length - 1) {
                    index++;
                } else index = 0; // Code coverage on this line
            }
            lettersAvailable[i] = this.rack.letters[index];
            lettersInArray[index] = true;
        }
        // check all possible permutations. Maximum of O(8!)
        const permutations = this.permutationsOfLetters(lettersAvailable);
        const possibleMoves = [];
        let movesFound = 0;
        const charArray = [];
        for (const j of permutations) {
            let index = 0;
            for (const char of j) {
                charArray[index] = char.character;
                index++;
            }
            if (this.validationService.isWordValid(charArray.join(''))) {
                possibleMoves[movesFound] = this.wordify(j);
                movesFound++;
            }
        }
        return possibleMoves;
    }
    // I have to do this, sorry everyone. If it wasn't for the randomizing we wouldn't have to go this far. Current complexity: 16
    // eslint-disable-next-line complexity
    possibleMoves(points: number, axis: Axis): ScrabbleWord[] {
        const listLength = 4; // How many words we should aim for
        const list: ScrabbleWord[] = [];
        // Board analysis
        let movesFound = 0;
        let loopsDone = 0;
        while (movesFound < listLength && loopsDone < listLength) {
            // Arbitrarily do a maximum of [loopsDone] checks for words. We don't want an infinite loop.
            let j = this.getRandomIntInclusive(0, 1);
            let k = this.getRandomIntInclusive(0, 1);
            let incrementJ;
            let incrementK;
            let iteratorMaxJ;
            let iteratorMaxK;
            if (j === 0) {
                iteratorMaxJ = this.gridService.scrabbleBoard.actualBoardSize;
                incrementJ = 1;
            } else {
                iteratorMaxJ = 0;
                j = this.gridService.scrabbleBoard.actualBoardSize;
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                incrementJ = -1;
            }
            for (j; j !== iteratorMaxJ + incrementJ; j = j + incrementJ) {
                // Iterate through board in a random order
                if (k === 0) {
                    iteratorMaxK = this.gridService.scrabbleBoard.actualBoardSize;
                    incrementK = 1;
                } else {
                    iteratorMaxK = 0;
                    k = this.gridService.scrabbleBoard.actualBoardSize;
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    incrementK = -1;
                }
                for (k; k !== iteratorMaxK + incrementK; k = k + incrementK) {
                    if (this.gridService.scrabbleBoard.squares[j][k].occupied) {
                        const newWords = this.movesWithGivenLetter(this.gridService.scrabbleBoard.squares[j][k].letter);
                        for (const newWord of newWords) {
                            if (!list.includes(newWord)) {
                                list.push(newWord);
                            }
                        }
                    }
                    for (let l = 0; l < list.length; l++) {
                        // Remove elements of the list which aren't valid with the points constraint
                        if (this.validationService.isPlacable(list[l], this.findPosition(list[l], axis), axis)) {
                            if (this.bonusService.totalValue(list[l]) > points || this.bonusService.totalValue(list[l]) < points - POINTS_INTERVAL) {
                                list.splice(l);
                            } else {
                                const currentWord = list[l].stringify();
                                const position = this.findPosition(list[l], axis);
                                const otherWords: ScrabbleWord[] = this.wordBuilderService.allWordsCreated(currentWord, position, axis);
                                let sum = 0;
                                for (const word of otherWords) {
                                    sum += word.value;
                                }
                                if (sum > points) list.splice(l);
                            }
                            movesFound = list.length;
                        }
                    }
                }
            }

            loopsDone++;
        }
        return list; // list contains movesFound elements
    }
    makeMoves(): ScrabbleWord {
        let startAxis = Axis.V;
        if (this.getRandomIntInclusive(0, 1) === 1) {
            // coin flip to determine starting axis
            startAxis = Axis.H;
        }
        const pointTarget = this.getRandomIntInclusive(1, PERCENTAGE);
        let movesList = [];
        if (pointTarget <= Probability.MaxValue1) {
            // 40% chance to go for moves that earn 6 points or less
            movesList = this.possibleMoves(Points.MaxValue1, startAxis);
        } else if (pointTarget <= Probability.MaxValue1 + Probability.MaxValue2) {
            // 30% chance to go for moves that score 7-12 points
            movesList = this.possibleMoves(Points.MaxValue2, startAxis);
        } else {
            // 30% chance to go for moves that score 13-18 points
            movesList = this.possibleMoves(Points.MaxValue3, startAxis);
        }
        return movesList[this.getRandomIntInclusive(0, movesList.length - 1)]; // randomize move to make
    }
    // Displays a message based on an array of moves.
    displayMoves(moves: ScrabbleWord[]): string {
        let message = '';
        if (moves.length === 0) {
            message = "Il n'y a aucun placement valide pour la plage de points et la longueur de mot sélectionnées par le joueur virtuel.";
        } else if (moves.length === 1) {
            message = 'Le placement joué est le seul valide pour la plage de points et la longueur sélectionnée par le joueur virtuel.';
        } else
            for (const i of moves) {
                for (let j = 0; j < i.content.length; j++) {
                    const letter = i.content[j];
                    message += letter.tile.position.x + letter.tile.position.y; // displays position
                    if (letter.character === '*') {
                        // Show real letter
                    } else message += letter.character; // displays character
                    if (j === i.content.length - 1) {
                        message += ' '; // If it's the last letter
                    } else message += '  '; // If it's not
                }
                message += this.bonusService.totalValue(i) + '\n'; // Add score for each move
            }
        return message;
    }
    displayMoveChat(move: ScrabbleWord, position: Vec2, axis: Axis): string {
        if (move.content.length > 0 && position.x !== POSITION_ERROR && position.y !== POSITION_ERROR) {
            const message = '!placer ' + position.y /* convert this to letters*/ + position.x + axis + ' ' + move.stringify();
            return message;
        } else return 'Erreur de placement';
    }
    wordify(letters: ScrabbleLetter[]): ScrabbleWord {
        const word = new ScrabbleWord();
        for (let i = 0; i < letters.length; i++) {
            word.content[i] = letters[i];
        }
        return word;
    }
    // found on developer.mozilla.org under Math.random()
    getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.ceil(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    findPosition(word: ScrabbleWord, axis: Axis): Vec2 {
        let origin = new ScrabbleLetter('', 0); // Convert position
        let index;
        for (index = 0; index < word.content.length; index++) {
            if (word.content[index].tile.occupied) {
                origin = word.content[index];
                break;
            }
        }
        if (index === word.content.length) {
            // ERROR
            const errorVec = new Vec2();
            errorVec.x = -1;
            errorVec.y = -1;
            return errorVec;
        }
        const position = new Vec2();
        if (axis === Axis.V) {
            position.y = origin.tile.position.y - index;
            position.x = origin.tile.position.x;
        } else {
            position.y = origin.tile.position.y;
            position.x = origin.tile.position.x - index;
        }
        return position;
    }
    chooseTilesFromRack(): ScrabbleLetter[] {
        const numberOfTiles = this.getRandomIntInclusive(1, this.rack.letters.length);
        let tileReplaced = 0;
        const listOfTiles = [];
        for (let i = 0; i < numberOfTiles; i++) {
            listOfTiles[i] = new ScrabbleLetter('', 0);
        }
        let currentLetter = 0;
        while (tileReplaced < numberOfTiles) {
            const replaced = this.getRandomIntInclusive(0, 1);
            if (replaced === 1 && !listOfTiles.includes(this.rack.letters[currentLetter])) {
                listOfTiles[tileReplaced] = this.rack.letters[currentLetter];
                tileReplaced++;
            }
            currentLetter++;
            if (currentLetter === this.rack.letters.length) currentLetter = 0;
        }
        return listOfTiles;
    }
}
