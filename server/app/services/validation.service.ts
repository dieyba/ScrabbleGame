import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { GameParameters } from '@app/classes/game-parameters';
import { PlaceParams } from '@app/classes/place-parameters';
import { Player } from '@app/classes/player';
import { BOARD_SIZE, ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Axis } from '@app/classes/utilities';
import { Service } from 'typedi';
import { BonusService } from './bonus.service';
import { WordBuilderService } from './word-builder.service';

const BONUS_LETTER_COUNT = 7;
const BONUS_POINTS = 50;
export const WAIT_TIME = 3000;

@Service()
export class ValidationService {
    dictionary: Dictionary;
    words: string[];
    isTimerElapsed: boolean;

    constructor(private bonusService: BonusService, private wordBuilder: WordBuilderService) {
        this.dictionary = new Dictionary(DictionaryType.Default);
        this.words = [];
        this.isTimerElapsed = false;
    }

    place(player: Player, placeParams: PlaceParams, game: GameParameters): number {
        // Generate all words created
        let tempScrabbleWords: ScrabbleWord[];
        if (placeParams.orientation === 'h') {
            tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.H, game.scrabbleBoard);
        } else {
            tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.V, game.scrabbleBoard);
        }
        game.newWords = tempScrabbleWords;
        // Call validation method and end turn
        setTimeout(() => {
            if (!this.validateWords(game.newWords)) {
                // Not valid
                return -1;
            } else {
                // Score
                return this.updatePlayerScore(game, player);
                // Take new letters
            }
        }, WAIT_TIME);
        return ErrorType.NoError;
    }

    canPlaceWord(player: Player, placeParams: PlaceParams, scrabbleBoard: ScrabbleBoard): boolean {
        if (
            !scrabbleBoard.isWordInsideBoard(placeParams.word, placeParams.position, placeParams.orientation) ||
            (!scrabbleBoard.isWordPassingInCenter(placeParams.word, placeParams.position, placeParams.orientation) &&
                !scrabbleBoard.isWordPartOfAnotherWord(placeParams.word, placeParams.position, placeParams.orientation) &&
                !scrabbleBoard.isWordTouchingOtherWord(placeParams.word, placeParams.position, placeParams.orientation)) ||
            !player.isActive
        ) {
            return false;
        }
        return true;
    }

    updatePlayerScore(game: GameParameters, player: Player): void {
        const wordsValue = this.calculateScore(game.newWords, game.scrabbleBoard);
        player.score += wordsValue;
        // Retirer lettres du board
        setTimeout(() => {
            if (this.validateWords(game.newWords)) {
                game.newWords.forEach((newWord) => {
                    if (wordsValue === 0) {
                        // Not valid, remove letter from board and place back on rack
                    } else {
                        // if change the isvalidated = true here, change how its used in solo game service
                        this.bonusService.useBonus(newWord, game.scrabbleBoard);
                    }
                });
            }
            this.isTimerElapsed = true; // TODO: ca va ou ca?
        }, WAIT_TIME);
    }

    calculateScore(newWords: ScrabbleWord[], scrabbleBoard: ScrabbleBoard): number {
        let totalScore = 0;

        // Adding total score for each new word
        for (const word of newWords) {
            word.value = this.bonusService.totalValue(word, scrabbleBoard);
            totalScore += word.value;
        }

        if (this.newLettersCount(scrabbleBoard) === BONUS_LETTER_COUNT) {
            // Add 50 points to player's score
            totalScore += BONUS_POINTS;
        } else if (this.newLettersCount(scrabbleBoard) > BONUS_LETTER_COUNT) {
            return 0;
        }
        return totalScore;
    }

    validateWords(newWords: ScrabbleWord[]): boolean {
        for (let i = 0; i < newWords.length; i++) {
            this.words[i] = this.convertScrabbleWordToString(newWords[i].content);
            // Word not valid, validation fails3
            if (!this.isWordValid(this.words[i])) {
                return false;
            } else {
                // Word was valid, set its letters as validated
                newWords[i].content.forEach((letter) => {
                    letter.tile.isValidated = true;
                });
            }
        }
        return true;
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

    newLettersCount(scrabbleBoard: ScrabbleBoard): number {
        let newLetters = 0;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (scrabbleBoard.squares[i][j].occupied === true && scrabbleBoard.squares[i][j].isValidated === false) {
                    newLetters++;
                }
            }
        }
        return newLetters;
    }
}
