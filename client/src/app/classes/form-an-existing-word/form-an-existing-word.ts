import { Goal, GoalDescriptions, GoalPoints, GoalType } from '@app/classes/goal/goal';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { scrabbleLettersToString } from '@app/classes/utilities/utilities';
import { ValidationService } from '@app/services/validation.service/validation.service';

const MIN_WORD_LENGTH = 5;

export class FormAnExistingWord extends Goal {
    validationService: ValidationService;
    constructor() {
        super();
        this.type = GoalType.FormAnExistingWord;
        this.description = GoalDescriptions.FormAnExistingWord;
    }

    initialize(validationService: ValidationService) {
        this.validationService = validationService;
    }

    achieve(wordsFormed: ScrabbleWord[]) {
        if (this.isAchieved) {
            return 0;
        }
        const previousValidWordsFormed = this.validationService.validWordsFormed;
        wordsFormed.forEach(() => {
            previousValidWordsFormed.pop();
        });
        for (const newWordFormed of wordsFormed) {
            // TODO: see if star letters should be in toLower() in validWordsFormed and newWordFormed
            if (
                previousValidWordsFormed.includes(scrabbleLettersToString(newWordFormed.content)) &&
                newWordFormed.content.length >= MIN_WORD_LENGTH
            ) {
                this.isAchieved = true;
                return GoalPoints.FormAnExistingWord;
            }
        }
        return 0;
    }
}

export const createFormAnExistingWord = (): FormAnExistingWord => {
    return new FormAnExistingWord();
};
