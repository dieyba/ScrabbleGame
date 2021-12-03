/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { DefaultCommandParams, PlaceParams } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchange-command';
import { PassTurnCmd } from '@app/classes/pass-command';
import { PlaceCmd } from '@app/classes/place-command';
import { BOARD_SIZE } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleMove } from '@app/classes/scrabble-move';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';
import { Axis, convertYAxisToLetterCoordinates, isCoordInsideBoard } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
import { BonusService } from './bonus.service';
import { CommandInvokerService } from './command-invoker.service';
import { GameService } from './game.service';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

export enum Probability { //    Probabilities for the easy virtual player
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
    MaxValue4 = Number.MAX_SAFE_INTEGER,
}

const DEFAULT_VIRTUAL_PLAYER_WAIT_TIME = 3000;
const NO_MOVE_TOTAL_WAIT_TIME = 20000;
const POINTS_INTERVAL = 5;
const PERCENTAGE = 100;
const POSITION_ERROR = -1;
const MAX_ARRAY_SIZE = 4;

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    rack: ScrabbleLetter[];
    orientation: Axis;
    player: VirtualPlayer;
    type: Difficulty;

    constructor(
        private bonusService: BonusService,
        private commandInvoker: CommandInvokerService,
        private gameService: GameService,
        private gridService: GridService,
        private placeService: PlaceService,
        private validationService: ValidationService,
        private wordBuilderService: WordBuilderService,
    ) {
        this.player = this.gameService.game.getOpponent() as VirtualPlayer;
        this.rack = this.player.letters;
        this.type = this.player.type;
    }

    playTurn(): void {
        let movesMade: ScrabbleMove[] = [];
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
                const chosenTiles = this.chooseTilesFromRack(this.selectRandomValue());
                // Converts chosen word to string
                if (chosenTiles.length === 0) {
                    const emptyRackPass = new PassTurnCmd(defaultParams);
                    this.commandInvoker.executeCommand(emptyRackPass);
                    return;
                }
                const chosenTilesString = chosenTiles.map((tile) => tile.character).join('');
                const command = new ExchangeCmd(defaultParams, chosenTilesString);
                command.debugMessages.push('Lettres échangées: ' + chosenTilesString);
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
                movesMade = this.makeMoves(possiblePermutations, value);
                if (movesMade.length !== 0) {
                    const params: PlaceParams = {
                        position: movesMade[0].position,
                        orientation: movesMade[0].axis,
                        word: movesMade[0].word.stringify(),
                    };
                    const command = new PlaceCmd(defaultParams, params);
                    command.debugMessages.push(this.debugMessageGenerator(movesMade));
                    this.commandInvoker.executeCommand(command);
                } else {
                    const chosenTiles = this.chooseTilesFromRack(this.selectRandomValue());
                    // Converts chosen word to string
                    if (chosenTiles.length === 0) {
                        const emptyRackPass = new PassTurnCmd(defaultParams);
                        this.commandInvoker.executeCommand(emptyRackPass);
                        emptyRackPass.debugMessages.push('No move was found. Calling Pass Command');
                        return;
                    }
                    const chosenTilesString = chosenTiles.map((tile) => tile.character).join('');
                    const command = new ExchangeCmd(defaultParams, chosenTilesString);
                    this.commandInvoker.executeCommand(command);
                }
            }, DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        }
    }

    debugMessageGenerator(moves: ScrabbleMove[]): string {
        let message = '';
        for (let i = 0; i < moves[0].word.content.length; i++) {
            if (moves[0].word.content[i].tile.position.x === POSITION_ERROR || moves[0].word.content[i].tile.position.y === POSITION_ERROR) {
                if (moves[0].axis === Axis.H) {
                    const nextPos = moves[0].position.x + i;
                    message +=
                        convertYAxisToLetterCoordinates(moves[0].position.y).toUpperCase() +
                        nextPos +
                        ':' +
                        moves[0].word.content[i].character.toUpperCase() +
                        '  ';
                } else {
                    const nextPos = moves[0].position.y + i;
                    message +=
                        convertYAxisToLetterCoordinates(nextPos).toUpperCase() +
                        moves[0].position.x +
                        ':' +
                        moves[0].word.content[i].character.toUpperCase() +
                        '  ';
                }
            }
        }
        const sliceNumber = -1;
        message.slice(0, sliceNumber);
        // Only one space, as asked in the documentation
        message += '(' + moves[0].value + ')' + '\n';

        for (let i = 1; i < moves.length; i++) {
            for (const letter of moves[i].word.content) {
                message += letter.character.toUpperCase();
            }
            message += ' (' + moves[i].value + ')' + '\n';
        }
        const bingoRack = [];
        for (const letter in this.rack) {
            if (letter) {
                bingoRack.push(this.rack[letter].character);
                for (const moveLetter in moves[0].word.content) {
                    if (bingoRack.includes(moveLetter)) {
                        bingoRack.splice(bingoRack.indexOf(moveLetter), 1);
                        break;
                    }
                }
            }
        }
        if (bingoRack.length === 0) message += 'Bingo! (50)\n';
        return message;
    }

    filterPermutations(permutations: ScrabbleWord[]): ScrabbleWord[] {
        const filteredPermutations: ScrabbleWord[] = [];
        for (const permutation of permutations) {
            const permutationString = permutation.stringify();
            if (
                this.isWordValid(permutationString) &&
                (this.isPossiblePermutation(permutation, Axis.H) || this.isPossiblePermutation(permutation, Axis.V))
            ) {
                filteredPermutations.push(permutation);
            }
        }
        return filteredPermutations;
    }

    isPossiblePermutation(word: ScrabbleWord, axis: Axis): boolean {
        let variablePos = POSITION_ERROR;
        let constantPos = POSITION_ERROR;
        let posDifference = 0;
        let letterCounter = 0;
        for (const letter of word.content) {
            if (letter.tile.isValidated) {
                if (axis === Axis.H) {
                    if (variablePos === POSITION_ERROR) {
                        variablePos = letter.tile.position.x;
                        constantPos = letter.tile.position.y;
                    }
                    if (constantPos !== letter.tile.position.y) return false;
                    posDifference = letter.tile.position.x - variablePos;
                }
                if (axis === Axis.V) {
                    if (variablePos === POSITION_ERROR) {
                        variablePos = letter.tile.position.y;
                        constantPos = letter.tile.position.x;
                    }
                    if (constantPos !== letter.tile.position.x) return false;
                    posDifference = letter.tile.position.y - variablePos;
                }
                if (posDifference !== letterCounter && variablePos !== POSITION_ERROR) return false;
            }
            letterCounter++;
        }
        return true;
    }

    playFirstTurn(permutations: ScrabbleWord[], value: number): void {
        const defaultParams: DefaultCommandParams = {
            player: this.player,
            serviceCalled: this.gameService,
        };
        const moveFound = this.findFirstValidMoves(permutations, value, true);
        if (moveFound.length === 0) {
            setTimeout(() => {
                const chosenTiles = this.chooseTilesFromRack(this.selectRandomValue());
                const chosenTilesString = chosenTiles.map((tile) => tile.character).join('');
                if (chosenTilesString === '') {
                    const emptyRackPass = new PassTurnCmd(defaultParams);
                    this.commandInvoker.executeCommand(emptyRackPass);
                    return;
                }
                const exchange = new ExchangeCmd(defaultParams, chosenTilesString);
                this.commandInvoker.executeCommand(exchange);
            }, NO_MOVE_TOTAL_WAIT_TIME - DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
            // Pass turn
            return;
        }
        // Play the word
        // Find the best position for the move for the points if VP is expert
        const params: PlaceParams = {
            position: moveFound[0].position,
            orientation: moveFound[0].axis,
            word: moveFound[0].word.stringify(),
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
    findFirstValidMoves(permutations: ScrabbleWord[], value: number, isFirstTurn: boolean): ScrabbleMove[] {
        const filteredPermutations = this.filterPermutations(permutations);
        const resultArray: ScrabbleMove[] = [];
        let currentMinValue = 0;
        let position = new Vec2(POSITION_ERROR, POSITION_ERROR);
        if (value === Points.MaxValue4) {
            for (const permutation of filteredPermutations) {
                position = this.findPositionForWord(permutation, value, isFirstTurn, currentMinValue);
                if (position.x !== POSITION_ERROR && position.y !== POSITION_ERROR) {
                    const axisChosen = this.getRandomIntInclusive(0, 1);
                    if (axisChosen === 0) this.orientation = Axis.H;
                    else this.orientation = Axis.V;
                    const valueOfWord = this.valueOnPosition(permutation, position, this.orientation);
                    if (valueOfWord > currentMinValue) {
                        resultArray.push(new ScrabbleMove(permutation, position, this.orientation, valueOfWord));
                        if (resultArray.length > MAX_ARRAY_SIZE) {
                            resultArray.sort((a, b) => b.value - a.value);
                            currentMinValue = resultArray[MAX_ARRAY_SIZE].value;
                            resultArray.pop();
                        }
                    }
                }
            }
            resultArray.sort((a, b) => {
                return b.value - a.value;
            });
            return resultArray;
        }
        for (const permutation of filteredPermutations) {
            position = this.findPositionForWord(permutation, value, isFirstTurn);
            if (position.x !== POSITION_ERROR || position.y !== POSITION_ERROR) {
                const valueOfWord = this.valueOnPosition(permutation, position, this.orientation);
                if ((valueOfWord <= value && value >= value - POINTS_INTERVAL) || (value === Points.MaxValue1 && permutation.value === 0)) {
                    resultArray.push(new ScrabbleMove(permutation, position, this.orientation, valueOfWord));
                }
            }
        }
        return resultArray;
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
        const allLettersPlaced = 8;
        if (word.content.length === allLettersPlaced) return totalValue * 2;
        return totalValue;
    }

    tempPlacement(word: ScrabbleWord, startPos: Vec2, axis: Axis) {
        if (!isCoordInsideBoard(startPos)) return;
        const currentCoord = new Vec2(startPos.x, startPos.y);
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < word.content.length; i++) {
            const currentSquare = this.gridService.scrabbleBoard.squares[currentCoord.x][currentCoord.y];
            if (axis === Axis.H && currentCoord.x + 1 < BOARD_SIZE) {
                currentCoord.x += 1;
            } else if (axis === Axis.V && currentCoord.y + 1 < BOARD_SIZE) {
                currentCoord.y += 1;
            }
            if (!currentSquare) return;
            if (currentSquare.isValidated) continue;
            currentSquare.letter = word.content[i];
            currentSquare.occupied = true;
            currentSquare.isValidated = false;
            word.content[i].tile.position = currentSquare.position;
        }
    }

    removalAfterTempPlacement(word: ScrabbleWord, startPos: Vec2, axis: Axis) {
        if (!isCoordInsideBoard(startPos)) return;
        const currentCoord = new Vec2(startPos.x, startPos.y);
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < word.content.length; i++) {
            const currentSquare = this.gridService.scrabbleBoard.squares[currentCoord.x][currentCoord.y];
            if (axis === Axis.H && currentCoord.x + 1 < BOARD_SIZE) {
                currentCoord.x += 1;
            }
            if (axis === Axis.V && currentCoord.y + 1 < BOARD_SIZE) {
                currentCoord.y += 1;
            }
            if (!currentSquare) return;
            if (currentSquare.isValidated) continue;
            currentSquare.letter = new ScrabbleLetter('', 0);
            currentSquare.occupied = false;
            word.content[i].tile.position = new Vec2(POSITION_ERROR, POSITION_ERROR);
        }
    }

    // eslint-disable-next-line complexity
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
            const bonusSpace = 4;
            const letterInBonusRange = word.content.length - bonusSpace;
            if (word.content.length > bonusSpace && maxLetterIndex >= bonusSpace) {
                const offset = maxLetterIndex - bonusSpace;
                switch (axis) {
                    case Axis.H:
                        returnPos.x += offset;
                        break;
                    case Axis.V:
                        returnPos.y += offset;
                        break;
                }
            } else if (word.content.length > bonusSpace && maxLetterIndex < letterInBonusRange) {
                const offset = bonusSpace + maxLetterIndex;
                switch (axis) {
                    case Axis.H:
                        returnPos.x -= offset;
                        break;
                    case Axis.V:
                        returnPos.y -= offset;
                        break;
                }
            }
            return returnPos;
        }
        for (let letter = 0; letter < word.content.length; letter++) {
            for (let i = 0; i < BOARD_SIZE; i++) {
                for (let j = 0; j < BOARD_SIZE; j++) {
                    if (!this.gridService.scrabbleBoard.squares[i][j].letter) continue;
                    if (
                        this.gridService.scrabbleBoard.squares[i][j].letter.character === word.content[letter].character &&
                        word.content[letter].tile.occupied
                    ) {
                        const letterPos = new Vec2(i, j);
                        const realPos = this.getBeginningPosition(letter, letterPos, axis);
                        // Verify if the letters can be found in the rack.
                        this.tempPlacement(word, realPos, axis);
                        const wordsBuilt = this.wordBuilderService.buildWordsOnBoard(word.stringify(), realPos, axis);
                        let isErrorInWordsBuilt = wordsBuilt.length >= 1 ? false : true;
                        for (const wordBuilt of wordsBuilt) {
                            if (!this.isWordValid(wordBuilt.stringify())) isErrorInWordsBuilt = true;
                        }
                        if (!this.wordHasBeenPlaced(word, wordsBuilt)) isErrorInWordsBuilt = true;
                        this.removalAfterTempPlacement(word, realPos, axis);
                        if (isErrorInWordsBuilt) continue;
                        returnPos = realPos;
                    }
                }
            }
        }
        return returnPos;
    }

    canBuildWordWithRack(word: ScrabbleWord, startPos: Vec2, axis: Axis): boolean {
        const nextPosition = new Vec2(startPos.x, startPos.y);
        for (const letter of word.content) {
            if (letter.tile.isValidated) {
                const tilePosition = letter.tile.position;
                if (tilePosition.x !== nextPosition.x || tilePosition.y !== nextPosition.x) return false;
            }
            switch (axis) {
                case Axis.H:
                    nextPosition.x += 1;
                    break;
                case Axis.V:
                    nextPosition.y += 1;
                    break;
            }
        }
        return true;
    }

    wordHasBeenPlaced(word: ScrabbleWord, wordsArray: ScrabbleWord[]): boolean {
        let foundWord = false;
        const wordString = word.stringify();
        for (const wordInArray of wordsArray) {
            if (wordInArray.stringify() === wordString) {
                foundWord = true;
            }
        }
        return foundWord;
    }

    getBeginningPosition(index: number, letterPos: Vec2, axis: Axis): Vec2 {
        const returnVec = new Vec2(letterPos.x, letterPos.y);
        switch (axis) {
            case Axis.H:
                returnVec.x -= index;
                break;
            case Axis.V:
                returnVec.y -= index;
                break;
        }
        return returnVec;
    }

    // Returns all valid combinations of the letter + the letters currently in the rack
    movesWithGivenLetter(letter: ScrabbleLetter, moveLength: number, fromRack?: boolean): ScrabbleWord[] {
        let lettersAvailable: ScrabbleLetter[] = [];
        lettersAvailable[0] = letter;
        const lettersInArray: boolean[] = [false, false, false, false, false, false, false];
        for (let i = 1; i < moveLength; i++) {
            if (fromRack) {
                // Remove the letter from the pool since it is already used
                lettersAvailable = this.rack;
                break;
            }
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

    allSubsetPermutations(letter: ScrabbleLetter, fromRack?: boolean): ScrabbleWord[][] {
        const allPermutations: ScrabbleWord[][] = [];
        for (let i = 2; i <= this.rack.length; i++) {
            allPermutations[i] = this.movesWithGivenLetter(letter, i, fromRack);
        }
        return allPermutations;
    }

    movesWithRack(points: number): ScrabbleWord[] {
        const possibleMoves: ScrabbleWord[] = [];
        for (const letter of this.rack) {
            const allNewWords = this.allSubsetPermutations(letter);
            for (const newWords of allNewWords) {
                if (newWords) {
                    for (const newWord of newWords) {
                        if (newWord) {
                            if (newWord.value < points || newWord.value > 0) {
                                if ((newWord.value < points || newWord.value > 0) && this.lettersInRack(newWord)) {
                                    possibleMoves.push(newWord);
                                }
                            }
                        }
                    }
                }
            }
        }
        return possibleMoves;
    }
    lettersInRack(word: ScrabbleWord): boolean {
        const rackCopy = [];
        for (const letter of this.rack) {
            rackCopy.push(letter);
        }
        for (const letter of word.content) {
            if (!rackCopy.includes(letter)) return false;
            else {
                rackCopy.splice(rackCopy.indexOf(letter), 1);
            }
        }
        return true;
    }

    makeMoves(permutations: ScrabbleWord[], value: number): ScrabbleMove[] {
        const returnArray: ScrabbleMove[] = [];
        let currentMinValue;
        const filteredPermutations = this.filterPermutations(permutations);
        if (value === Points.MaxValue4) {
            // Expert algorithm
            currentMinValue = 0;
            for (const word of filteredPermutations) {
                for (const axis in Axis) {
                    // Try with both axises for each permutation.
                    if (axis) {
                        const myAxis = Axis[axis as keyof typeof Axis];
                        this.orientation = myAxis;
                        const position = this.findPosition(word, myAxis);
                        const wordValue = this.valueOnPosition(word, position, myAxis);
                        if (wordValue > currentMinValue) {
                            returnArray.push(new ScrabbleMove(word, position, myAxis, wordValue));
                            if (returnArray.length > MAX_ARRAY_SIZE) {
                                returnArray.sort((a, b) => b.value - a.value);
                                currentMinValue = returnArray[MAX_ARRAY_SIZE].value;
                            }
                        }
                    }
                }
            }
            return returnArray;
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
                        returnArray.push(new ScrabbleMove(word, position, myAxis, wordValue));
                    }
                }
            }
        }
        return returnArray;
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

    chooseTilesFromRack(value: Points): ScrabbleLetter[] {
        if (value === Points.MaxValue4) return this.rack;
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

    permutationsWithBoard(): ScrabbleWord[] {
        const returnPermutations: ScrabbleWord[] = [];
        const rackString = this.rack.map((letter) => letter.character).join('');
        for (const row of this.gridService.scrabbleBoard.squares) {
            for (const square of row) {
                if (square.letter) {
                    if (square.letter.tile.occupied) {
                        const permutationsOfAllLetters = this.allSubsetPermutations(square.letter, false);
                        for (const permutations of permutationsOfAllLetters) {
                            if (permutations) {
                                for (const word of permutations) {
                                    if (word) {
                                        let boardTileCounter = 0;
                                        for (const letter of word.content) {
                                            if (letter.tile.occupied && !rackString.includes(letter.character)) {
                                                boardTileCounter++;
                                            }
                                        }
                                        if (boardTileCounter > 1) {
                                            break;
                                        }
                                        returnPermutations.push(word);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return returnPermutations;
        // We will then try to place the word on each space on the board
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
}
