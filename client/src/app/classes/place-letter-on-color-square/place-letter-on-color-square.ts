import { Goal, GoalDescriptions, GoalPoints, GoalType } from '@app/classes/goal/goal';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { SquareColor } from '@app/classes/square/square';

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
        const description = GoalDescriptions.PlaceLetterOnColorSquare.replace('x', this.targetLetter);
        this.description = description.replace('y', this.colorToString(this.targetColor));
    }

    achieve(wordsFormed: ScrabbleWord[], newlyPlacedLetters: ScrabbleLetter[]) {
        if (this.isAchieved) {
            return 0;
        }
        const wordPlaced = wordsFormed[0];
        for (const scrabbleLetter of wordPlaced.content) {
            const isRightLetter = scrabbleLetter.character === this.targetLetter;
            const isRightColor = scrabbleLetter.color === this.targetColor;
            const isNewlyPlacedLetter = newlyPlacedLetters.includes(scrabbleLetter);
            if (isRightLetter && isRightColor && isNewlyPlacedLetter) {
                this.isAchieved = true;
                return GoalPoints.PlaceLetterOnColorSquare;
            }
        }
        return 0;
    }

    colorToString(color: SquareColor): string {
        switch (color) {
            case SquareColor.DarkBlue:
                return 'bleu foncé';
            case SquareColor.Teal:
                return 'bleu pale';
            case SquareColor.Pink:
                return 'rose';
            case SquareColor.Red:
                return 'rouge';
        }
        return 'blanche';
    }
}

export const createPlaceLetterOnColorSquare = (): PlaceLetterOnColorSquare => {
    return new PlaceLetterOnColorSquare();
};
