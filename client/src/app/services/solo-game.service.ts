import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlaceParams } from '@app/classes/commands';
import { Dictionary } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { LetterStock } from '@app/services/letter-stock.service';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { ValidationService, WAIT_TIME } from './validation.service';
import { WordBuilderService } from './word-builder.service';
export const TIMER_INTERVAL = 1000;
const DEFAULT_LETTER_COUNT = 7;
const DOUBLE_DIGIT = 10;
const MINUTE_IN_SEC = 60;
const MAX_TURNS_PASSED = 6;

@Injectable({
    providedIn: 'root',
})
export class SoloGameService {
    localPlayer: LocalPlayer;
    virtualPlayer: VirtualPlayer;
    totalCountDown: number;
    dictionary: Dictionary;
    randomBonus: boolean;
    timer: string;
    timerMs: number;
    stock: LetterStock = new LetterStock();
    intervalValue: NodeJS.Timeout;
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;
    constructor(
        private gridService: GridService,
        private rackService: RackService,
        private chatDisplayService: ChatDisplayService,
        private validationService: ValidationService,
        private wordBuilder: WordBuilderService,
    ) {
        this.hasTurnsBeenPassed = [];
        this.turnPassed = false;
        this.isEndGame = false;
    }
    initializeGame(gameInfo: FormGroup) {
        this.localPlayer = new LocalPlayer(gameInfo.controls.name.value);
        this.localPlayer.isActive = true;
        this.chatDisplayService.initialize(this.localPlayer.name);
        this.virtualPlayer = new VirtualPlayer(gameInfo.controls.opponent.value, gameInfo.controls.level.value);
        this.virtualPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.totalCountDown = +gameInfo.controls.timer.value;
        this.timerMs = +this.totalCountDown;
        this.dictionary = new Dictionary(+gameInfo.controls.dictionaryForm.value);
        this.randomBonus = gameInfo.controls.bonus.value;
        this.isEndGame = false;
        this.stock = new LetterStock();
    }
    createNewGame() {
        // Empty board and stack
        this.rackService.rackLetters = [];
        this.gridService.scrabbleBoard = new ScrabbleBoard();
        this.addRackLetters(this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT));
        this.startCountdown();
        this.hasTurnsBeenPassed[0] = false;
    }
    startCountdown() {
        this.secondsToMinutes();
        this.intervalValue = setInterval(() => {
            this.timerMs--;
            if (this.timerMs < 0) {
                this.timerMs = 0;
                this.secondsToMinutes();
                this.changeActivePlayer();
            }
            this.secondsToMinutes();
        }, TIMER_INTERVAL);
    }
    secondsToMinutes() {
        const s = Math.floor(this.timerMs / MINUTE_IN_SEC);
        const ms = this.timerMs % MINUTE_IN_SEC;
        if (ms < DOUBLE_DIGIT) {
            this.timer = s + ':' + 0 + ms;
        } else {
            this.timer = s + ':' + ms;
        }
    }
    // New Turn
    changeActivePlayer() {
        // Check if last turn was passed by player
        if (this.turnPassed) {
            this.hasTurnsBeenPassed[this.hasTurnsBeenPassed.length] = false;
            // Set last turn to hasBeenPassed = true
            this.hasTurnsBeenPassed[this.hasTurnsBeenPassed.length - 1] = true;
        } else {
            this.hasTurnsBeenPassed[this.hasTurnsBeenPassed.length] = false;
        }

        // Change active player and reset timer for new turn
        const isLocalPlayerActive = this.localPlayer.isActive;
        if (isLocalPlayerActive) {
            // If the rack is empty, end game + player won
            if (this.localPlayer.letters.length === 0 && this.stock.isEmpty()) {
                this.localPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.localPlayer.isActive = false;
            this.virtualPlayer.isActive = true;
            this.timerMs = +this.totalCountDown;
            this.secondsToMinutes();
            clearInterval(this.intervalValue);
            this.startCountdown();
        } else {
            // If the rack is empty, end game + player won
            if (this.virtualPlayer.letters.length === 0 && this.stock.isEmpty()) {
                this.virtualPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.virtualPlayer.isActive = false;
            this.localPlayer.isActive = true;
            this.timerMs = +this.totalCountDown;
            this.secondsToMinutes();
            clearInterval(this.intervalValue);
            this.startCountdown();
        }
    }
    passTurn(player: Player) {
        if (player.isActive) {
            this.turnPassed = true;
            if (this.isTurnsPassedLimit() && this.hasTurnsBeenPassed.length >= MAX_TURNS_PASSED) {
                this.endGame();
                return ErrorType.NoError;
            }
            this.timerMs = 0;
            this.secondsToMinutes();
            this.changeActivePlayer();
            this.turnPassed = false;
            return ErrorType.NoError;
        }
        return ErrorType.ImpossibleCommand;
    }
    // Check if last 5 turns have been passed (current turn is the 6th)
    isTurnsPassedLimit(): boolean {
        let isLimit = true;
        for (let i = this.hasTurnsBeenPassed.length - 1; i > this.hasTurnsBeenPassed.length - MAX_TURNS_PASSED; i--) {
            isLimit = isLimit && this.hasTurnsBeenPassed[i];
        }
        return isLimit;
    }
    drawRack(newWords: ScrabbleWord[]): void {
        newWords.forEach((newWord) => {
            for (let j = 0; j < newWord.content.length; j++) {
                if (newWord.orientation === Axis.V) {
                    if (this.gridService.scrabbleBoard.squares[newWord.startPosition.x][newWord.startPosition.y + j].isValidated !== true) {
                        this.addRackLetter(newWord.content[j]);
                    }
                }
                if (newWord.orientation === Axis.H) {
                    if (this.gridService.scrabbleBoard.squares[newWord.startPosition.x + j][newWord.startPosition.y].isValidated !== true) {
                        this.addRackLetter(newWord.content[j]);
                    }
                }
            }
        });
    }
    exchangeLetters(player: Player, letters: string): ErrorType {
        if (player.isActive && this.stock.letterStock.length > DEFAULT_LETTER_COUNT) {
            const lettersToRemove: ScrabbleLetter[] = [];
            if (player.removeLetter(letters) === true) {
                for (let i = 0; i < letters.length; i++) {
                    lettersToRemove[i] = new ScrabbleLetter(letters[i], 1);
                }

                const lettersToAdd: ScrabbleLetter[] = this.stock.exchangeLetters(lettersToRemove);
                for (let i = 0; i < lettersToAdd.length; i++) {
                    player.addLetter(lettersToAdd[i]);
                    this.rackService.removeLetter(lettersToRemove[i]);
                    this.addRackLetter(lettersToAdd[i]);
                }
                this.passTurn(this.localPlayer);
                return ErrorType.NoError;
            }
        }
        return ErrorType.ImpossibleCommand;
    }
    addRackLetters(letters: ScrabbleLetter[]): void {
        for (const letter of letters) {
            this.addRackLetter(letter);
        }
    }
    addRackLetter(letter: ScrabbleLetter): void {
        this.rackService.addLetter(letter);
        this.localPlayer.letters[this.localPlayer.letters.length] = letter;
    }
    removeRackLetter(scrabbleLetter: ScrabbleLetter): void {
        const i = this.rackService.removeLetter(scrabbleLetter);
        this.localPlayer.letters.splice(i, 1);
    }
    endGame() {
        this.chatDisplayService.addEndGameMessage(this.stock.letterStock, this.localPlayer, this.virtualPlayer);

        const localPlayerPoints = this.calculateRackPoints(this.localPlayer);
        const virtualPlayerPoints = this.calculateRackPoints(this.virtualPlayer);

        if (this.localPlayer.isWinner === true) {
            this.localPlayer.score += virtualPlayerPoints;
            this.virtualPlayer.score -= virtualPlayerPoints;
        } else if (this.virtualPlayer.isWinner === true) {
            this.virtualPlayer.score += localPlayerPoints;
            this.localPlayer.score -= localPlayerPoints;
        } else {
            this.localPlayer.score -= localPlayerPoints;
            this.virtualPlayer.score -= virtualPlayerPoints;
        }
        clearInterval(this.intervalValue);
        this.timerMs = 0;
        this.secondsToMinutes();
        // Show message in sidebar and end of game info in communication box
        this.isEndGame = true;
    }
    calculateRackPoints(player: Player): number {
        let totalValue = 0;
        player.letters.forEach((letter) => {
            totalValue += letter.value;
        });
        return totalValue;
    }
    place(player: Player, placeParams: PlaceParams): ErrorType {
        const tempCoord = new Vec2();
        // Checking if its player's turn
        if (!this.canPlaceWord(player, placeParams)) {
            return ErrorType.SyntaxError;
        }
        // Removing all the letters from my "word" that are already on the board
        let wordCopy = placeParams.word;
        const letterOnBoard = this.gridService.scrabbleBoard.getStringFromCoord(
            placeParams.position,
            placeParams.word.length,
            placeParams.orientation,
        );
        for (const letter of letterOnBoard) {
            wordCopy = wordCopy.replace(letter.toLowerCase(), '');
        }
        // All letter are already placed
        if (wordCopy === '') {
            return ErrorType.SyntaxError;
        }
        // Checking if the rest of the letters are on the rack
        for (const letter of player.letters) {
            // If there is an star, removing a upper letter from "word" string
            if (letter.character === '*') {
                let upperLetter = '';
                for (const wordLetter of wordCopy) {
                    if (wordLetter === wordLetter.toUpperCase()) {
                        upperLetter = wordLetter;
                    }
                }
                wordCopy = wordCopy.replace(upperLetter, '');
            } else {
                wordCopy = wordCopy.replace(letter.character, '');
            }
        }
        // There should be no letters left, else there is not enough letter on the rack to place de "word"
        if (wordCopy !== '') {
            return ErrorType.SyntaxError;
        }
        // Placing letters
        tempCoord.clone(placeParams.position);
        for (const letter of placeParams.word) {
            if (!this.gridService.scrabbleBoard.squares[tempCoord.x][tempCoord.y].occupied) {
                // Taking letter from player and placing it
                this.placeLetter(player.letters, letter, tempCoord);
            }
            if (placeParams.orientation === 'h') {
                tempCoord.x++;
            } else {
                tempCoord.y++;
            }
        }
        // Generate all words created
        let tempScrabbleWords: ScrabbleWord[];
        if (placeParams.orientation === 'h') {
            tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.H);
        } else {
            tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.V);
        }
        // Call validation method and end turn
        setTimeout(() => {
            if (!this.validationService.validateWords(tempScrabbleWords)) {
                // Retake letters
                const removedLetters = this.gridService.removeInvalidLetters(placeParams.position, placeParams.word.length, placeParams.orientation);
                this.addRackLetters(removedLetters);
            } else {
                // Score
                this.validationService.updatePlayerScore(tempScrabbleWords, player);
                // Take new letters
                const newLetters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
                for (const letter of newLetters) {
                    this.rackService.addLetter(letter);
                    player.letters.push(letter);
                }
            }

            this.passTurn(player);
        }, WAIT_TIME);
        return ErrorType.NoError;
    }
    placeLetter(playerLetters: ScrabbleLetter[], letter: string, position: Vec2) {
        // Position already occupied
        if (this.gridService.scrabbleBoard.squares[position.x][position.y].occupied) {
            return;
        }
        // Making a temporary letter and checking if "*" is needed (for upper cases)
        let tempLetter = letter;
        if (tempLetter === tempLetter.toUpperCase()) {
            tempLetter = '*';
        }
        for (let i = 0; i < playerLetters.length; i++) {
            if (playerLetters[i].character === tempLetter) {
                if (letter === letter.toUpperCase()) {
                    playerLetters[i].character = letter;
                }
                playerLetters[i].tile = this.gridService.scrabbleBoard.squares[position.x][position.y];
                this.gridService.drawLetter(playerLetters[i], position.x, position.y);
                this.rackService.removeLetter(playerLetters[i]);
                playerLetters.splice(i, 1);
                break;
            }
        }
    }
    canPlaceWord(player: Player, placeParams: PlaceParams): boolean {
        if (
            !this.gridService.scrabbleBoard.isWordInsideBoard(placeParams.word, placeParams.position, placeParams.orientation) ||
            (!this.gridService.scrabbleBoard.isWordPassingInCenter(placeParams.word, placeParams.position, placeParams.orientation) &&
                !this.gridService.scrabbleBoard.isWordPartOfAnotherWord(placeParams.word, placeParams.position, placeParams.orientation) &&
                !this.gridService.scrabbleBoard.isWordTouchingOtherWord(placeParams.word, placeParams.position, placeParams.orientation)) ||
            !player.isActive
        ) {
            return false;
        }
        return true;
    }
}
