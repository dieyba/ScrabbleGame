/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { DefaultCommandParams, PlaceParams } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchange-command';
import { PassTurnCmd } from '@app/classes/pass-command';
import { PlaceCmd } from '@app/classes/place-command';
import { Player } from '@app/classes/player';
import { BOARD_SIZE } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleMove } from '@app/classes/scrabble-move';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { Difficulty } from '@app/classes/virtual-player';
import { BonusService } from './bonus.service';
import { CommandInvokerService } from './command-invoker.service';
import { GameService } from './game.service';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { ValidationService } from './validation.service';

export enum Probability {
    EndTurn = 0, // TODO: put the right probability settings after testing
    ExchangeTile = 100,
    MakeAMove = 0,
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
        private validationService: ValidationService,
    ) {
        this.player = this.gameService.game.getOpponent();
        this.rack = this.player.letters;
    }

    playTurn(): void {
        let moveMade = new ScrabbleMove();
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
                // TODO: push the real debug messages
                command.debugMessages.push('a debug message');
                this.commandInvoker.executeCommand(command);
            }, DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        } else if (currentMove <= Probability.EndTurn + Probability.ExchangeTile + Probability.MakeAMove) {
            // 80% chance to make a move on easy mode
            const value = this.selectRandomValue();
            setTimeout(() => {
                const possiblePermutations = this.permutationsWithBoard();
                if (possiblePermutations.length === 0) {
                    // No permutations found, because the board is empty. let's play the first move.
                    this.playFirstTurn(this.movesWithRack(value), value);
                    return;
                }
                // waits 3 second to try and find a word to place
                moveMade = this.makeMoves(possiblePermutations, value);
                console.log('moveMade: ', moveMade);
                const params: PlaceParams = {
                    position: moveMade.position,
                    orientation: this.orientation,
                    word: moveMade.word.stringify(),
                };
                if (moveMade.word.content.length > 1 && this.placeService.canPlaceWord(params)) {
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
                console.log('one valid perm: ', permutationString);
            }
        }
        return filteredPermutations;
    }

    playFirstTurn(permutations: ScrabbleWord[], value: number): void {
        const defaultParams: DefaultCommandParams = {
            player: this.player,
            serviceCalled: this.gameService,
        };
        const moveFound = this.findFirstValidWords(permutations, value, true);
        console.log('moveFound: ', moveFound);
        if (moveFound.position.x === POSITION_ERROR || moveFound.position.y === POSITION_ERROR || moveFound.word.content.length === 0) {
            // Pass turn
            console.log('bonjour');
            setTimeout(() => {
                const passTurn = new PassTurnCmd(defaultParams);
                this.commandInvoker.executeCommand(passTurn);
            }, NO_MOVE_TOTAL_WAIT_TIME - DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
            return;
        }
        // Play the word
        // Find the best position for the move for the points if VP is expert
        const params: PlaceParams = {
            position: moveFound.position,
            orientation: this.orientation,
            word: moveFound.word.stringify(),
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
        if (chosen <= Probability.MaxValue1) {
            value = Points.MaxValue1;
        } else if (chosen <= Probability.MaxValue1 + Probability.MaxValue2) {
            value = Points.MaxValue2;
        } else if (chosen <= Probability.MaxValue1 + Probability.MaxValue2 + Probability.MaxValue3) {
            value = Points.MaxValue3;
        }
        return value;
    }

    // TODO: Modify this class to store three words instead of only one.
    findFirstValidWords(permutations: ScrabbleWord[], value: number, isFirstTurn: boolean): ScrabbleMove {
        const filteredPermutations = this.filterPermutations(permutations);
        let currentMaxValue = 0;
        let currentBestWord: ScrabbleWord = new ScrabbleWord();
        let position = new Vec2(POSITION_ERROR, POSITION_ERROR);
        if (value === Points.MaxValue4) {
            for (const permutation of filteredPermutations) {
                position = this.findPositionForWord(permutation, value, isFirstTurn, currentMaxValue);
                if (position.x !== POSITION_ERROR && position.y !== POSITION_ERROR) {
                    const valueOfWord = this.valueOnPosition(permutation, position, this.orientation);
                    if (valueOfWord > currentMaxValue) {
                        currentMaxValue = permutation.value;
                        currentBestWord = permutation;
                    }
                }
            }
            return new ScrabbleMove(currentBestWord, position);
        }
        for (const permutation of filteredPermutations) {
            position = this.findPositionForWord(permutation, value, isFirstTurn);
            if (position.x !== POSITION_ERROR || position.y !== POSITION_ERROR) {
                const valueOfWord = this.valueOnPosition(permutation, position, this.orientation);
                if ((valueOfWord <= value && value >= value - POINTS_INTERVAL) || (value === Points.MaxValue1 && permutation.value === 0)) {
                    return new ScrabbleMove(permutation, position);
                }
            }
        }
        return new ScrabbleMove();
    }

    findPositionForWord(word: ScrabbleWord, value: Points, isFirstTurn: boolean, currentMaxValue?: Points): Vec2 {
        const maxValue = currentMaxValue || 0;
        let returnPosition = new Vec2(POSITION_ERROR, POSITION_ERROR);
        if (value === Points.MaxValue4) {
            for (const axis in Axis) {
                // Try with both axises for each permutation.
                if (axis) {
                    const myAxis = Axis[axis as keyof typeof Axis];
                    this.orientation = myAxis;
                    const thisPosition = this.findPosition(word, myAxis, isFirstTurn);
                    const wordValue = this.valueOnPosition(word, thisPosition, myAxis);
                    const params: PlaceParams = {
                        position: thisPosition,
                        orientation: this.orientation,
                        word: word.stringify(),
                    };
                    if (!this.placeService.canPlaceWord(params)) {
                        continue;
                    }
                    if (wordValue > maxValue) {
                        returnPosition = thisPosition;
                        return returnPosition;
                    }
                }
            }
            return returnPosition;
        }
        for (const axis in Axis) {
            // Try with both axises for each permutation.
            if (axis) {
                const myAxis = Axis[axis as keyof typeof Axis];
                this.orientation = myAxis;
                const thisPosition = this.findPosition(word, myAxis, isFirstTurn);
                const wordValue = this.valueOnPosition(word, thisPosition, myAxis);
                const params: PlaceParams = {
                    position: thisPosition,
                    orientation: this.orientation,
                    word: word.stringify(),
                };
                if (!this.placeService.canPlaceWord(params)) {
                    continue;
                }
                if ((wordValue <= value && wordValue >= value - POINTS_INTERVAL) || (wordValue === Points.MaxValue1 && wordValue === 0)) {
                    returnPosition = thisPosition;
                    return returnPosition;
                }
            }
        }
        return returnPosition;
    }

    valueOnPosition(word: ScrabbleWord, position: Vec2, axis: Axis): number {
        let totalValue = 0;
        let i = 0;
        let doubleScore = false;
        let tripleScore = false;
        for (const letter of word.content) {
            let squareColor;
            switch (axis) {
                case Axis.H:
                    if (this.gridService.scrabbleBoard.squares[position.x + i] === undefined) return 0;
                    squareColor = this.gridService.scrabbleBoard.squares[position.x + i][position.y].color;
                    break;
                case Axis.V:
                    if (
                        this.gridService.scrabbleBoard.squares[position.x] === undefined ||
                        this.gridService.scrabbleBoard.squares[position.x][position.y + i] === undefined
                    )
                        return 0;
                    squareColor = this.gridService.scrabbleBoard.squares[position.x][position.y + i].color;
                    break;
            }
            switch (squareColor) {
                case SquareColor.Pink:
                    doubleScore = true;
                    break;
                case SquareColor.Red:
                    tripleScore = true;
                    break;
                case SquareColor.Teal:
                    totalValue += letter.value * 2;
                    break;
                case SquareColor.DarkBlue:
                    totalValue += letter.value * 3;
                    break;
                default:
                    // SquareColor.None
                    totalValue += letter.value;
            }
            i++;
        }
        if (tripleScore) {
            totalValue *= 3;
        } else if (doubleScore) {
            totalValue *= 2;
        }
        return totalValue;
    }

    findPosition(word: ScrabbleWord, axis: Axis, isFirstTurn?: boolean): Vec2 {
        let returnPos = new Vec2(POSITION_ERROR, POSITION_ERROR);
        if (isFirstTurn) {
            let maxValue = 0;
            let letterIndex = 0;
            let maxLetterIndex = 0;
            for (const letter of word.content) {
                if (letter.value > maxValue) {
                    maxValue = letter.value;
                    maxLetterIndex = letterIndex;
                }
                letterIndex++;
            }
            returnPos = new Vec2((BOARD_SIZE - 1) / 2, (BOARD_SIZE - 1) / 2);
            switch (axis) {
                case Axis.H:
                    returnPos.x -= maxLetterIndex;
                    break;
                case Axis.V:
                    returnPos.y -= maxLetterIndex;
                    break;
            }
            return returnPos;
        }
        for (let letter = 0; letter < word.content.length; letter++) {
            for (let i = 0; i < this.gridService.scrabbleBoard.squares.length; i++) {
                for (let j = 0; j < this.gridService.scrabbleBoard.squares[i].length; j++) {
                    if (this.gridService.scrabbleBoard.squares[i][j].letter === word.content[letter]) {
                        const letterPos = new Vec2(i, j);
                        switch (axis) {
                            case Axis.H:
                                returnPos = letterPos;
                                returnPos.x -= letter;
                                break;
                            case Axis.V:
                                returnPos = letterPos;
                                returnPos.y -= letter;
                                break;
                        }
                    }
                }
            }
        }
        return returnPos;
    }

    // Returns all valid combinations of the letter + the letters currently in the rack
    movesWithGivenLetter(letter: ScrabbleLetter, fromRack?: boolean): ScrabbleWord[] {
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
            if (lettersAvailable[i] === letter && fromRack) {
                // Remove the letter from the pool since it is already used
                lettersInArray[index] = true;
                continue;
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

    movesWithRack(points: number): ScrabbleWord[] {
        const possibleMoves: ScrabbleWord[] = [];
        for (const letter of this.rack) {
            const newWords = this.movesWithGivenLetter(letter, true);
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

    makeMoves(permutations: ScrabbleLetter[][], value: number): ScrabbleMove {
        // TODO: Modify this to show alternate placements
        let currentMaxValue;
        let currentBestWord;
        let movePosition = new Vec2(POSITION_ERROR, POSITION_ERROR);
        const permutationsToWords: ScrabbleWord[] = [];
        for (const permutation of permutations) {
            const word = this.wordify(permutation);
            permutationsToWords.push(word);
        }
        const filteredPermutations = this.filterPermutations(permutationsToWords);
        console.log('hello from MakeMoves');
        if (value === Points.MaxValue4) {
            // Expert algorithm
            currentMaxValue = 0;
            currentBestWord = new ScrabbleWord();
            for (const word of filteredPermutations) {
                for (const axis in Axis) {
                    // Try with both axises for each permutation.
                    if (axis) {
                        const myAxis = Axis[axis as keyof typeof Axis];
                        this.orientation = myAxis;
                        const position = this.findPosition(word, myAxis);
                        const wordValue = this.valueOnPosition(word, position, myAxis);
                        if (wordValue > currentMaxValue) {
                            currentMaxValue = wordValue;
                            currentBestWord = word;
                            movePosition = position;
                        }
                    }
                }
            }
            return new ScrabbleMove(currentBestWord, movePosition);
        }
        // Easy algorithm
        for (const word of filteredPermutations) {
            for (const axis in Axis) {
                // Try with both axises for each permutation.
                if (axis) {
                    const myAxis = Axis[axis as keyof typeof Axis];
                    this.orientation = myAxis;
                    const position = this.findPosition(word, myAxis);
                    const wordValue = this.valueOnPosition(word, position, myAxis);
                    if ((wordValue > value - POINTS_INTERVAL && wordValue <= value) || (wordValue === Points.MaxValue1 && wordValue === 0)) {
                        return new ScrabbleMove(word, position);
                    }
                }
            }
        }
        return new ScrabbleMove();
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

    permutationsWithBoard(): ScrabbleLetter[][] {
        const allLetters = this.rack;
        const permutations: ScrabbleLetter[][] = [];
        for (const row of this.gameService.game.scrabbleBoard.squares) {
            for (const square of row) {
                if (square.letter) {
                    if (square.letter.tile.occupied) {
                        allLetters.push(square.letter);
                        const permutationsOfAllLetters = this.permutationsOfLetters(allLetters);
                        for (const permutation of permutationsOfAllLetters) {
                            permutations.push(permutation);
                        }
                        allLetters.pop();
                    }
                }
            }
        }
        return permutations;
        // We will then try to place the word on each space on the board
    }
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
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
}
