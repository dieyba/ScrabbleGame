/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { DefaultCommandParams, PlaceParams } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchange-command';
import { PassTurnCmd } from '@app/classes/pass-command';
import { PlaceCmd } from '@app/classes/place-command';
import { Player } from '@app/classes/player';
import { BOARD_SIZE } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Axis, ERROR_NUMBER } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { Difficulty } from '@app/classes/virtual-player';
import { BonusService } from './bonus.service';
import { CommandInvokerService } from './command-invoker.service';
import { GameService } from './game.service';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

export enum Probability {
    EndTurn = 10, // TODO: put the right probability settings after testing
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
    MaxValue4 = Number.MAX_SAFE_INTEGER,
}

const DEFAULT_VIRTUAL_PLAYER_WAIT_TIME = 3000;
const NO_MOVE_TOTAL_WAIT_TIME = 20000;
const POINTS_INTERVAL = 5;
const PERCENTAGE = 100;
const POSITION_ERROR = -1;

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    rack: ScrabbleLetter[];
    orientation: Axis;
    player: Player;
    type: Difficulty;

    constructor(
        private bonusService: BonusService,
        private commandInvoker: CommandInvokerService,
        private gameService: GameService,
        private gridService: GridService,
        private placeService: PlaceService,
        private wordBuilderService: WordBuilderService,
        private validationService: ValidationService,
    ) {
        this.player = this.gameService.game.getOpponent();
        this.rack = this.player.letters;
    }

    playTurn(): void {
        let moveMade = new ScrabbleWord();
        const defaultParams: DefaultCommandParams = {
            player: this.player,
            serviceCalled: this.gameService,
        };
        let currentMove = this.getRandomIntInclusive(1, PERCENTAGE);
        if (this.type === Difficulty.Difficult) {
            // Always tries to make a move
            currentMove = PERCENTAGE;
        }
        if (currentMove <= Probability.EndTurn) {
            setTimeout(() => {
                // 10% chance to end turn on easy mode
                const command = new PassTurnCmd(defaultParams);
                this.commandInvoker.executeCommand(command);
            }, DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        } else if (currentMove <= Probability.EndTurn + Probability.ExchangeTile) {
            setTimeout(() => {
                // 10% chance to exchange tiles on easy mode
                const chosenTiles = this.chooseTilesFromRack();
                // Converts chosen word to string
                if (chosenTiles.length === 0) {
                    const emptyRackPass = new PassTurnCmd(defaultParams);
                    this.commandInvoker.executeCommand(emptyRackPass);
                    return;
                }
                const chosenTilesString = chosenTiles.map((tile) => tile.character).join(''); // TEST THIS, may not work.
                const command = new ExchangeCmd(defaultParams, chosenTilesString);
                this.commandInvoker.executeCommand(command);
            }, DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        } else if (currentMove <= Probability.EndTurn + Probability.ExchangeTile + Probability.MakeAMove) {
            // 80% chance to make a move on easy mode
            const value = this.selectRandomValue();
            setTimeout(() => {
                let possiblePermutations: ScrabbleLetter[][] = [];
                if (typeof Worker !== 'undefined') {
                    const currentBoard = this.gridService.scrabbleBoard;
                    // Create the worker for the current turn
                    const worker = new Worker(new URL('./src/app/services/virtual-player.worker.ts', import.meta.url).href);
                    // Send the rack and the board to our worker
                    worker.postMessage({ rack: this.rack, board: currentBoard });
                    // Receive the permutations from the worker
                    worker.onmessage = ({ data }) => {
                        possiblePermutations = data.permutations;
                    };
                } else {
                    // Web Workers not supported in this environment
                    // Implement fallback function if needed
                }
                if (possiblePermutations.length === 0) {
                    // No permutations found, because the board is empty. let's play the first move.
                    this.playFirstTurn(this.movesWithRack(value), value);
                }
                // waits 3 second to try and find a word to place
                moveMade = this.makeMoves(possiblePermutations, value);
                console.log('moveMade: ', moveMade);
                const movePosition = this.findPosition(moveMade, this.orientation);
                const params: PlaceParams = {
                    position: movePosition,
                    orientation: this.orientation,
                    word: moveMade.stringify(),
                };
                if (moveMade.value !== 0 && moveMade.content.length > 1 && this.placeService.canPlaceWord(params)) {
                    const command = new PlaceCmd(defaultParams, params);
                    this.commandInvoker.executeCommand(command);
                } else {
                    // if no word to place was found, pass turn after 20 seconds
                    setTimeout(() => {
                        const command = new PassTurnCmd(defaultParams);
                        this.commandInvoker.executeCommand(command);
                    }, NO_MOVE_TOTAL_WAIT_TIME - DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
                }
            }, DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        }
    }

    filterPermutations(permutations: ScrabbleWord[]): ScrabbleWord[] {
        const filteredPermutations: ScrabbleWord[] = [];
        for (const permutation of permutations) {
            const permutationString = permutation.stringify();
            if (this.isWordValid(permutationString)) {
                filteredPermutations.push(permutation);
            }
        }
        return filteredPermutations;
    }

    playFirstTurn(permutations: ScrabbleWord[], value: number): void {
        const wordFound = this.findFirstValidWord(permutations, value);
        const defaultParams: DefaultCommandParams = {
            player: this.player,
            serviceCalled: this.gameService,
        };
        if (!wordFound) {
            // Pass turn
            setTimeout(() => {
                const passTurn = new PassTurnCmd(defaultParams);
                this.commandInvoker.executeCommand(passTurn);
            }, NO_MOVE_TOTAL_WAIT_TIME - DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        }
        // Play the word
        // Find the best position for the move for the points if VP is expert
        // else just place it in the middle, it's good enough.
        const params: PlaceParams = {
            position: positionOfMove,
            orientation: this.orientation,
            word: wordFound.stringify(),
        };
        const command = new PlaceCmd(defaultParams, params);
        this.commandInvoker.executeCommand(command);
    }

    selectRandomValue(): number {
        // Expert mode
        if (this.type === Difficulty.Difficult) {
            return Points.MaxValue4;
        }
        // Easy mode
        const chosen = this.getRandomIntInclusive(1, PERCENTAGE);
        let value = 0;
        if (chosen <= Probability.MaxValue1){
            value = Points.MaxValue1;
        } else if (chosen <= Probability.MaxValue1 + Probability.MaxValue2) {
            value = Points.MaxValue2;
        } else if (chosen <= Probability.MaxValue1 + Probability.MaxValue2 + Probability.MaxValue3) {
            value = Points.MaxValue3;
        }
        return value;
    }

    findFirstValidWord(permutations: ScrabbleWord[], value: number): ScrabbleWord {
        const filteredPermutations = this.filterPermutations(permutations);
        let currentMaxValue = 0;
        let currentBestWord: ScrabbleWord = new ScrabbleWord();
        if (value === Points.MaxValue4) {
            for (const permutation of filteredPermutations) {
                if (permutation.value > currentMaxValue) {
                    currentMaxValue = permutation.value;
                    currentBestWord = permutation;
                }
            }
            return currentBestWord;
        }
        for (const permutation of filteredPermutations) {
            if (
                (permutation.value <= value && permutation.value >= value - POINTS_INTERVAL) ||
                (value === Points.MaxValue1 && permutation.value === 0)
            ) {
                return permutation;
            }
        }
        return new ScrabbleWord();
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
        for (let i = 1; i < this.getRandomIntInclusive(2, this.rack.length); i++) {
            // Randomize length of word
            let index = this.getRandomIntInclusive(0, this.rack.length - 1);
            while (lettersInArray[index] === true) {
                // If we've already generated this number before
                if (index !== lettersInArray.length - 1) {
                    index++;
                } else index = 0; // Code coverage on this line
            }
            lettersAvailable[i] = this.rack[index];
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
                if (char) charArray[index] = char.character;
                index++;
            }
            if (this.isWordValid(charArray.join(''))) {
                possibleMoves[movesFound] = this.wordify(j);
                movesFound++;
            }
        }
        return possibleMoves;
    }

    // I have to do this, sorry everyone. If it wasn't for the randomizing we wouldn't have to go this far. Current complexity: 17
    // eslint-disable-next-line complexity
    possibleMoves(points: number, axis: Axis): ScrabbleWord[] {
        const listLength = 4; // How many words we should aim for
        const list: ScrabbleWord[] = [];
        // Board analysis
        let movesFound = 0;
        let loopsDone = 0;
        let atLeastOneLetterFound = false;
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
                incrementJ = ERROR_NUMBER;
            }
            for (j; j !== iteratorMaxJ + incrementJ; j = j + incrementJ) {
                // Iterate through board in a random order
                if (k === 0) {
                    iteratorMaxK = this.gridService.scrabbleBoard.actualBoardSize;
                    incrementK = 1;
                } else {
                    iteratorMaxK = 0;
                    k = this.gridService.scrabbleBoard.actualBoardSize;
                    incrementK = ERROR_NUMBER;
                }
                for (k; k !== iteratorMaxK + incrementK; k = k + incrementK) {
                    if (this.gridService.scrabbleBoard.squares[j][k].occupied) {
                        atLeastOneLetterFound = true;
                        const newWords = this.movesWithGivenLetter(this.gridService.scrabbleBoard.squares[j][k].letter);
                        for (const newWord of newWords) {
                            if (!list.includes(newWord)) {
                                list.push(newWord);
                            }
                        }
                    }
                    for (let l = 0; l < list.length; l++) {
                        // Remove elements of the list which aren't valid with the points constraint
                        const pos = this.findPosition(list[l], axis);
                        const placeParams: PlaceParams = {
                            word: list[l].stringify(),
                            position: pos,
                            orientation: axis,
                        };
                        list[l].orientation = axis;
                        list[l].startPosition = pos;
                        list[l].value = list[l].calculateValue();
                        if (this.placeService.canPlaceWord(placeParams)) {
                            if (this.bonusService.totalValue(list[l]) > points || this.bonusService.totalValue(list[l]) < points - POINTS_INTERVAL) {
                                list.splice(l);
                            } else {
                                const currentWord = list[l].stringify();
                                const position = this.findPosition(list[l], axis);
                                const otherWords: ScrabbleWord[] = this.wordBuilderService.buildWordsOnBoard(currentWord, position, axis);
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
        if (atLeastOneLetterFound) {
            return list; // list contains movesFound elements
        } else {
            // It is the first turn of the game
            const wordsFirstTurn = this.movesWithRack(points);
            return wordsFirstTurn;
        }
    }

    movesWithRack(points: number): ScrabbleWord[] {
        const possibleMoves: ScrabbleWord[] = [];
        for (const letter of this.rack) {
            const newWords = this.movesWithGivenLetter(letter);
            for (const newWord of newWords) {
                if (!possibleMoves.includes(newWord)) {
                    if (newWord.value < points || newWord.value > 0) {
                        possibleMoves.push(newWord);
                    }
                }
            }
        }
        return possibleMoves;
    }

    makeMoves(permutations: ScrabbleLetter[][], value: number): ScrabbleWord {
        this.orientation = Axis.H;
        if (this.getRandomIntInclusive(0, 1) === 1) {
            // coin flip to determine starting axis
            this.orientation = Axis.V;
        }
        const pointTarget = this.getRandomIntInclusive(1, PERCENTAGE);
        let movesList = [];
        if (pointTarget <= Probability.MaxValue1) {
            // 40% chance to go for moves that earn 6 points or less
            movesList = this.possibleMoves(Points.MaxValue1, this.orientation);
        } else if (pointTarget <= Probability.MaxValue1 + Probability.MaxValue2) {
            // 30% chance to go for moves that score 7-12 points
            movesList = this.possibleMoves(Points.MaxValue2, this.orientation);
        } else {
            // 30% chance to go for moves that score 13-18 points
            movesList = this.possibleMoves(Points.MaxValue3, this.orientation);
        }
        const moveToMake = movesList[this.getRandomIntInclusive(0, movesList.length - 1)];
        if (moveToMake) {
            moveToMake.value = moveToMake.calculateValue();
            return moveToMake;
        }
        return new ScrabbleWord(); // randomize move to make
    }

    displayMoves(moves: ScrabbleWord[]): string {
        // Displays a message based on an array of moves.
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

    getRandomIntInclusive(min: number, max: number): number {
        // found on developer.mozilla.org under Math.random()
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
            // It is the first turn, so we place it in the center.
            const middleIndex = 7;
            const middleVec = new Vec2(middleIndex, middleIndex);
            return middleVec;
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
        if (this.rack.length === 0) return [];
        const numberOfTiles = this.getRandomIntInclusive(1, this.rack.length);
        let tileReplaced = 0;
        const listOfTiles = [];
        for (let i = 0; i < numberOfTiles; i++) {
            listOfTiles[i] = new ScrabbleLetter('', 0);
        }
        let currentLetter = 0;
        while (tileReplaced < numberOfTiles) {
            const replaced = this.getRandomIntInclusive(0, 1);
            if (replaced === 1 && !listOfTiles.includes(this.rack[currentLetter])) {
                listOfTiles[tileReplaced] = this.rack[currentLetter];
                tileReplaced++;
            }
            currentLetter++;
            if (currentLetter === this.rack.length) currentLetter = 0;
        }
        return listOfTiles;
    }

    isWordValid(word: string): boolean {
        return this.validationService.isWordValid(word);
    }
}
