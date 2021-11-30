import { Goal, GoalDescriptions, GoalPoints, GoalType } from '../goal/goal';
import { ScrabbleWord } from '../scrabble-word/scrabble-word';

const WORDS_FORMED_MIN_AMOUNT = 3;

export class FormThreeWords extends Goal {
    constructor() {
        super();
        this.type = GoalType.FormThreeWords;
        this.description = GoalDescriptions.FormThreeWords;
    }
    achieve(wordsFormed: ScrabbleWord[]) {
        if (this.isAchieved) {
            return 0;
        }
        if (wordsFormed.length >= WORDS_FORMED_MIN_AMOUNT) {
            this.isAchieved = true;
            return GoalPoints.FormThreeWords;
        }
        return 0;
    }
}

export const createFormThreeWords = (): FormThreeWords => {
    return new FormThreeWords();
};
