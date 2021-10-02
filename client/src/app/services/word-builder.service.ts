import { Injectable } from '@angular/core';
import { Axis, invertAxis, Direction, ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';

@Injectable({
    providedIn: 'root',
})
export class WordBuilderService {
    // All words created from the letters placed on the board
    allWordsCreated(newLetters: ScrabbleLetter[], axis: Axis): ScrabbleWord[] {
        const wordList: ScrabbleWord[] = [];
        let i = 0;
        const horizontalResult = this.completeWordInADirection(newLetters[0], axis);
        if (horizontalResult.content !== []) {
            wordList[i] = horizontalResult;
            i++;
        }
        for (const index of newLetters) {
            const verticalResult = this.completeWordInADirection(index, invertAxis[axis]);
            if (verticalResult.content !== []) {
                wordList[i] = verticalResult;
                i++;
            }
        }
        return wordList;
    }

    // THIS FUNCTION WILL BREAK WHEN CODE STRUCTURE CHANGES. BEWARE.
    completeWordInADirection(firstLetter: ScrabbleLetter, direction: Axis): ScrabbleWord {
        const wordInConstruction = new ScrabbleWord();
        let directionOrigin: Direction;
        let directionLast: Direction;
        if (direction === 'h') {
            directionOrigin = Direction.West;
            directionLast = Direction.East;
        } else if (direction === 'v') {
            directionOrigin = Direction.North;
            directionLast = Direction.South;
        } else {
            return new ScrabbleWord();
            // TEMPORARY
            // TODO : Throw exception
        }
        let nextLetter = firstLetter.nextLetters[directionOrigin];
        if (nextLetter) {
            let temp = new ScrabbleLetter('', 0);
            while (nextLetter) {
                temp = nextLetter;
                nextLetter = temp.nextLetters[directionOrigin];
            } // When we get out of the loop, temp is the letter furthest left and leftwardsLetter is invalid
            let i = 0;
            wordInConstruction.content[i] = temp; // first letter of the horizontal word
            while (wordInConstruction.content[i].nextLetters[directionLast]) {
                i++;
                wordInConstruction.content[i] = wordInConstruction.content[i - 1].nextLetters[directionLast];
            }
        }
        return wordInConstruction;
    }
}
