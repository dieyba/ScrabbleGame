import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlaceParams } from '@app/classes/commands';
import { Dictionary } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { ValidationService, WAIT_TIME } from './validation.service';
import { WordBuilderService } from './word-builder.service';

export const TIMER_INTERVAL = 1000;
export const DEFAULT_LETTER_COUNT = 7;
const DOUBLE_DIGIT = 10;
const MINUTE_IN_SEC = 60;
const MAX_TURNS_PASSED = 6;

@Injectable({
    providedIn: 'root',
})
export class SoloGameService {
    game: GameParameters;
    timer: string;
    intervalValue: NodeJS.Timeout;
    id: number = 0;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
        protected chatDisplayService: ChatDisplayService,
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
    ) {}

    initializeGame(gameInfo: FormGroup) {
        this.game = new GameParameters(gameInfo.controls.name.value, +gameInfo.controls.timer.value);
        this.chatDisplayService.entries = [];
        this.game.creatorPlayer = new LocalPlayer(gameInfo.controls.name.value);
        this.game.creatorPlayer.isActive = true;
        this.game.opponentPlayer = new VirtualPlayer(gameInfo.controls.opponent.value, gameInfo.controls.level.value);
        this.game.opponentPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.totalCountDown = +gameInfo.controls.timer.value;
        this.game.timerMs = +this.game.totalCountDown;
        this.game.dictionary = new Dictionary(+gameInfo.controls.dictionaryForm.value);
        this.game.randomBonus = gameInfo.controls.bonus.value;
    }
    createNewGame() {
        // Empty board and stack
        this.rackService.rackLetters = [];
        this.gridService.scrabbleBoard = new ScrabbleBoard();
        this.addRackLetters(this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT));
        this.startCountdown();
        this.game.hasTurnsBeenPassed[0] = false;
    }
    startCountdown() {
        this.secondsToMinutes();
        this.intervalValue = setInterval(() => {
            this.game.timerMs--;
            if (this.game.timerMs < 0) {
                this.game.timerMs = 0;
                this.secondsToMinutes();
                this.changeActivePlayer();
            }
            this.secondsToMinutes();
        }, TIMER_INTERVAL);
    }
    secondsToMinutes() {
        const s = Math.floor(this.game.timerMs / MINUTE_IN_SEC);
        const ms = this.game.timerMs % MINUTE_IN_SEC;
        if (ms < DOUBLE_DIGIT) {
            this.timer = s + ':' + 0 + ms;
        } else {
            this.timer = s + ':' + ms;
        }
    }
    // New Turn
    changeActivePlayer() {
        // Check if last turn was passed by player
        if (this.game.turnPassed) {
            this.game.hasTurnsBeenPassed[this.game.hasTurnsBeenPassed.length] = false;
            // Set last turn to hasBeenPassed = true
            this.game.hasTurnsBeenPassed[this.game.hasTurnsBeenPassed.length - 1] = true;
        } else {
            this.game.hasTurnsBeenPassed[this.game.hasTurnsBeenPassed.length] = false;
        }

        // Change active player and reset timer for new turn
        const isLocalPlayerActive = this.game.creatorPlayer.isActive;
        if (isLocalPlayerActive) {
            // If the rack is empty, end game + player won
            if (this.game.creatorPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
                this.game.creatorPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.creatorPlayer.isActive = false;
            this.game.opponentPlayer.isActive = true;
            this.game.timerMs = +this.game.totalCountDown;
            this.secondsToMinutes();
            clearInterval(this.intervalValue);
            this.startCountdown();
        } else {
            // If the rack is empty, end game + player won
            if (this.game.opponentPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
                this.game.opponentPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.opponentPlayer.isActive = false;
            this.game.creatorPlayer.isActive = true;
            this.game.timerMs = +this.game.totalCountDown;
            this.secondsToMinutes();
            clearInterval(this.intervalValue);
            this.startCountdown();
        }
    }
    passTurn(player: Player) {
        if (player.isActive) {
            this.game.turnPassed = true;
            if (this.isTurnsPassedLimit() && this.game.hasTurnsBeenPassed.length >= MAX_TURNS_PASSED) {
                this.endGame();
                return ErrorType.NoError;
            }
            this.game.timerMs = 0;
            this.secondsToMinutes();
            this.changeActivePlayer();
            this.game.turnPassed = false;
            return ErrorType.NoError;
        }
        return ErrorType.ImpossibleCommand;
    }
    // Check if last 5 turns have been passed (current turn is the 6th)
    isTurnsPassedLimit(): boolean {
        let isLimit = true;
        for (let i = this.game.hasTurnsBeenPassed.length - 1; i > this.game.hasTurnsBeenPassed.length - MAX_TURNS_PASSED; i--) {
            isLimit = isLimit && this.game.hasTurnsBeenPassed[i];
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
        if (player.isActive && this.game.stock.letterStock.length > DEFAULT_LETTER_COUNT) {
            const lettersToRemove: ScrabbleLetter[] = [];
            if (player.removeLetter(letters) === true) {
                for (let i = 0; i < letters.length; i++) {
                    lettersToRemove[i] = new ScrabbleLetter(letters[i], 1);
                }

                const lettersToAdd: ScrabbleLetter[] = this.game.stock.exchangeLetters(lettersToRemove);
                for (let i = 0; i < lettersToAdd.length; i++) {
                    player.addLetter(lettersToAdd[i]);
                    this.rackService.removeLetter(lettersToRemove[i]);
                    this.addRackLetter(lettersToAdd[i]);
                }
                this.passTurn(this.game.creatorPlayer);
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
        this.game.creatorPlayer.letters[this.game.creatorPlayer.letters.length] = letter;
    }
    removeRackLetter(scrabbleLetter: ScrabbleLetter): void {
        const i = this.rackService.removeLetter(scrabbleLetter);
        this.game.creatorPlayer.letters.splice(i, 1);
    }
    endGame() {
        this.chatDisplayService.addEndGameMessage(this.game.stock.letterStock, this.game.creatorPlayer, this.game.opponentPlayer);

        const localPlayerPoints = this.calculateRackPoints(this.game.creatorPlayer);
        const virtualPlayerPoints = this.calculateRackPoints(this.game.opponentPlayer);

        if (this.game.creatorPlayer.isWinner === true) {
            this.game.creatorPlayer.score += virtualPlayerPoints;
            this.game.opponentPlayer.score -= virtualPlayerPoints;
        } else if (this.game.opponentPlayer.isWinner === true) {
            this.game.opponentPlayer.score += localPlayerPoints;
            this.game.creatorPlayer.score -= localPlayerPoints;
        } else {
            this.game.creatorPlayer.score -= localPlayerPoints;
            this.game.opponentPlayer.score -= virtualPlayerPoints;
        }
        clearInterval(this.intervalValue);
        this.game.timerMs = 0;
        this.secondsToMinutes();
        // Show message in sidebar and end of game info in communication box
        this.game.isEndGame = true;
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
        // if the command has the right syntax but not the player's turn, should return impossible command error
        if (!player.isActive) {
            return ErrorType.ImpossibleCommand;
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
                const newLetters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
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
