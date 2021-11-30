import { ValidationService } from '@app/services/validation.service';
import { Goal, GoalDescriptions, GoalPoints, GoalType } from '../goal/goal';
import { ScrabbleWord } from '../scrabble-word/scrabble-word';
import { scrabbleLettersToString } from '../utilities/utilities';

const MIN_WORD_LENGTH = 5;

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
    achieve(wordsFormed: ScrabbleWord[]) {
        if (this.isAchieved) {
            return 0;
        }
        const previousValidWordsFormed = this.validationService.validWordsFormed.slice(0, -wordsFormed.length);
        for (const newWordFormed of wordsFormed) {
            // TODO: Voir pour les étoiles si les lettres si il faut toLower() dans validWordsFormed et newWordFormed
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
