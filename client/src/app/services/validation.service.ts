import { Injectable } from '@angular/core';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { Player } from '@app/classes/player';
import { Axis, ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Vec2 } from '@app/classes/vec2';
import { BonusService } from './bonus.service';
import { BOARD_SIZE, GridService } from './grid.service';

const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;
const WAIT_TIME = 3000;

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
    /* eslint-disable no-unused-vars */
    isPlacable(arg0: ScrabbleWord, arg1: Vec2, axis: Axis): boolean {
        throw new Error('Method not implemented.');
    }
    /* eslint-enable no-unused-vars */

    updatePlayerScore(newWords: ScrabbleWord[], player: Player): void {
        const wordsValue = this.validateWordsAndCalculateScore(newWords);
        player.score += wordsValue;
        // Retirer lettres du board
        setTimeout(() => {
            newWords.forEach((newWord) => {
                // for (let j = 0; j < newWord.content.length; j++) {
                //     if (wordsValue === 0) {
                //         if (newWord.orientation === WordOrientation.Vertical) {
                //             this.gridService.removeSquare(newWord.startPosition.x, newWord.startPosition.y + j);
                //         }
                //         if (newWord.orientation === WordOrientation.Horizontal) {
                //             this.gridService.removeSquare(newWord.startPosition.x + j, newWord.startPosition.y);
                //         }
                //     } else {
                //         // TODO: are all the right squares set to isvalidated? 
                //         if (newWord.orientation === WordOrientation.Vertical) {
                //             this.gridService.scrabbleBoard.squares[newWord.startPosition.x][newWord.startPosition.y + j].isValidated = true;
                //         }
                //         if (newWord.orientation === WordOrientation.Horizontal) {
                //             this.gridService.scrabbleBoard.squares[newWord.startPosition.x + j][newWord.startPosition.y].isValidated = true;
                //         }
                //         this.bonusService.useBonus(newWord);
                //     }
                // }
                for(let letter of newWord.content){
                    // TODO: technically if we only put white letters the value would be 0 but it should be valid.
                    // if we separate validateWords and CalculateScore, we could juste use validateWords' return (true/false)
                    // the place method calls validateWordsAndCalculateScore and then calls updatePlayerScore
                    // instead it could just call validate words and then this methods calls calculateScore and yatti yatta
                    if(wordsValue === 0){
                        this.gridService.removeSquare(letter.tile.position.x,letter.tile.position.y);
                    }else{
                        // TODO: seems to have a problem in how usebonus iterates? did the same in previous for loop's version that is commented
                        // where it also put bonus used and isValided true to empty squares after the placed word
                        this.bonusService.useBonus(newWord); 
                    }
                }

            });
        }, WAIT_TIME);
    }

    // TODO: separate validate words and calculate score in 2 methods?
    validateWordsAndCalculateScore(newWords: ScrabbleWord[]): number {
        let totalScore = 0;

        for (let i = 0; i < newWords.length; i++) {
            this.words[i] = this.convertScrabbleWordToString(newWords[i].content);
            // Word not valid, validation fails3
            if (!this.isWordValid(this.words[i])) {
                return 0;
            } else {
                // Words are all valid
                // Add word's value to player's score
                newWords[i].value = this.bonusService.totalValue(newWords[i]);
                totalScore += newWords[i].value;

                // TODO: is it fine to put this here? if put in updatePlayerScore, because of how the methods are called in placer, it wouldnt work properly
                newWords[i].content.forEach((letter) => {
                    letter.tile.isValidated = true;
                });

            }
        }
        if (this.newLettersCount() === BONUS_LETTER_COUNT) {
            // Add 50 points to player's score
            totalScore += BONUS_POINTS;
        } else if (this.newLettersCount() > BONUS_LETTER_COUNT) {
            return 0;
        }
        return totalScore;
    }

    // Total value ne consume pas les bonus
    // TODO: duplicate method with stringify in ScrabbleWord. Which one is to remove?
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
