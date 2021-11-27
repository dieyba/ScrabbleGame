import { Goal, GoalDescriptions, GoalPoints, GoalType } from './goal';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';

const GOAL_LETTER_VALUE = 10;

export class PlaceLetterWorthTenPts extends Goal {
    constructor() {
        super();
        this.type = GoalType.PlaceLetterWorthTenPts;
        this.description = GoalDescriptions.PlaceLetterWorthTenPts;
    }
    achieve(wordsFormed: ScrabbleWord[], newlyPlacedLetters: ScrabbleLetter[]) {
        if (this.isAchieved) {
            return 0;
        }
        const wordPlaced = wordsFormed[0];
        for (const scrabbleLetter of wordPlaced.content) {
            const isNewlyPlacedLetter = newlyPlacedLetters.includes(scrabbleLetter);
            if (scrabbleLetter.value === GOAL_LETTER_VALUE && isNewlyPlacedLetter) {
                this.isAchieved = true;
                return GoalPoints.PlaceLetterWorthTenPts;
            }
        }
        return 0;
    }
}

export const createPlaceLetterWorthTenPts = (): PlaceLetterWorthTenPts => {
    return new PlaceLetterWorthTenPts();
};
