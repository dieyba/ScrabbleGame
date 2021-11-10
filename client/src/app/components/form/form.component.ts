import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryType } from '@app/classes/dictionary';
import { GameType, WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';
import { GameListService } from '@app/services/game-list.service';

export const GAME_CAPACITY = 2; // TODO: to change if we implement games with 2-4 players 

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
    debutantNameList: string[]; // TODO: and expert too
    dictionaryList: string[];
    selectedPlayer: string;
    randomPlayerId: number;

    defaultTimer: string;
    defaultDictionary: string;
    defaultBonus: boolean;

    constructor(
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<FormComponent>,
        private router: Router,
        private gameList: GameListService,
        @Inject(MAT_DIALOG_DATA) public isSolo: boolean,
    ) {
        this.defaultTimer = '60';
        this.defaultDictionary = '0';
        this.defaultBonus = false;
        if (this.isSolo === true) {
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.getElementById('opponents')!.style.visibility = 'visible';
        this.randomPlayerId = this.randomNumber(0, list.length);
        do {
            this.randomPlayerId = this.randomNumber(0, list.length);
            this.selectedPlayer = list[this.randomPlayerId];
        } while (this.name.value === this.selectedPlayer);

        this.selectedPlayer = list[this.randomPlayerId];
        this.myForm.controls.opponent.setValue(this.selectedPlayer);
    }

    convert() {
        this.dialog.open(FormComponent, { data: this.isSolo === true });
    }

    changeName(list: string[]): void {
        if (this.name.value === this.selectedPlayer) {
            this.randomPlayer(list);
            this.myForm.controls.opponent.setValue(this.selectedPlayer);
        }
    }

    submit(): void {
        if (this.myForm.valid) {
            let gameParams = new WaitingAreaGameParameters(
                GameType.MultiPlayer,
                GAME_CAPACITY,
                this.dictionaryForm.value,
                this.timer.value,
                this.bonus.value,
                this.name.value,
            );
            if (this.isSolo === true) {
                this.closeDialog();
                this.router.navigate(['/game']);
                gameParams.gameMode = GameType.Solo;
                gameParams.joinerName = this.opponent.value;
                // TODO: emit to server to initialize game with waiting area game params or something
            } else {
                this.closeDialog();
                this.gameList.createRoom(gameParams);
                this.dialog.open(WaitingAreaComponent, { disableClose: true });
            }
        }
    }
}
