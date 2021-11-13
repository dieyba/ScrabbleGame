
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryType } from '@app/classes/dictionary';
import { GameInitInfo, GameType, WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

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

    isLOG2990: boolean;
    debutantNameList: string[]; // TODO: and expert too
    dictionaryList: string[];
    selectedPlayer: string;
    randomPlayerId: number;
    defaultTimer: string;
    defaultDictionary: string;
    defaultBonus: boolean;
    private readonly server: string;
    private socket: io.Socket;

    constructor(
        private gameService: GameService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<FormComponent>,
        private router: Router,
        private gameList: GameListService,
        @Inject(MAT_DIALOG_DATA) public isSolo: boolean,
    ) {
        this.isLOG2990 = false; // TODO: implement actual isLOG2990 depending on which page created the form
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
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
        this.socketOnConnect();
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
        let showOpponents = document.getElementById('opponents'); // make sure it is not null
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
            const gameMode = this.isSolo ? GameType.Solo : GameType.MultiPlayer;
            let gameParams = new WaitingAreaGameParameters(
                gameMode,
                GAME_CAPACITY,
                this.dictionaryForm.value,
                this.timer.value,
                this.bonus.value,
                this.isLOG2990,
                this.name.value, // game creator name
            );
            if (gameMode === GameType.Solo) {
                this.closeDialog();
                gameParams.joinerName = this.opponent.value;
                this.gameService.game.gameMode = GameType.Solo; // TODO: to make sure the service is constructed prior to initialization. is this needed?
                this.socket.emit('initializeSoloGame', gameParams);
            } else {
                this.closeDialog();
                this.gameList.createRoom(gameParams);
                this.dialog.open(WaitingAreaComponent, { disableClose: true });
            }
        }
    }
    socketOnConnect() {
        this.socket.on('initClientGame', (gameParams: GameInitInfo) => {
            this.dialogRef.close();
            this.router.navigate(['/game']);
            this.gameService.initializeGame(gameParams);

        });
    }
}
