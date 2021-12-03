import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { Service } from 'typedi';

@Service()
export class ValidationService {
    dictionary: DictionaryInterface;
    isTimerElapsed: boolean;
    areWordsValid: boolean;

    constructor() {
        this.isTimerElapsed = false;
    }

    validateWords(newWords: string[], dictionary: DictionaryInterface): boolean {
        // Word not valid, validation fails
        for (const word of newWords) {
            if (!this.isWordValid(word, dictionary)) {
                return false;
            }
        }
        return true;
    }

    isWordValid(word: string, dictionary: DictionaryInterface): boolean {
        return dictionary.words.includes(word) && word.length >= 2 && !word.includes('-') && !word.includes("'") ? true : false;
    }
}
