import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { Player } from '@app/classes/player';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Service } from 'typedi';
import { BonusService } from './bonus.service';
import { BOARD_SIZE, GridService } from './grid.service';


const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;
export const WAIT_TIME = 3000;


@Service()
export class ValidationService {
    dictionary: Dictionary;
    isTimerElapsed: boolean;
    words: string[];
    areWordsValid: boolean;
    private socket: io.Socket;
    private readonly server: string;

    constructor(private readonly gridService: GridService, private bonusService: BonusService) {
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.words = [];
        this.isTimerElapsed = false;
        // this.server = 'http://' + window.location.hostname + ':3000';
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.areWordsValid = false;
        this.areWordsValid = false;
    }

    // TODO: chose if want to work with areWordsValid or just return answer (or both ig)
    validateWords(newWords: string[]): boolean {
        // Word not valid, validation fails
        for (const word of newWords) {
            if (!this.isWordValid(word)) {
                this.areWordsValid = false;
                return false;
            }
        }
        this.areWordsValid = true;
        return true;
    }

    isWordValid(word: string): boolean {
        return this.dictionary.words.includes(word) && word.length >= 2 && !word.includes('-') && !word.includes("'") ? true : false;
    }

    updatePlayerScore(newWords: ScrabbleWord[], player: Player): void {
        const wordsValue = this.calculateScore(newWords);
        // Retirer lettres du board
        setTimeout(() => {
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
                        // if change the isvalidated = true here, change how its used in solo game service
                        this.bonusService.useBonus(newWord);
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
}
