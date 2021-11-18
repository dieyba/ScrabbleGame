import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryType } from '@app/classes/dictionary';
import { GameType } from '@app/classes/game-parameters';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';

export const GAME_CAPACITY = 2;

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    myForm: FormGroup;
    name: FormControl;
    timer: FormControl;
    bonus: FormControl;
    level: FormControl;
    opponent: FormControl;
    dictionaryForm: FormControl;

    debutantNameList: string[];
    dictionaryList: string[];
    selectedPlayer: string;
    randomPlayerId: number;
    defaultTimer: string;
    defaultDictionary: string;
    defaultBonus: boolean;

    constructor(
        private gameService: GameService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<FormComponent>,
        private router: Router,
        private gameList: GameListService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.defaultTimer = '60';
        this.defaultDictionary = '0';
        this.defaultBonus = false;
        if (this.data.isSolo === true) {
            this.level = new FormControl('', [Validators.required]);
        } else {
            this.level = new FormControl('');
        }
        this.dictionaryList = Object.values(DictionaryType);
        this.debutantNameList = ['Érika', 'Étienne', 'Sara'];
    }

    ngOnInit() {
        this.createFormControl();
        this.createForm();
    }

    createFormControl() {
        this.name = new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZÉé]*')]);
        this.timer = new FormControl('', [Validators.required]);
        this.bonus = new FormControl('');
        this.dictionaryForm = new FormControl('', [Validators.required]);
        this.opponent = new FormControl('');
    }

    createForm() {
        this.myForm = new FormGroup({
            name: this.name,
            timer: this.timer,
            bonus: this.bonus,
            dictionaryForm: this.dictionaryForm,
            level: this.level,
            opponent: this.opponent,
        });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    randomNumber(minimum: number, maximum: number): number {
        const randomFloat = Math.random() * (maximum - minimum);
        return Math.floor(randomFloat) + minimum;
    }

    randomPlayer(list: string[]): void {
        const showOpponents = document.getElementById('opponents');
        if (showOpponents instanceof HTMLElement) {
            showOpponents.style.visibility = 'visible';
        }
        this.randomPlayerId = this.randomNumber(0, list.length);
        do {
            this.randomPlayerId = this.randomNumber(0, list.length);
            this.selectedPlayer = list[this.randomPlayerId];
        } while (this.name.value === this.selectedPlayer);

        this.selectedPlayer = list[this.randomPlayerId];
        this.myForm.controls.opponent.setValue(this.selectedPlayer);
    }

    convert() {
        this.dialog.open(FormComponent, { data: { isSolo: true, isLog2990: this.data.isLog2990 } });
    }

    changeName(list: string[]): void {
        if (this.name.value === this.selectedPlayer) {
            this.randomPlayer(list);
            this.myForm.controls.opponent.setValue(this.selectedPlayer);
        }
    }

    submit(): void {
        if (this.myForm.valid) {
            const gameMode = this.data.isSolo ? GameType.Solo : GameType.MultiPlayer;
            const gameParams = new WaitingAreaGameParameters(
                gameMode,
                GAME_CAPACITY,
                this.dictionaryForm.value,
                this.timer.value,
                this.bonus.value,
                this.data.isLog2990,
                this.name.value, // game creator name
            );
            if (gameMode === GameType.Solo) {
                this.closeDialog();
                gameParams.joinerName = this.opponent.value;
                this.dialogRef.close();
                this.router.navigate(['/game']);
                this.gameService.initializeSoloGame(gameParams, this.level.value);
            } else {
                this.closeDialog();
                this.gameList.createRoom(gameParams);
                this.dialog.open(WaitingAreaComponent, { data: { isLog2990: this.data.isLog2990 }, disableClose: true });
            }
        }
    }
}
