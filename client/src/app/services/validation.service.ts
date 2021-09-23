import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { DictionaryService } from '@app/services/dictionary.service';
import { GridService } from './grid.service';

const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    dictionary: Dictionary;
    words: string[];

    constructor(public dictionaryService: DictionaryService, public newWords: ScrabbleWord[], public gridService: GridService) {
        this.dictionary = dictionaryService.currentDictionary;
        this.validateWordsAndCalculateScore(newWords);
    }

    validateWordsAndCalculateScore(newWords: ScrabbleWord[]): number {
        let totalScore = 0;
        let newLetters = 0;

        for (let i = 0; i < newWords.length; i++) {
            this.words[i] = this.convertScrabbleWordToString(newWords[i].content);
            this.words[i] = this.words[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            // Word not valid, validation fails
            if (!this.isWordValid(this.words[i])) {
                return 0;
            } else {
                // Words are all valid
                // Add word's value to player's score
                totalScore += newWords[i].totalValue();
                newLetters += this.newLettersCount(/* newWords[i].content*/);
            }
        }
        if (newLetters === BONUS_LETTER_COUNT) {
            // Add 50 points to player's score
            totalScore += BONUS_POINTS;
        }
        return totalScore;
    }

    convertScrabbleWordToString(scrabbleLetter: ScrabbleLetter[]): string {
        let word = '';
        scrabbleLetter.forEach((letter) => {
            word += letter.character;
        });
        return word.toLowerCase();
    }

    isWordValid(word: string): boolean {
        return this.dictionary.words.includes(word) && word.length >= 2 && !word.includes('-') && !word.includes("'") ? true : false;
    }

    newLettersCount(/* scrabbleLetters: ScrabbleLetter[]*/): number {
        // TODO
        return 1;
    }
}
