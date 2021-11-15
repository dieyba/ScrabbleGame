import { Dictionary, DictionaryType } from '@app/classes/dictionary';
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
        return this.dictionary.words.includes(word) && word.length >= 2 && !word.includes('-') && !word.includes("'") ? true : false;
    }
}
