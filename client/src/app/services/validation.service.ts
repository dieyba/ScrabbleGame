import { Injectable } from '@angular/core';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { Player } from '@app/classes/player';
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

        if (this.newLettersCount() === BONUS_LETTER_COUNT) {
            // Add 50 points to player's score
            totalScore += BONUS_POINTS;
        } else if (this.newLettersCount() > BONUS_LETTER_COUNT) {
            return 0;
        }
        return totalScore;
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

    // Calls the server to validate the words passed in.
    // If the words were not valid, wait 3 seconds before returning result.
    // If the server doesnt answer after 3 sec, validation result is false by default
    async validateWords(newWords: ScrabbleWord[]) {
        let strWords: string[] = [];
        newWords?.forEach(newWord => {
            strWords.push(newWord.stringify().toLowerCase());
        });
        this.areWordsValid = false;
        let wordsHaveBeenValidated = false;
        let validationTimer: NodeJS.Timeout;
        return new Promise<boolean>((resolve, reject) => {
            this.socket.emit('validateWords', strWords);

            this.socket.once('areWordsValid', areWordsValid => {
                console.log("response validation from server:", areWordsValid);
                this.areWordsValid = areWordsValid;
                wordsHaveBeenValidated = true;
                if (areWordsValid) {
                    resolve(areWordsValid);
                    clearTimeout(validationTimer);
                }
            });
            validationTimer = setTimeout(() => {
                if (!wordsHaveBeenValidated || !this.areWordsValid) {
                    resolve(false);
                }
            }, WAIT_TIME);
        });
    }
}
