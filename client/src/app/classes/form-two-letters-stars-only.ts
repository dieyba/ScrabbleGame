import { Goal, GoalDescriptions, GoalPoints, GoalType } from './goal';
import { ScrabbleWord } from './scrabble-word';
import { MIN_WORD_LENGHT } from './utilities';

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
        for (let scrabbleLetter of wordPlaced.content) {
            if (scrabbleLetter.character === '*') numberOfStars++;
        }
        const isValidWordLenght = wordPlaced.content.length >= MIN_WORD_LENGHT;
        const isOnlyStarsWord = numberOfStars === wordPlaced.content.length;
        if (isValidWordLenght && isOnlyStarsWord) {
            this.isAchieved = true;
            return GoalPoints.FormTwoLettersStarsOnly;
        }
        return 0;
    }
}

export const createFormTwoLettersStarsOnly = (): FormTwoLettersStarsOnly => {
    return new FormTwoLettersStarsOnly();
};
