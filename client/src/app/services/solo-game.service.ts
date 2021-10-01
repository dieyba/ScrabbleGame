import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlaceParams } from '@app/classes/commands';
import { Dictionary } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { LetterStock } from '@app/classes/letter-stock';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleRack } from '@app/classes/scrabble-rack';
import { Vec2 } from '@app/classes/vec2';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { GridService } from './grid.service';
import { RackService } from './rack.service';

const TIMER_INTERVAL = 1000;
const DEFAULT_LETTER_COUNT = 7;
const DOUBLE_DIGIT = 10;
const MINUTE_IN_SEC = 60;

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

    constructor(private gridService: GridService, private rackService: RackService) {}

    initializeGame(gameInfo: FormGroup) {
        this.localPlayer = new LocalPlayer(gameInfo.controls.name.value);
        this.localPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
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
        this.rackService.scrabbleRack = new ScrabbleRack();
        this.gridService.scrabbleBoard = new ScrabbleBoard();
        this.drawRackLetters();
        this.startCountdown();
    }

    startCountdown() {
        this.secondsToMinutes();
        this.intervalValue = setInterval(() => {
            this.timerMs--;
            if (this.timerMs < 0) {
                this.timerMs = 0;
                this.secondsToMinutes();
                clearInterval(this.intervalValue);
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

    changeActivePlayer() {
        const isLocalPlayerActive = this.localPlayer.isActive;
        if (isLocalPlayerActive) {
            this.localPlayer.isActive = false;
            this.virtualPlayer.isActive = true;
            this.timerMs = +this.totalCountDown;
            this.secondsToMinutes();
            this.startCountdown();
        } else {
            this.virtualPlayer.isActive = false;
            this.localPlayer.isActive = true;
            this.timerMs = +this.totalCountDown;
            this.secondsToMinutes();
            this.startCountdown();
        }
    }

    passTurn() {
        if (this.localPlayer.isActive) {
            this.timerMs = 0;
            this.secondsToMinutes();
            clearInterval(this.intervalValue);
            this.changeActivePlayer();
            return ErrorType.NoError;
        }
        return ErrorType.ImpossibleCommand;
    }

    exchangeLetters(letters: string): ErrorType {
        if (this.localPlayer.isActive) {
            console.log('Exchanging these letters:' + letters + ' ...'); // eslint-disable-line no-console
            return ErrorType.NoError;
        }
        return ErrorType.ImpossibleCommand;
    }

    drawRackLetters(): void {
        for (let i = 0; i < DEFAULT_LETTER_COUNT; i++) {
            this.rackService.drawLetter(this.localPlayer.letters[i]);
        }
    }

    place(player: Player, placeParams: PlaceParams): ErrorType {
        // Checking if its player's turn
        if (!player.isActive) {
            return ErrorType.SyntaxError;
        }

        // Checking if the whole word is inside the board
        if (!this.gridService.scrabbleBoard.isWordInsideBoard(placeParams.word, placeParams.position, placeParams.orientation)) {
            return ErrorType.SyntaxError;
        }

        // Checking if the word is touching another word or passing through the middle
        if (
            !this.gridService.scrabbleBoard.isWordPassingInCenter(placeParams.word, placeParams.position, placeParams.orientation) &&
            !this.gridService.scrabbleBoard.isWordPartOfAnotherWord(placeParams.word, placeParams.position, placeParams.orientation) &&
            !this.gridService.scrabbleBoard.isWordTouchingOtherWord(placeParams.word, placeParams.position, placeParams.orientation)
        ) {
            return ErrorType.SyntaxError;
        }

        // Removing all the letters from my "word" that are already on the board
        const wordCopy = placeParams.word.toLowerCase();
        const letterOnBoard = this.gridService.scrabbleBoard.getStringFromCoord(
            placeParams.position,
            placeParams.word.length,
            placeParams.orientation,
        );
        for (const letter of letterOnBoard) {
            wordCopy.replace(letter, '');
        }

        // All letter are already placed
        if (wordCopy === '') {
            return ErrorType.SyntaxError;
        }

        // Checking if the rest of the letters are on the rack
        for (const letter of player.letters) {
            wordCopy.replace(letter.character, '');
        }

        // There should be no letters left, else there is not enough letter on the rack to place de "word"
        if (wordCopy !== '') {
            return ErrorType.SyntaxError;
        }

        // Placing letters
        const tempCoord = new Vec2(placeParams.position.x, placeParams.position.y);
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

        // TODO Generate all words created

        // TODO Call validation method and end turn
        // Take letters??

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
}
