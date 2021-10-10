import { Injectable } from '@angular/core';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { GridService } from './grid.service';
import { Vec2 } from '@app/classes/vec2';

const TOWARD_START = true;
const TOWARD_END = false;

@Injectable({
    providedIn: 'root',
})
export class WordBuilderService {
    // TODO: initialisation grid service, pass game service's scrabble board instead?
    constructor(private gridService: GridService) {}

    buildWordOnBoard(word: string, coord: Vec2, axis: WordOrientation): ScrabbleWord[] {
        const result: ScrabbleWord[] = [];
        const currentCoord = coord;
        // adding the full word that could be read on the same axis as the word placed
        let wordBuilt = this.buildScrabbleWord(currentCoord, axis);
        if (wordBuilt.content.length !== 0) {
            result.push(wordBuilt);
        }

        // adding the opposite axis words that could be created from the word placed
        for (let i = 0; i < word.length; i++) {
            const oppositeAxis = axis === WordOrientation.Horizontal ? WordOrientation.Vertical : WordOrientation.Horizontal;
            wordBuilt = this.buildScrabbleWord(currentCoord, oppositeAxis);
            if (wordBuilt.content.length !== 0) {
                result.push(wordBuilt);
            }

            if (axis === WordOrientation.Horizontal) {
                currentCoord.x += 1;
            } else {
                currentCoord.y += 1;
            }
        }
        return result;
    }

    findWordEdge(coord: Vec2, axis: WordOrientation, isTowardStart: boolean): Vec2 {
        const step = isTowardStart ? -1 : 1;
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
        } while (this.gridService.scrabbleBoard.squares[nextCoord.x][nextCoord.y].occupied);

        return currentCoord;
    }

    buildScrabbleWord(coord: Vec2, axis: WordOrientation): ScrabbleWord {
        const startCoord = this.findWordEdge(coord, axis, TOWARD_START);
        const endCoord = this.findWordEdge(coord, axis, TOWARD_END);
        // Adding 1 to get the correct word lenght since coordinates start at 0
        const lenght = axis === WordOrientation.Horizontal ? endCoord.x - startCoord.x + 1 : endCoord.y - startCoord.y + 1;

        const word = new ScrabbleWord();
        word.startPosition = startCoord;
        word.orientation = axis;

        if (lenght >= 2) {
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
