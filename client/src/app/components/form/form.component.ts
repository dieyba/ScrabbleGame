import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { DictionaryType } from '@app/classes/dictionary';
import { GameType } from '@app/classes/game-parameters';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters';
import { ErrorCase } from '@app/components/virtual-player-name-manager/virtual-player-name-manager.component';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';
import { DictionaryInterface } from '@app/pages/admin-page/admin-page.component';
import { BASE_URL, DictionaryService } from '@app/services/dictionary.service';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';
import { VirtualPlayerName, VirtualPlayerNameManager } from '@app/services/virtual-player-name-manager';

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
    beginnerNameList: VirtualPlayerName[];
    expertNameList: VirtualPlayerName[];
    dictionaryList: string[];
    selectedPlayer: string;
    randomPlayerId: number;
    defaultTimer: string;
    defaultDictionary: string;
    defaultBonus: boolean;

    private beginnerNameUrl: string;
    private expertNameUrl: string;

    constructor(
        private gameService: GameService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<FormComponent>,
        private router: Router,
        private gameList: GameListService,
        private virtualPlayerNameService: VirtualPlayerNameManager,
        private dictionaryService: DictionaryService,
        private snack: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.beginnerNameList = [];
        this.expertNameList = [];
        this.dictionaryList = []; // Object.values(DictionaryType);
        this.selectedPlayer = '';
        this.randomPlayerId = 0;
        this.defaultTimer = '60';
        this.defaultDictionary = '0';
        this.defaultBonus = false;
        this.beginnerNameUrl = 'http://localhost:3000/api/VirtualPlayerName/beginners';
        this.expertNameUrl = 'http://localhost:3000/api/VirtualPlayerName/experts';

        if (this.data.isSolo === true) {
            this.level = new FormControl('', [Validators.required]);
        } else {
            this.level = new FormControl('');
        }

        this.virtualPlayerNameService.getVirtualPlayerNames(this.beginnerNameUrl).subscribe(
            (list) => {
                this.beginnerNameList = list;
            },
            () => {
                this.snack.open(ErrorCase.DatabaseServerCrash, 'close');
            },
        );

        this.virtualPlayerNameService.getVirtualPlayerNames(this.expertNameUrl).subscribe(
            (list) => {
                this.expertNameList = list;
            },
            () => {
                this.snack.open(ErrorCase.DatabaseServerCrash, 'close');
            },
        );

        this.dictionaryService.getDictionaries(BASE_URL).subscribe(
            (dictionaries: DictionaryInterface[]) => {
                for (const dictionary of dictionaries) {
                    this.dictionaryList.push(dictionary.title);
                }
            },
            (error: HttpErrorResponse) => {
                this.dictionaryService.handleErrorSnackBar(error);
            },
        );
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

    randomPlayer(list: VirtualPlayerName[]): void {
        const showOpponents = document.getElementById('opponents');
        if (showOpponents instanceof HTMLElement) {
            showOpponents.style.visibility = 'visible';
        }
        this.randomPlayerId = this.randomNumber(0, list.length);
        do {
            this.randomPlayerId = this.randomNumber(0, list.length);
            this.selectedPlayer = list[this.randomPlayerId].name;
        } while (this.name.value === this.selectedPlayer);

        this.selectedPlayer = list[this.randomPlayerId].name;
        this.myForm.controls.opponent.setValue(this.selectedPlayer);
    }

    convert() {
        this.dialog.open(FormComponent, { data: { isSolo: true, isLog2990: this.data.isLog2990 } });
    }

    changeName(list: VirtualPlayerName[]): void {
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
