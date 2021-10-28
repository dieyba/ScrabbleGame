import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameParameters, GameType } from '@app/classes/game-parameters';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';
import { WaitingAreaComponent } from '../waiting-area/waiting-area.component';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    // mode: ClassicModeComponent;
    myForm: FormGroup;
    name: FormControl;
    timer: FormControl;
    bonus: FormControl;
    level: FormControl;
    opponent: FormControl;
    dictionaryForm: FormControl;
    debutantNameList: string[];
    selectedPlayer: string;
    random: number;
    dictionary: string;
    singleGame: GameParameters;

    defaultTimer = '60';
    defaultDictionary = '0';
    defaultBonus = false;

    constructor(
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<FormComponent>,
        private router: Router,
        private gameService: GameService,
        private gameList: GameListService,
        @Inject(MAT_DIALOG_DATA) public isSolo: boolean,
    ) {
        if (this.isSolo === true) {
            this.level = new FormControl('', [Validators.required]);
        } else {
            this.level = new FormControl('');
        }
        this.dictionary = 'Français';
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
        this.random = this.randomNumber(0, list.length);
        do {
            this.random = this.randomNumber(0, list.length);
            this.selectedPlayer = list[this.random];
        } while (this.name.value === this.selectedPlayer);

        this.selectedPlayer = list[this.random];
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
            if (this.isSolo === true) {
                this.closeDialog();
                this.router.navigate(['/game']);
                this.gameService.initializeGameType(GameType.Solo);
                this.gameService.currentGameService.initializeGame(this.myForm);
            } else {
                this.closeDialog();
                this.gameService.initializeGameType(GameType.MultiPlayer);
                this.gameService.currentGameService.initializeGame(this.myForm);
                const single = this.gameService.currentGameService.game;
                this.gameList.createRoom(single);
                this.dialog.open(WaitingAreaComponent, {});
            }
        }
    }
}
