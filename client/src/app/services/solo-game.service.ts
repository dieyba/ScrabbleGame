import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from '@app/classes/dictionary';
import { LetterStock } from '@app/classes/letter-stock';
import { LocalPlayer } from '@app/classes/local-player';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { NewTurnComponent } from '@app/components/new-turn/new-turn.component';
import { GridService } from './grid.service';
import { RackService } from './rack.service';

const TIMER_INTERVAL = 1000;
const DEFAULT_LETTER_COUNT = 7;

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

    constructor(private gridService: GridService, private rackService: RackService, public dialog: MatDialog) {}

    initializeGame(gameInfo: FormGroup) {
        this.localPlayer = new LocalPlayer(gameInfo.controls.name.value);
        this.localPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.localPlayer.isActive = true;
        this.virtualPlayer = new VirtualPlayer(gameInfo.controls.opponent.value, gameInfo.controls.level.value);
        this.virtualPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.totalCountDown = +gameInfo.controls.timer.value;
        this.timerMs = +this.totalCountDown;
        this.dictionary = new Dictionary(gameInfo.controls.dictionaryForm.value);
        this.randomBonus = gameInfo.controls.bonus.value;
    }

    createNewGame() {
        this.rackService.clearRack();
        this.gridService.clearBoard();
        this.drawRackLetters();
        this.openDialog();
    }

    startCountdown() {
        this.secondsToMinutes();
        const timeValue = setInterval(() => {
            this.timerMs--;
            if (this.timerMs < 0) {
                this.timerMs = 0;
                this.secondsToMinutes();
                clearInterval(timeValue);
                this.changeActivePlayer();
            }
            this.secondsToMinutes();
        }, TIMER_INTERVAL);
    }

    secondsToMinutes() {
        let time = new Date(this.timerMs);
        let s = time.getSeconds();
        let ms = time.getMilliseconds();
        if (ms < 10) {
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
            this.openDialog();
        }
    }

    openDialog(): void {
        this.dialog.open(NewTurnComponent, {});
    }

    closeDialog() {
        this.dialog.closeAll();
        this.timerMs = +this.totalCountDown;
        this.secondsToMinutes();
        this.startCountdown();
    }

    drawRackLetters(): void {
        for (let i: number = 0; i < DEFAULT_LETTER_COUNT; i++) {
            this.rackService.drawLetter(this.localPlayer.letters[i]);
        }
    }
}
