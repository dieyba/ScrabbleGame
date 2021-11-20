import { ValidationService } from '@app/services/validation.service';
import { Goal, GoalDescriptions, GoalPoints, GoalType } from './goal';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';

export class FormAnExistingWord extends Goal {
    private validationService: ValidationService;
    constructor() {
        super();
        this.type = GoalType.FormAnExistingWord;
        this.description = GoalDescriptions.FormAnExistingWord;
    }
    initialize(validationService: ValidationService) {
        this.validationService = validationService;
    }
    achieve(wordsFormed: ScrabbleWord[], newlyPlacedLetters: ScrabbleLetter[]) {
        if (this.isAchieved) {
            return 0;
        }
        for (let newWordFormed of wordsFormed) {
            const newWordFormedFirstOccurence = this.validationService.validWordsFormed.findIndex(wordFormed => {
                return newWordFormed.content === wordFormed.content;
            });
            const newWordFormedLastOccurence = this.validationService.validWordsFormed.lastIndexOf(newWordFormed);
            if (newWordFormedFirstOccurence !== newWordFormedLastOccurence) {
                this.isAchieved = true;
                return GoalPoints.FormAnExistingWord;
            }
        };
        return 0;
    }
}

export const createFormAnExistingWord = (): FormAnExistingWord => {
    return new FormAnExistingWord();
};
