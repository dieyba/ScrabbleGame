/* eslint-disable max-lines */
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
import { VirtualPlayer } from '@app/classes/virtual-player';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { LetterStock } from './letter-stock.service';
import { PlaceService } from './place.service';
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
    // TODO: Addapt solo game service to local player instead of creator player (move attrib to gameParameters?)
    localPlayer: Player;
    timer: string;
    intervalValue: NodeJS.Timeout;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
        protected chatDisplayService: ChatDisplayService,
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
        protected placeService: PlaceService,
    ) {}
    initializeGame(gameInfo: FormGroup) {
        this.game = new GameParameters(gameInfo.controls.name.value, +gameInfo.controls.timer.value);
        this.chatDisplayService.entries = [];
        this.game.creatorPlayer = new LocalPlayer(gameInfo.controls.name.value);
        this.game.creatorPlayer.isActive = true;
        this.game.stock = new LetterStock();
        this.game.opponentPlayer = new VirtualPlayer(gameInfo.controls.opponent.value, gameInfo.controls.level.value);
        this.game.opponentPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.totalCountDown = +gameInfo.controls.timer.value;
        this.game.timerMs = +this.game.totalCountDown;
        this.game.dictionary = new Dictionary(+gameInfo.controls.dictionaryForm.value);
        this.game.randomBonus = gameInfo.controls.bonus.value;
        this.localPlayer = this.game.creatorPlayer;
    }
    createNewGame() {
        // Empty board and stack
        this.chatDisplayService.initialize(this.localPlayer.name);
        this.rackService.rackLetters = [];
        this.gridService.scrabbleBoard = new ScrabbleBoard();
        // this.addRackLetters(this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT));
        const tab = [
            this.game.stock.takeLetter('m'),
            this.game.stock.takeLetter('a'),
            this.game.stock.takeLetter('i'),
            this.game.stock.takeLetter('s'),
            this.game.stock.takeLetter('o'),
            this.game.stock.takeLetter('n'),
            this.game.stock.takeLetter('s'),
        ];
        this.addRackLetters(tab);
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
                this.resetTimer();
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
            // this.game.timerMs = +this.game.totalCountDown;
            // this.secondsToMinutes();
            // clearInterval(this.intervalValue);
            // this.startCountdown();
        } else {
            // If the rack is empty, end game + player won
            if (this.game.opponentPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
                this.game.opponentPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.opponentPlayer.isActive = false;
            this.game.creatorPlayer.isActive = true;
            // this.game.timerMs = +this.game.totalCountDown;
            // this.secondsToMinutes();
            // clearInterval(this.intervalValue);
            // this.startCountdown();
        }
    }

    resetTimer() {
        this.game.timerMs = +this.game.totalCountDown;
        this.secondsToMinutes();
        clearInterval(this.intervalValue);
        this.startCountdown();
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
            this.resetTimer();
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
                    lettersToRemove[i] = new ScrabbleLetter(letters[i]);
                }

                const lettersToAdd: ScrabbleLetter[] = this.game.stock.exchangeLetters(lettersToRemove);
                for (let i = 0; i < lettersToAdd.length; i++) {
                    this.rackService.removeLetter(lettersToRemove[i]);
                    this.addRackLetter(lettersToAdd[i]);
                    // player.letters[this.game.creatorPlayer.letters.length] = lettersToAdd[i];
                }
                this.passTurn(this.game.creatorPlayer);
                return ErrorType.NoError;
            }
        }
        return ErrorType.ImpossibleCommand;
    }

    getLettersSelected(): string {
        let letters = '';

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.rackService.exchangeSelected.length; i++) {
            if (this.rackService.exchangeSelected[i] === true) {
                letters += this.rackService.rackLetters[i].character;
                this.rackService.exchangeSelected[i] = false;
            }
        }
        return letters;
    }

    addRackLetters(letters: ScrabbleLetter[]): void {
        for (const letter of letters) {
            this.addRackLetter(letter);
        }
    }
    addRackLetter(letter: ScrabbleLetter): void {
        this.rackService.addLetter(letter);
        this.game.creatorPlayer.letters[this.game.creatorPlayer.letters.length] = letter;
        // this.localPlayer.letters[this.localPlayer.letters.length] = letter;
        // this.localPlayer.addLetter(letter);
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
        const errorResult = this.placeService.place(player, placeParams);

        if (errorResult === ErrorType.NoError) {
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
                    const removedLetters = this.gridService.removeInvalidLetters(
                        placeParams.position,
                        placeParams.word.length,
                        placeParams.orientation,
                    );
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
        }

        return errorResult;
    }
}
