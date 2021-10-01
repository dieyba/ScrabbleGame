import { Injectable } from '@angular/core';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { BonusService } from './bonus.service';
import { BOARD_SIZE, GridService } from './grid.service';
import { SoloGameService } from './solo-game.service';

const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;
const WAIT_TIME = 3000;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    dictionary: Dictionary;
    words: string[];

    constructor(private readonly gridService: GridService, private bonusService: BonusService, private soloGameService: SoloGameService) {
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.words = [];
    }

    updatePlayerScore(newWords: ScrabbleWord[], player: Player): void {
        const wordsValue = this.validateWordsAndCalculateScore(newWords);
        player.score += wordsValue;
        // Retirer lettres du board
        setTimeout(() => {
            newWords.forEach((newWord) => {
                for (let j = 0; j < newWord.content.length; j++) {
                    if (wordsValue === 0) {
                        if (newWord.orientation === WordOrientation.Vertical) {
                            this.gridService.removeSquare(newWord.startPosition.x, newWord.startPosition.y + j);
                        }
                        if (newWord.orientation === WordOrientation.Horizontal) {
                            this.gridService.removeSquare(newWord.startPosition.x + j, newWord.startPosition.y);
                        }
                        this.soloGameService.addRackLetter(newWord.content[j]);
                        this.bonusService.useBonus(newWord);
                    } else {
                        if (newWord.orientation === WordOrientation.Vertical) {
                            this.gridService.scrabbleBoard.squares[newWord.startPosition.x][newWord.startPosition.y + j].isValidated = true;
                        }
                        if (newWord.orientation === WordOrientation.Horizontal) {
                            this.gridService.scrabbleBoard.squares[newWord.startPosition.x + j][newWord.startPosition.y].isValidated = true;
                        }
                        this.bonusService.useBonus(newWord);
                    }
                }
            });

            this.soloGameService.changeActivePlayer();
        }, WAIT_TIME);
    }

    // if AMI A is already on board ??

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
