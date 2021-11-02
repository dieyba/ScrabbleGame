import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { Service } from 'typedi';

@Service()
export class ValidationService {
    dictionary: Dictionary;
    isTimerElapsed: boolean;

    constructor() {
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.isTimerElapsed = false;
    }

    validateWords(newWords: string[]): boolean {
        for (let i = 0; i < newWords.length; i++) {
            // Word not valid, validation fails3
            if (!this.isWordValid(newWords[i])) {
                return false;
            }
        }
        return true;
    }

    isWordValid(word: string): boolean {
        return this.dictionary.words.includes(word) && word.length >= 2 && !word.includes('-') && !word.includes("'") ? true : false;
    }
}
