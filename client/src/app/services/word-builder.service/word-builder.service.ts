import { Injectable } from '@angular/core';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Axis, ERROR_NUMBER, invertAxis, isCoordInsideBoard, MIN_WORD_LENGTH } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { GridService } from '@app/services/grid.service/grid.service';

const TOWARD_START = true;
const TOWARD_END = false;
const BACKWARD_STEP = -1;
const FORWARD_STEP = 1;

@Injectable({
    providedIn: 'root',
})
export class WordBuilderService {
    constructor(private gridService: GridService) {}

    // TODO: Handle -1 error coordinates
    // TODO: make sure the scrabbleWords returned scrabbleLetters that have everything init properly (value, coord, color, isBonusUsed)
    buildWordsOnBoard(coord: Vec2, axis: Axis): ScrabbleWord[] {
        const result: ScrabbleWord[] = [];
        // get full word that can be read on the placed word's row/column
        let wordBuilt = this.buildScrabbleWord(coord, axis);
        wordBuilt.orientation = axis;
        const placedWord = wordBuilt;
        if (wordBuilt.content.length >= MIN_WORD_LENGTH) {
            result.push(wordBuilt);
        }

        // adding all the opposite axis words that could be created from the word placed
        for (const letter of placedWord.content) {
            const currentCoord = letter.tile.position;
            if (currentCoord.x === ERROR_NUMBER || currentCoord.y === ERROR_NUMBER) {
                continue;
            }
            // if the current letter is not a newly placed letter, there is no need to check if word can be built from it
            if (!this.gridService.scrabbleBoard.squares[currentCoord.x]) return result;
            if (this.gridService.scrabbleBoard.squares[currentCoord.x][currentCoord.y].isValidated) {
                continue;
            }

            const oppositeAxis = invertAxis[axis];
            wordBuilt = this.buildScrabbleWord(currentCoord, oppositeAxis);
            wordBuilt.orientation = axis;
            if (wordBuilt.content.length >= MIN_WORD_LENGTH) {
                result.push(wordBuilt);
            }
        }
        return result;
    }

    buildScrabbleWord(coord: Vec2, axis: Axis): ScrabbleWord {
        const word = new ScrabbleWord();
        if (isCoordInsideBoard(coord)) {
            if (this.gridService.scrabbleBoard.squares[coord.x][coord.y].occupied) {
                const startCoord = this.findWordEdge(coord, axis, TOWARD_START);
                const endCoord = this.findWordEdge(coord, axis, TOWARD_END);
                const invalidStartCoord = startCoord.x === ERROR_NUMBER || startCoord.y === ERROR_NUMBER;
                const invalidEndCoord = endCoord.x === ERROR_NUMBER || endCoord.y === ERROR_NUMBER;
                if (invalidStartCoord || invalidEndCoord) {
                    return word;
                }
                // Adding 1 to get the correct word length since coordinates start at 0
                const length = axis === Axis.H ? endCoord.x - startCoord.x + 1 : endCoord.y - startCoord.y + 1;
                word.startPosition.x = startCoord.x;
                word.startPosition.y = startCoord.y;

                const currentCoord = startCoord;
                let currentLetter;
                for (let i = 0; i < length; i++) {
                    currentLetter = this.gridService.scrabbleBoard.squares[currentCoord.x][currentCoord.y].letter;
                    word.content[i] = currentLetter;
                    word.value += currentLetter.value;

                    if (axis === Axis.H) {
                        currentCoord.x += 1;
                    } else {
                        currentCoord.y += 1;
                    }
                }
            }
        }
        return word;
    }

    // out of range beginning coordinates or unoccupied beginning coordinates will return the beginning coord
    findWordEdge(coord: Vec2, axis: Axis, isTowardStart: boolean): Vec2 {
        if (!isCoordInsideBoard(coord)) {
            return coord;
        }
        const step = isTowardStart ? BACKWARD_STEP : FORWARD_STEP;
        const currentCoord = new Vec2(coord.x, coord.y);
        const nextCoord = new Vec2(coord.x, coord.y);
        do {
            if (axis === Axis.H) {
                currentCoord.x = nextCoord.x;
                nextCoord.x += step;
            } else {
                currentCoord.y = nextCoord.y;
                nextCoord.y += step;
            }
            // if at the board's boarder
            if (!isCoordInsideBoard(nextCoord)) {
                break;
            }
        } while (this.gridService.scrabbleBoard.squares[nextCoord.x][nextCoord.y].occupied);

        return currentCoord;
    }
}
