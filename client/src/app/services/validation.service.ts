import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { DictionaryService } from '@app/services/dictionary.service';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    private dictionary: Dictionary;
    private word: string;

    constructor(public dictionaryService: DictionaryService) {
        this.dictionary = dictionaryService.currentDictionary;
        // this.word = convertScrabbleWordToString(wordService...)
        this.word = this.word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    convertScrabbleWordToString(scrabbleLetter: ScrabbleLetter[]): string {
        let word = '';
        scrabbleLetter.forEach((letter) => {
            word += letter.character;
        });
        return word;
    }

    isWordValid(): boolean {
        return this.dictionary.words.includes(this.word) && this.word.length >= 2 && !this.word.includes('-') && !this.word.includes("'")
            ? true
            : false;
    }
}
