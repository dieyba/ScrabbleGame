import { Goal, GoalDescriptions, GoalPoints, GoalType } from './goal';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';
import { SquareColor } from './square';

export class PlaceLetterOnColorSquare extends Goal {
    targetLetter: string;
    targetColor: SquareColor;

    constructor() {
        super();
        this.type = GoalType.PlaceLetterOnColorSquare;
        this.description = GoalDescriptions.PlaceLetterOnColorSquare;
    }
    initialize(targetLetterAndColor: ScrabbleLetter) {
        this.targetLetter = targetLetterAndColor.character;
        this.targetColor = targetLetterAndColor.color;
    }
    achieve(wordsFormed: ScrabbleWord[], newlyPlacedLetters: ScrabbleLetter[]) {
        if (this.isAchieved) {
            return 0;
        }
        const wordPlaced = wordsFormed[0];
        for (let scrabbleLetter of wordPlaced.content) {
            const isRightLetter = scrabbleLetter.character === this.targetLetter;
            const isRightColor = scrabbleLetter.color === this.targetColor;
            const isNewlyPlacedLetter = newlyPlacedLetters.includes(scrabbleLetter);
            if (isRightLetter && isRightColor && isNewlyPlacedLetter) {
                this.isAchieved = true;
                return GoalPoints.PlaceLetterOnColorSquare;
            }
        };
        return 0;
    }
}

export const createPlaceLetterOnColorSquare = (): PlaceLetterOnColorSquare => {
    return new PlaceLetterOnColorSquare();
};
