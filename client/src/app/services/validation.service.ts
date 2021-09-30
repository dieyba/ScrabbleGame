import { Injectable } from '@angular/core';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { BonusService } from './bonus.service';
import { BOARD_SIZE, GridService } from './grid.service';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';

const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    dictionary: Dictionary;
    words: string[];

    constructor(private readonly gridService: GridService, private bonusService: BonusService, private rackService: RackService, private soloGameService: SoloGameService) {
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.words = [];
    }

    updatePlayerScore(newWords: ScrabbleWord[], player: Player): void {
        let wordsValue = this.validateWordsAndCalculateScore(newWords);
        player.score += wordsValue;
        // Retirer lettres du board
        for (let i = 0; i < newWords.length; i++) {
            for (let j = 0; j < newWords[i].content.length; j++) {
                if (wordsValue === 0) {
                    setTimeout(() => {
                        if (newWords[i].orientation === WordOrientation.Vertical) {
                            this.gridService.removeSquare(newWords[i].startPosition.x, newWords[i].startPosition.y + j);
                        }
                        if (newWords[i].orientation === WordOrientation.Horizontal) {
                            this.gridService.removeSquare(newWords[i].startPosition.x + j, newWords[i].startPosition.y);
                        }
                        this.rackService.drawLetter(newWords[i].content[j]);
                    }, 3000);
                } else {
                    if (newWords[i].orientation === WordOrientation.Vertical) {
                        this.gridService.scrabbleBoard.squares[newWords[i].startPosition.x][newWords[i].startPosition.y + j].isValidated = true;
                    }
                    if (newWords[i].orientation === WordOrientation.Horizontal) {
                        this.gridService.scrabbleBoard.squares[newWords[i].startPosition.x + j][newWords[i].startPosition.y].isValidated = true;
                    }
                }
            }
        }
        this.soloGameService.changeActivePlayer();
    }

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
