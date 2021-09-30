import { Injectable } from '@angular/core';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { BonusService } from './bonus.service';
import { BOARD_SIZE, GridService } from './grid.service';

const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    dictionary: Dictionary;
    words: string[];

    constructor(private readonly gridService: GridService, private bonusService: BonusService) {
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.words = [];
    }

    validateWordsAndCalculateScore(newWords: ScrabbleWord[]): number {
        let totalScore = 0;

        for (let i = 0; i < newWords.length; i++) {
            this.words[i] = this.convertScrabbleWordToString(newWords[i].content);
            // Word not valid, validation fails
            if (!this.isWordValid(this.words[i])) {
                return 0;
            } else {
                // Words are all valid
                // Add word's value to player's score
                newWords[i].value = this.bonusService.totalValue(newWords[i]);
                totalScore += newWords[i].value;
            }
        }
        if (this.newLettersCount() === BONUS_LETTER_COUNT) {
            // Add 50 points to player's score
            totalScore += BONUS_POINTS;
        }
        return totalScore;
    }

    convertScrabbleWordToString(scrabbleLetter: ScrabbleLetter[]): string {
        let word = '';
        scrabbleLetter.forEach((letter) => {
            word += letter.getLetter();
        });
        return word.toLowerCase();
    }

    isWordValid(word: string): boolean {
        return this.dictionary.words.includes(word) && word.length >= 2 && !word.includes('-') && !word.includes("'") ? true : false;
    }

    newLettersCount(): number {
        let newLetters = 0;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (
                    this.gridService.scrabbleBoard.squares[i][j].occupied === true &&
                    this.gridService.scrabbleBoard.squares[i][j].isValidated === false
                ) {
                    newLetters++;
                }
            }
        }
        return newLetters;
    }
}
