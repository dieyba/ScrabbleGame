import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Dictionary } from '@app/classes/dictionary';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleRack } from '@app/classes/scrabble-rack';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { ErrorType } from '../classes/errors';
import { Vec2 } from '../classes/vec2';
import { GridService } from './grid.service';
import { LetterStock } from './letter-stock.service';
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
        this.rackService.scrabbleRack = new ScrabbleRack();
        this.gridService.scrabbleBoard = new ScrabbleBoard();
        this.drawRackLetters();
        console.log('local player letters :', this.localPlayer.letters);
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
        let isLocalPlayerActive = this.localPlayer.isActive;
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


    place(position: Vec2, orientation: string, letters: string): ErrorType {
        if (this.localPlayer.isActive) {
            console.log("Placing letters...");
            return ErrorType.NoError;
        } return ErrorType.ImpossibleCommand
    }

    debug(): ErrorType {
        if (this.localPlayer.isActive) {
            console.log('Changing debug state...');
            return ErrorType.NoError;
        }
        return ErrorType.ImpossibleCommand;
    }

    exchangeLetters(letters: string): ErrorType {
        console.log('local player letters dans méthode :', this.localPlayer.letters);
        if (this.localPlayer.isActive && this.stock.letterStock.length > 7) {
            console.log('Exchanging these letters:' + letters + " ...");
            let lettersToRemove: ScrabbleLetter[] = [];
            if (this.localPlayer.removeLetter(letters) == true) {
                // Ajouter la fonction qui enleve les lettres de la vue

                for (let i: number = 0; i < letters.length; i++) {
                    lettersToRemove[i] = new ScrabbleLetter(letters[i], 1);
                }

                let lettersToAdd: ScrabbleLetter[] = this.stock.exchangeLetters(lettersToRemove);
                for (let i: number = 0; i < lettersToAdd.length; i++) {
                    this.localPlayer.addLetter(lettersToAdd[i]);
                    this.rackService.drawLetter(lettersToAdd[i]);
                    console.log("letters to add :", lettersToAdd);
                }
                return ErrorType.NoError;
            }
            console.log("LETTERS TO REMOVE : ", lettersToRemove);
        }
        return ErrorType.ImpossibleCommand;
    }


    drawRackLetters(): void {
        for (let i: number = 0; i < DEFAULT_LETTER_COUNT; i++) {
            this.rackService.drawLetter(this.localPlayer.letters[i]);
        }
    }
}
