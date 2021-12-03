import { Goal, GoalDescriptions, GoalPoints, GoalType } from './goal';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';

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
        // First word is the word placed by player
        const wordPlaced = wordsFormed[0];
        let nameLettersCounter = 0;
        let remainingNameLetters = activePlayerName;
        for (const scrabbleLetter of wordPlaced.content) {
            if (remainingNameLetters.includes(scrabbleLetter.character)) {
                nameLettersCounter++;
                remainingNameLetters = this.replaceLetter(remainingNameLetters, scrabbleLetter.character);
            }
        }
        if (nameLettersCounter >= NAME_LETTERS_MIN_AMOUNT) {
            this.isAchieved = true;
            return GoalPoints.FormWordWithLettersFromName;
        }
        return 0;
    }
    replaceLetter(name: string, character: string) {
        const letterIndex = name.indexOf(character);
        console.log('HEY ' + letterIndex);
        const newName = name.substring(0, letterIndex) + name.substring(letterIndex + 1, name.length);
        console.log('NAME ' + newName);
        return newName;
    }
}

export const createFormWordWithLettersFromName = (): FormWordWithLettersFromName => {
    return new FormWordWithLettersFromName();
};
