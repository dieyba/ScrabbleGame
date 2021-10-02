import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExchangeParams, PlaceParams } from '@app/classes/commands';
import { Dictionary } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { LetterStock } from '@app/classes/letter-stock';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { Vec2 } from '@app/classes/vec2';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';
const TIMER_INTERVAL = 1000;
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
        this.virtualPlayer = new VirtualPlayer(gameInfo.controls.opponent.value, gameInfo.controls.level.value);
        this.virtualPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.totalCountDown = +gameInfo.controls.timer.value;
        this.timerMs = +this.totalCountDown;
        this.dictionary = new Dictionary(+gameInfo.controls.dictionaryForm.value);
        this.randomBonus = gameInfo.controls.bonus.value;
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
        clearInterval(this.intervalValue);
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
            if (this.localPlayer.letters.length === 0) {
                this.localPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.localPlayer.isActive = false;
            this.virtualPlayer.isActive = true;
            this.timerMs = +this.totalCountDown;
            this.secondsToMinutes();
            this.startCountdown();
        } else {
            // If the rack is empty, end game + player won
            if (this.virtualPlayer.letters.length === 0) {
                this.virtualPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.virtualPlayer.isActive = false;
            this.localPlayer.isActive = true;
            this.timerMs = +this.totalCountDown;
            this.secondsToMinutes();
            this.startCountdown();
        }
    }

    passTurn() {
        if (/* this.localPlayer.isActive*/ true) {
            this.turnPassed = true;
            if (this.isTurnsPassedLimit() && this.hasTurnsBeenPassed.length >= MAX_TURNS_PASSED) {
                this.endGame();
            }
            this.turnPassed = false;
            this.timerMs = 0;
            this.secondsToMinutes();
            this.changeActivePlayer();
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

    exchangeLetters(player: Player, letters: ExchangeParams): ErrorType {
        if (this.localPlayer.isActive) {
            console.log('Exchanging these letters:' + letters + ' ...'); // eslint-disable-line no-console
            return ErrorType.NoError;
        }
        return ErrorType.ImpossibleCommand;
    }

    addRackLetters(letters: ScrabbleLetter[]): void {
        for (let i = 0; i < DEFAULT_LETTER_COUNT; i++) {
            this.addRackLetter(letters[i]);
        }
    }

    addRackLetter(letter: ScrabbleLetter): void {
        this.rackService.addLetter(letter);
        this.localPlayer.letters[this.localPlayer.letters.length] = letter;
    }

    removeLetter(scrabbleLetter: ScrabbleLetter): void {
        const i = this.rackService.removeLetter(scrabbleLetter);
        this.localPlayer.letters.splice(i, 1);
    }

    endGame() {
        clearInterval(this.intervalValue);
        this.timerMs = 0;
        this.secondsToMinutes();
        const localPlayerPoints = this.calculateRackPoints(this.localPlayer);
        const virtualPlayerPoints = this.calculateRackPoints(this.virtualPlayer);

        if (this.localPlayer.isWinner === true) {
            this.localPlayer.score += virtualPlayerPoints;
            this.virtualPlayer.score -= virtualPlayerPoints;
        } else if (this.virtualPlayer.isWinner === true) {
            this.virtualPlayer.isWinner = true;
            this.virtualPlayer.score += localPlayerPoints;
            this.localPlayer.score -= localPlayerPoints;
        } else {
            this.localPlayer.score -= localPlayerPoints;
            this.virtualPlayer.score -= virtualPlayerPoints;
        }
        this.isEndGame = true;
        // Show message in sidebar
        // Show end of game info in communication box
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
        let wordCopy = placeParams.word.toLowerCase();
        const letterOnBoard = this.gridService.scrabbleBoard.getStringFromCoord(
            placeParams.position,
            placeParams.word.length,
            placeParams.orientation,
        );

        for (const letter of letterOnBoard) {
            wordCopy = wordCopy.replace(letter, '');
        }

        // All letter are already placed
        if (wordCopy === '') {
            return ErrorType.SyntaxError;
        }

        // Checking if the rest of the letters are on the rack
        for (const letter of player.letters) {
            wordCopy = wordCopy.replace(letter.character, '');
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
            tempScrabbleWords = this.wordBuilder.buildWordOnBoard(placeParams.word, placeParams.position, WordOrientation.Horizontal);
        } else {
            tempScrabbleWords = this.wordBuilder.buildWordOnBoard(placeParams.word, placeParams.position, WordOrientation.Vertical);
        }
        console.log(tempScrabbleWords);

        // Call validation method and end turn
        if (this.validationService.validateWordsAndCalculateScore(tempScrabbleWords) === 0) {
            // Retake lettres
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

        this.passTurn();
        this.passTurn();

        // TODO Optional : update la vue de ScrabbleLetter automatically
        return ErrorType.NoError; // TODO change to "no error"
    }

    placeLetter(playerLetters: ScrabbleLetter[], letter: string, position: Vec2) {
        // Position already occupied
        if (this.gridService.scrabbleBoard.squares[position.x][position.y].occupied) {
            return;
        }

        for (let i = 0; i < playerLetters.length; i++) {
            if (playerLetters[i].character === letter) {
                this.gridService.drawLetter(playerLetters[i], position.x, position.y);
                this.rackService.removeLetter(playerLetters[i]);
                playerLetters.splice(i, 1);
                return;
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
