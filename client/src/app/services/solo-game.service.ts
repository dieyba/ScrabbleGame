import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Dictionary } from '@app/classes/dictionary';
import { LetterStock } from '@app/classes/letter-stock';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleRack } from '@app/classes/scrabble-rack';
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
        this.timerMs = 0;
        this.secondsToMinutes();
        clearInterval(this.intervalValue);
        this.changeActivePlayer();
    }

    drawRackLetters(): void {
        for (let i: number = 0; i < DEFAULT_LETTER_COUNT; i++) {
            this.rackService.drawLetter(this.localPlayer.letters[i]);
        }
    }
}
