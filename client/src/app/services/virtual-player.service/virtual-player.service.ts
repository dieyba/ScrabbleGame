/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { DefaultCommandParams, PlaceParams } from '@app/classes/commands/commands';
import { Dictionary, DictionaryType } from '@app/classes/dictionary/dictionary';
import { ExchangeCmd } from '@app/classes/exchange-command/exchange-command';
import { PassTurnCmd } from '@app/classes/pass-command/pass-command';
import { PlaceCmd } from '@app/classes/place-command/place-command';
import { Player } from '@app/classes/player/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleRack } from '@app/classes/scrabble-rack/scrabble-rack';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Axis, ERROR_NUMBER } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { GameService } from '../game.service/game.service';
import { GridService } from '../grid.service/grid.service';
import { PlaceService } from '../place.service/place.service';
import { WordBuilderService } from '../word-builder.service/word-builder.service';
import { BonusService } from './bonus.service';
import { CommandInvokerService } from './command-invoker.service';

export enum Probability {
    EndTurn = 100, // TODO: put the right probability settings after testing
    ExchangeTile = 0,
    MakeAMove = 0,
    MaxValue1 = 40,
    MaxValue2 = 30,
    MaxValue3 = 30,
}
export enum Points {
    MaxValue1 = 6,
    MaxValue2 = 12,
    MaxValue3 = 18,
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
    rack: ScrabbleRack;
    orientation: Axis;
    player: Player;

    constructor(
        private bonusService: BonusService,
        private commandInvoker: CommandInvokerService,
        private gameService: GameService,
        private gridService: GridService,
        private placeService: PlaceService,
        private wordBuilderService: WordBuilderService,
    ) {
        this.rack = new ScrabbleRack();
    }
    async playTurn(): Promise<void> {
        // Next sprint: implement difficult player type logic by separating here and in virtualPlayerService.makeMoves().
        this.player = this.gameService.game.getOpponent();
        const defaultParams: DefaultCommandParams = {
            player: this.player,
            serviceCalled: this.gameService,
        };
        const currentMove = this.getRandomIntInclusive(1, PERCENTAGE);
        if (currentMove <= Probability.EndTurn) {
            setTimeout(() => {
                // 10% chance to end turn
                const command = new PassTurnCmd(defaultParams);
                this.commandInvoker.executeCommand(command);
            }, DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        } else if (currentMove <= Probability.EndTurn + Probability.ExchangeTile) {
            setTimeout(() => {
                const chosenTiles = this.chooseTilesFromRack(); // 10% chance to exchange tiles
                // Converts chosen word to string
                const chosenTilesString = chosenTiles.map((tile) => tile.character).join(''); // TEST THIS, may not work.
                const command = new ExchangeCmd(defaultParams, chosenTilesString);
                this.commandInvoker.executeCommand(command);
            }, DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
        } else if (currentMove <= Probability.EndTurn + Probability.ExchangeTile + Probability.MakeAMove) {
            // 80% chance to make a move
            const makeMovePromise = new Promise<ScrabbleWord>((resolve) => {
                let moveMade = new ScrabbleWord();
                moveMade = this.makeMoves();
                setTimeout(() => {
                    if (moveMade.value !== 0) {
                        // eslint-disable-next-line no-console
                        console.log('move found after 3 seconds');
                        resolve(moveMade);
                    } else {
                        setTimeout(() => {
                            resolve(moveMade);
                            // eslint-disable-next-line no-console
                            console.log('move found after 20 seconds');
                        }, NO_MOVE_TOTAL_WAIT_TIME - DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
                    }
                }, DEFAULT_VIRTUAL_PLAYER_WAIT_TIME);
            });
            // after move is found, call the right command depending on result
            await makeMovePromise.then((moveMade: ScrabbleWord) => {
                if (moveMade.value !== 0) {
                    // eslint-disable-next-line no-console
                    console.log('a move was found. Calling place command');
                    const movePosition = this.findPosition(moveMade, this.orientation);
                    const params: PlaceParams = {
                        position: movePosition,
                        orientation: this.orientation,
                        word: moveMade.stringify(),
                    };
                    const command = new PlaceCmd(defaultParams, params);
                    this.commandInvoker.executeCommand(command);
                } else {
                    // eslint-disable-next-line no-console
                    console.log('no move was found. Calling pass command');
                    const command = new PassTurnCmd(defaultParams);
                    this.commandInvoker.executeCommand(command);
                }
            });
        }
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
            if (this.isWordValid(charArray.join(''))) {
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
                        if (this.placeService.canPlaceWord(placeParams)) {
                            if (this.bonusService.totalValue(list[l]) > points || this.bonusService.totalValue(list[l]) < points - POINTS_INTERVAL) {
                                list.splice(l);
                            } else {
                                const currentWord = list[l].stringify();
                                const position = this.findPosition(list[l], axis);
                                const otherWords: ScrabbleWord[] = this.wordBuilderService.buildWordsOnBoard(position, axis);
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
        this.orientation = Axis.V;
        if (this.getRandomIntInclusive(0, 1) === 1) {
            // coin flip to determine starting axis
            this.orientation = Axis.H;
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
    isWordValid(word: string): boolean {
        // TODO: see where to access dictionary downloaded
        const dictionary: Dictionary = new Dictionary(DictionaryType.Default);
        return dictionary.words.includes(word) && word.length >= 2 && !word.includes('-') && !word.includes("'") ? true : false;
    }
}