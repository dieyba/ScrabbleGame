import { Injectable } from '@angular/core';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { GridService } from './grid.service';
import { Vec2 } from '@app/classes/vec2';

const TOWARD_START = true;
const TOWARD_END = false;
const BACKWARD_STEP = -1;
const FORWARD_STEP = 1;
const MIN_WORD_LENGHT = 2;

@Injectable({
    providedIn: 'root',
})
export class WordBuilderService {
    constructor(private gridService: GridService) {}

    buildWordOnBoard(word: string, coord: Vec2, axis: WordOrientation): ScrabbleWord[] {
        const result: ScrabbleWord[] = [];

        // get full word that can be read on the placed word's row/column
        let wordBuilt = this.buildScrabbleWord(coord, axis);
        const placedWord = wordBuilt;
        console.log('placed word: ' + wordBuilt.stringify());
        if (wordBuilt.content.length >= MIN_WORD_LENGHT) {
            result.push(wordBuilt);
        }

        // adding all the opposite axis words that could be created from the word placed
        for (const letter of placedWord.content) {
            const currentCoord = letter.tile.position;
            // if the current letter is not a newly placed letter, there is no need to check if word can be built from it
            if (this.gridService.scrabbleBoard.squares[currentCoord.x][currentCoord.y].isValidated) {
                console.log('letter ' + letter.character + ' at (' + currentCoord.x + ',' + currentCoord.y + ') was already validated');
                continue;
            }

            const oppositeAxis = axis === WordOrientation.Horizontal ? WordOrientation.Vertical : WordOrientation.Horizontal;
            wordBuilt = this.buildScrabbleWord(currentCoord, oppositeAxis);
            if (wordBuilt.content.length >= MIN_WORD_LENGHT) {
                result.push(wordBuilt);
                console.log('found the word ' + wordBuilt.stringify() + ' based on the placed letter ' + letter.character);
            }
        }
        return result;
    }

    // out of range begining coord or square without a letter at the begining coord will return the begining coord
    findWordEdge(coord: Vec2, axis: WordOrientation, isTowardStart: boolean): Vec2 {
        if (!this.gridService.scrabbleBoard.isCoordInsideBoard(coord)) {
            return coord;
        }
        const step = isTowardStart ? BACKWARD_STEP : FORWARD_STEP;
        const currentCoord = new Vec2(coord.x, coord.y);
        const nextCoord = new Vec2(coord.x, coord.y);
        do {
            if (axis === WordOrientation.Horizontal) {
                currentCoord.x = nextCoord.x;
                nextCoord.x += step;
            } else {
                currentCoord.y = nextCoord.y;
                nextCoord.y += step;
            }
            // if at the board's boarder
            if (!this.gridService.scrabbleBoard.isCoordInsideBoard(nextCoord)) {
                break;
            }
        } while (this.gridService.scrabbleBoard.squares[nextCoord.x][nextCoord.y].occupied);

        return currentCoord;
    }

    buildScrabbleWord(coord: Vec2, axis: WordOrientation): ScrabbleWord {
        const word = new ScrabbleWord();
        if (this.gridService.scrabbleBoard.isCoordInsideBoard(coord)) {
            const startCoord = this.findWordEdge(coord, axis, TOWARD_START);
            const endCoord = this.findWordEdge(coord, axis, TOWARD_END);
            // Adding 1 to get the correct word lenght since coordinates start at 0
            const lenght = axis === WordOrientation.Horizontal ? endCoord.x - startCoord.x + 1 : endCoord.y - startCoord.y + 1;
            word.startPosition = startCoord;
            word.orientation = axis;

            const currentCoord = startCoord;
            let currentLetter;
            for (let i = 0; i < lenght; i++) {
                currentLetter = this.gridService.scrabbleBoard.squares[currentCoord.x][currentCoord.y].letter;
                word.content[i] = currentLetter;
                word.value += currentLetter.value;

                if (axis === WordOrientation.Horizontal) {
                    currentCoord.x += 1;
                } else {
                    currentCoord.y += 1;
                }
            }
        }
        return word;
    }
}
