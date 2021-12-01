import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { Service } from 'typedi';

@Service()
export class ValidationService {
    dictionary: Dictionary;
    isTimerElapsed: boolean;
    areWordsValid: boolean;

    constructor() {
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.isTimerElapsed = false;
    }

    validateWords(newWords: string[]): boolean {
        // Word not valid, validation fails
        for (const word of newWords) {
            if (!this.isWordValid(word)) {
                return false;
            }
        }
        return true;
    }

    isWordValid(word: string): boolean {
        const isWordInDictionary = this.dictionary.words.indexOf(word) !== ERROR_NUMBER;
        const isLongEnough = word.length >= 2;
        const isAllowedCharacters = word.indexOf('-') === ERROR_NUMBER && word.indexOf("'") === ERROR_NUMBER;
        return isWordInDictionary && isLongEnough && isAllowedCharacters;
    }
}
