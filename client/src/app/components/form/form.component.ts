import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameParameters } from '@app/classes/game-parameters';
import { GameListService } from '@app/services/game-list.service';
import { SoloGameService } from '@app/services/solo-game.service';
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

    constructor(
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<FormComponent>,
        private router: Router,
        private soloGameService: SoloGameService,
        private gameList: GameListService,
        @Inject(MAT_DIALOG_DATA) public isSolo: boolean,
    ) {
        if (this.isSolo == true) {
            this.level = new FormControl('', [Validators.required]);
        } else {
            this.level = new FormControl('');
        }
        this.dictionary = 'Français';
        this.debutantNameList = ['Érika', 'Étienne', 'Sara'];
        // this.mode = new ClassicModeComponent(this.dialog2);
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

    changeName(list: string[]): void {
        if (this.name.value === this.selectedPlayer) {
            this.randomPlayer(list);
            this.myForm.controls.opponent.setValue(this.selectedPlayer);
        }
    }

    submit(): void {
        if (this.myForm.valid && this.isSolo == true) {
            this.closeDialog();
            this.router.navigate(['/game']);
            this.soloGameService.initializeGame(this.myForm);
        } else {
            // this.closeDialog();
            // console.log(this.myForm.value);
            this.dialog.open(WaitingAreaComponent, { disableClose: true });
            // let singleGame = new GameParameters(
            //     this.myForm.controls.name.value,
            //     this.myForm.controls.dictionaryForm.value,
            //     this.myForm.controls.bonus.value,
            //     this.myForm.controls.timer.value,
            // );

            // this.singleGame.initializing(this.myForm);
            // console.log(this.singleGame);
            let single = this.soloGameService.initializingMultijoueur(this.myForm);
            // console.log(single.dictionary, single.player, single.totalCountDown + 'submit');
            this.gameList.addGame(single);
            console.log(this.gameList);
        }
    }
    addGame(game: GameParameters) {
        this.gameList.addGame(game);
    }
}
