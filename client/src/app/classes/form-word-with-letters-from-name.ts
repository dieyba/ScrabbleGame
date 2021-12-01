import { Goal, GoalDescriptions, GoalPoints, GoalType } from './goal';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';
import { ERROR_NUMBER } from './utilities';

const NAME_LETTERS_MIN_AMOUNT = 3;

export class FormWordWithLettersFromName extends Goal {
    constructor() {
        super();
        this.type = GoalType.FormWordWithLettersFromName;
        this.description = GoalDescriptions.FormWordWithLettersFromName;
    }
    achieve(wordsFormed: ScrabbleWord[], newlyPlacedLetters: ScrabbleLetter[], activePlayerName: string) {
        if (this.isAchieved) {
            return 0;
        }
        const wordPlaced = wordsFormed[0];
        let nameLettersCounter = 0;
        const remainingNameLetters = activePlayerName;
        for (const scrabbleLetter of wordPlaced.content) {
            const isNewlyPlacedLetter = newlyPlacedLetters.indexOf(scrabbleLetter) !== ERROR_NUMBER;
            if (remainingNameLetters.indexOf(scrabbleLetter.character) !== ERROR_NUMBER && isNewlyPlacedLetter) {
                nameLettersCounter++;
                remainingNameLetters.replace(scrabbleLetter.character, '');
            }
        }
        if (nameLettersCounter >= NAME_LETTERS_MIN_AMOUNT) {
            this.isAchieved = true;
            return GoalPoints.FormWordWithLettersFromName;
        }
        return 0;
    }
}

export const createFormWordWithLettersFromName = (): FormWordWithLettersFromName => {
    return new FormWordWithLettersFromName();
};
