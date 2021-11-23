import { ValidationService } from '@app/services/validation.service';
import { Goal, GoalDescriptions, GoalPoints, GoalType } from './goal';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';
import { scrabbleLettersToString } from './utilities';

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
        const previousValidWordsFormed = this.validationService.validWordsFormed.slice(0, -wordsFormed.length);
        for (let newWordFormed of wordsFormed) {
            // TODO: Voir pour les étoiles si les lettres si il faut toLower() dans validWordsFormed et newWordFormed 
            if (previousValidWordsFormed.includes(scrabbleLettersToString(newWordFormed.content))) {
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
