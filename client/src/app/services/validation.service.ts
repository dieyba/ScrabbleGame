import { Injectable } from '@angular/core';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { BonusService } from './bonus.service';
import { BOARD_SIZE, GridService } from './grid.service';

const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;
export const WAIT_TIME = 3000;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    dictionary: Dictionary;
    words: string[];
    isTimerElapsed: boolean;
    private socket: io.Socket;
    private readonly server: string;
    areWordsValid: boolean;

    constructor(private readonly gridService: GridService, private bonusService: BonusService) {
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.words = [];
        this.isTimerElapsed = false;
        this.server = 'http://' + window.location.hostname + ':3000';
        this.socket = SocketHandler.requestSocket(this.server);
        this.areWordsValid = false;
        this.socket.on('areWordsValid', (result: boolean) => {
            this.areWordsValid = result;
        });
    }
    updatePlayerScore(newWords: ScrabbleWord[], player: Player): void {
        const wordsValue = this.calculateScore(newWords);
        player.score += wordsValue;
        // Retirer lettres du board
        setTimeout(() => {
            if (this.areWordsValid) {
                newWords.forEach((newWord) => {
                    for (const letter of newWord.content) {
                        if (wordsValue === 0) {
                            this.gridService.removeSquare(letter.tile.position.x, letter.tile.position.y);
                        } else {
                            newWord.content.forEach((letter) => {
                                letter.tile.isValidated = true;
                            });
                            // if change the isvalidated = true here, change how its used in solo game service
                            this.bonusService.useBonus(newWord);
                        }
                    }
                });
            }
            this.isTimerElapsed = true;
        }, WAIT_TIME);
    }

    calculateScore(newWords: ScrabbleWord[]): number {
        let totalScore = 0;

        // Adding total score for each new word
        for (const word of newWords) {
            word.value = this.bonusService.totalValue(word);
            totalScore += word.value;
        }

        // console.log(this.newLettersCount());
        if (this.newLettersCount() === BONUS_LETTER_COUNT) {
            // Add 50 points to player's score
            totalScore += BONUS_POINTS;
        } else if (this.newLettersCount() > BONUS_LETTER_COUNT) {
            return 0;
        }
        return totalScore;
    }

    validateWords(newWords: ScrabbleWord[]): void {
        let strWord = [];
        for (let i = 0; i < newWords.length; i++) {
            strWord[i] = this.convertScrabbleWordToString(newWords[i].content);
        }
        this.socket.emit('validateWords', strWord);
    }

    convertScrabbleWordToString(scrabbleLetter: ScrabbleLetter[]): string {
        let word = '';
        scrabbleLetter.forEach((letter) => {
            word += letter.character;
        });
        return word.toLowerCase();
    }

    newLettersCount(): number {
        let newLetters = 0;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (
                    this.gridService.scrabbleBoard.squares[i][j].occupied === true &&
                    this.gridService.scrabbleBoard.squares[i][j].isValidated === false
                ) {
                    // console.log(this.gridService.scrabbleBoard.squares[i][j]);
                    newLetters++;
                }
            }
        }
        return newLetters;
    }
}
