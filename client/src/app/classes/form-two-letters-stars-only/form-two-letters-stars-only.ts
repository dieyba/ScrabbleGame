import { Goal, GoalDescriptions, GoalPoints, GoalType } from '@app/classes/goal/goal';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { MIN_WORD_LENGTH } from '@app/classes/utilities/utilities';

export class FormTwoLettersStarsOnly extends Goal {
    constructor() {
        super();
        this.type = GoalType.FormTwoLettersStarsOnly;
        this.description = GoalDescriptions.FormTwoLettersStarsOnly;
    }
    achieve(wordsFormed: ScrabbleWord[]) {
        if (this.isAchieved) {
            return 0;
        }
        const wordPlaced = wordsFormed[0];
        let numberOfStars = 0;
        for (const scrabbleLetter of wordPlaced.content) {
            if (scrabbleLetter.character === '*') numberOfStars++;
        }
        const isValidWordLength = wordPlaced.content.length >= MIN_WORD_LENGTH;
        const isOnlyStarsWord = numberOfStars === wordPlaced.content.length;
        if (isValidWordLength && isOnlyStarsWord) {
            this.isAchieved = true;
            return GoalPoints.FormTwoLettersStarsOnly;
        }
        return 0;
    }
}

export const createFormTwoLettersStarsOnly = (): FormTwoLettersStarsOnly => {
    return new FormTwoLettersStarsOnly();
};
