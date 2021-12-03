import { Injectable } from '@angular/core';
import { Dictionary, DictionaryType } from '@app/classes/dictionary/dictionary';
import { GameType } from '@app/classes/game-parameters/game-parameters';
import { Player } from '@app/classes/player/player';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Trie } from '@app/classes/trie/trie';
import { ERROR_NUMBER, MIN_WORD_LENGHT } from '@app/classes/utilities/utilities';
import * as SocketHandler from '@app/modules/socket-handler';
import { BonusService } from '@app/services/bonus.service/bonus.service';
import { BOARD_SIZE, GridService } from '@app/services/grid.service/grid.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;
export const WAIT_TIME = 3000;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    validWordsFormed: string[];
    dictionary: Dictionary;
    dictionaryTrie: Trie;
    words: string[];
    isTimerElapsed: boolean;
    areWordsValid: boolean;
    private socket: io.Socket;
    private readonly server: string;

    constructor(private readonly gridService: GridService, private bonusService: BonusService) {
        this.validWordsFormed = [];
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.dictionaryTrie = new Trie();
        this.dictionaryTrie.initializeDictionary();
        this.words = [];
        this.isTimerElapsed = false;
        this.areWordsValid = false;
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.socketOnConnect();
    }
    socketOnConnect() {
        this.socket.on('areWordsValid', (result: boolean) => {
            this.areWordsValid = result;
        });
        this.socket.on('newValidWords', (newWords: string[]) => {
            this.validWordsFormed = this.validWordsFormed.concat(newWords);
        });
    }
    updatePlayerScore(newWords: ScrabbleWord[], player: Player): void {
        const wordsValue = this.calculateScore(newWords);
        // Retirer lettres du board
        if (this.areWordsValid) {
            newWords.forEach((newWord) => {
                if (wordsValue === ERROR_NUMBER) {
                    newWord.content.forEach((letter) => {
                        this.gridService.removeSquare(letter.tile.position.x, letter.tile.position.y);
                    });
                } else {
                    player.score += wordsValue;
                    newWord.content.forEach((letter) => {
                        letter.tile.isValidated = true;
                    });
                    this.bonusService.useBonus(newWord);
                }
            });
        }
        this.isTimerElapsed = true;
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
            return ERROR_NUMBER;
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
    async validateWords(newWords: ScrabbleWord[], gameMode: GameType) {
        const strWords: string[] = [];
        newWords?.forEach((newWord) => {
            strWords.push(newWord.stringify().toLowerCase());
        });
        this.areWordsValid = false;
        let wordsHaveBeenValidated = false;
        let validationTimer: NodeJS.Timeout;
        if (gameMode === GameType.MultiPlayer) {
            // server validation
            return new Promise<boolean>((resolve) => {
                this.socket.emit('validateWords', strWords);

                this.socket.once('areWordsValid', (areWordsValid) => {
                    this.areWordsValid = areWordsValid;
                    wordsHaveBeenValidated = true;
                    if (areWordsValid) {
                        this.validWordsFormed = this.validWordsFormed.concat(strWords);
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
        } else {
            // local validation
            return new Promise<boolean>((resolve) => {
                this.areWordsValid = true;
                for (const word of strWords) {
                    if (!this.isWordValid(word)) {
                        this.areWordsValid = false;
                        break;
                    }
                }
                wordsHaveBeenValidated = true;
                // return true if words are valid, wait untill the end of timeout if not
                if (this.areWordsValid) {
                    this.validWordsFormed = this.validWordsFormed.concat(strWords);
                    resolve(this.areWordsValid);
                    clearTimeout(validationTimer);
                }

                validationTimer = setTimeout(() => {
                    if (!wordsHaveBeenValidated || !this.areWordsValid) {
                        resolve(this.areWordsValid);
                    }
                }, WAIT_TIME);
            });
        }
    }
    isWordValid(word: string): boolean {
        return this.dictionaryTrie.find(word) && word.length >= MIN_WORD_LENGHT && !word.includes('-') && !word.includes("'") ? true : false;
    }
}
