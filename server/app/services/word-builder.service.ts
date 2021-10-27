import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Axis, invertAxis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { Service } from 'typedi';

const TOWARD_START = true;
const TOWARD_END = false;
const BACKWARD_STEP = -1;
const FORWARD_STEP = 1;
const MIN_WORD_LENGHT = 2;

@Service()
export class WordBuilderService {
    constructor() {}

    buildWordsOnBoard(word: string, coord: Vec2, axis: Axis, scrabbleBoard: ScrabbleBoard): ScrabbleWord[] {
        const result: ScrabbleWord[] = [];

        // get full word that can be read on the placed word's row/column
        let wordBuilt = this.buildScrabbleWord(coord, axis, scrabbleBoard);
        wordBuilt.startPosition = coord;
        wordBuilt.orientation = axis;
        const placedWord = wordBuilt;
        if (wordBuilt.content.length >= MIN_WORD_LENGHT) {
            result.push(wordBuilt);
        }

        // adding all the opposite axis words that could be created from the word placed
        for (const letter of placedWord.content) {
            const currentCoord = letter.tile.position;
            // if the current letter is not a newly placed letter, there is no need to check if word can be built from it
            if (scrabbleBoard.squares[currentCoord.x][currentCoord.y].isValidated) {
                continue;
            }

            const oppositeAxis = invertAxis[axis];
            wordBuilt = this.buildScrabbleWord(currentCoord, oppositeAxis, scrabbleBoard);
            wordBuilt.startPosition = coord;
            wordBuilt.orientation = axis;
            if (wordBuilt.content.length >= MIN_WORD_LENGHT) {
                result.push(wordBuilt);
            }
        }
        return result;
    }

    // out of range begining coord or square without a letter at the begining coord will return the begining coord
    findWordEdge(coord: Vec2, axis: Axis, isTowardStart: boolean, scrabbleBoard: ScrabbleBoard): Vec2 {
        if (!scrabbleBoard.isCoordInsideBoard(coord)) {
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
            if (!scrabbleBoard.isCoordInsideBoard(nextCoord)) {
                break;
            }
        } while (scrabbleBoard.squares[nextCoord.x][nextCoord.y].occupied);

        return currentCoord;
    }

    buildScrabbleWord(coord: Vec2, axis: Axis, scrabbleBoard: ScrabbleBoard): ScrabbleWord {
        const word = new ScrabbleWord();
        if (scrabbleBoard.isCoordInsideBoard(coord)) {
            const startCoord = this.findWordEdge(coord, axis, TOWARD_START, scrabbleBoard);
            const endCoord = this.findWordEdge(coord, axis, TOWARD_END, scrabbleBoard);
            // Adding 1 to get the correct word lenght since coordinates start at 0
            const lenght = axis === Axis.H ? endCoord.x - startCoord.x + 1 : endCoord.y - startCoord.y + 1;

            const currentCoord = startCoord;
            let currentLetter;
            for (let i = 0; i < lenght; i++) {
                currentLetter = scrabbleBoard.squares[currentCoord.x][currentCoord.y].letter;
                word.content[i] = currentLetter;
                word.value += currentLetter.value;

                if (axis === Axis.H) {
                    currentCoord.x += 1;
                } else {
                    currentCoord.y += 1;
                }
            }
        }
        return word;
    }
}
