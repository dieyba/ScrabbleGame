import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryType } from '@app/classes/dictionary';
import { GameType, WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { FormComponent, GAME_CAPACITY } from '@app/components/form/form.component';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameListService } from '@app/services/game-list.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
@Component({
    selector: 'app-waiting-area',
    templateUrl: './waiting-area.component.html',
    styleUrls: ['./waiting-area.component.scss'],
})
export class WaitingAreaComponent {
    selectedGame: WaitingAreaGameParameters;
    playerName: FormControl;
    playerList: string[];
    pendingGameslist: WaitingAreaGameParameters[];
    roomDeletedId: number;
    nameErrorMessage: string;
    isStarting: boolean;

    // TODO: rename the booleans according to convention
    // name: boolean; the hell does this do?
    // error: boolean; the hell does this do?
    // isNameValid: boolean;
    // joindre: boolean; the hell does this do?
    // isFull: boolean;
    // isGameCancelled: boolean;
    name: boolean;
    error: boolean;
    nameValid: boolean;
    joindre: boolean;
    full: boolean;
    gameCancelled: boolean;

    private readonly server: string;
    private timer: any;
    private socket: io.Socket;

    constructor(
        private router: Router,
        private dialogRef: MatDialogRef<WaitingAreaComponent>,
        private dialog: MatDialog,
        public gameList: GameListService,
        @Inject(MAT_DIALOG_DATA) public isGameSelected: boolean,
    ) {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.playerList = [];
        this.pendingGameslist = [];
        this.name = false;
        this.isStarting = false;
        if (isGameSelected) {
            this.selectedGame = new WaitingAreaGameParameters(
                GameType.MultiPlayer,
                GAME_CAPACITY,
                DictionaryType.Default,
                0,
                false,
                '',
            );
            this.playerName = new FormControl('', [
                Validators.required,
                Validators.pattern('[a-zA-ZÉé]*'),
                Validators.maxLength(12),
                Validators.minLength(3),
            ]);
        }
        this.full = false;
        this.nameErrorMessage = '';
        this.nameValid = false;
        this.timer = setInterval(() => {
            this.pendingGameslist = this.gameList.getList();
        }, 500);
        this.socketOnConnect();
    }
    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload() {
        this.gameList.someoneLeftRoom();
    }
    @HostListener('window:popstate', ['$event'])
    onPopState() {
        this.gameList.someoneLeftRoom();
    }

    onSelect(game: WaitingAreaGameParameters): WaitingAreaGameParameters {
        if (this.isGameSelected) {
            this.selectedGame = game;
        }
        return this.selectedGame;
    }
    someoneLeftRoom() {
        if (!this.isStarting) {
            this.gameList.someoneLeftRoom();
        }
    }

    openName(selected: boolean): boolean {
        if (this.isGameSelected) {
            return (this.name = selected);
        }
        return false;
    }

    startIfFull(): void {
        if (this.playerList.length === 2) {
            this.isStarting = true;
            clearInterval(this.timer);
            this.gameList.initializeGame(this.gameList.localPlayerRoomInfo.gameRoom.idGame);
        }
    }

    start(): void {
        if (this.selectedGame.gameRoom.playersName.length === 1) {
            this.nameValid = true;
            this.gameList.start(this.selectedGame, this.playerName.value);
        } else {
            this.full = true;
        }
    }

    confirmName(game: WaitingAreaGameParameters) {
        if (this.playerName.value === game.creatorName || !this.playerName.valid) {
            this.error = true;
            this.nameErrorMessage = 'Vous ne pouvez pas avoir le meme nom que votre adversaire';
        } else {
            this.error = false;
            this.joindre = true;
            this.nameErrorMessage = 'Votre nom est valide ;) ';
        }
    }

    deleteRoom() {
        this.gameList.deleteRoom();
    }

    openForm() {
        this.dialog.open(FormComponent, {});
    }

    convert(isSolo: boolean) {
        this.name = false;
        this.closeDialog();
        this.dialog.open(FormComponent, { data: isSolo });
    }

    closeDialog() {
        this.name = false;
        this.dialogRef.close();
    }
    socketOnConnect() {
        this.socket.on('updateInfo', (game: WaitingAreaGameParameters) => {
            this.dialogRef.close();
            this.router.navigate(['/game']);
            // this.multiManService.initializeGame2(game);
            this.socket.emit('deleteRoom');
        });
        this.socket.on('roomdeleted', (game: WaitingAreaGameParameters) => {
            this.joindre = false;
            this.nameValid = false;
            this.gameCancelled = true;
            this.roomDeletedId = game.gameRoom.idGame;
        });
        this.socket.on('roomJoined', (game: WaitingAreaGameParameters) => {
            this.gameList.localPlayerRoomInfo = game;
            this.gameList.localPlayerRoomInfo.gameRoom = game.gameRoom;
            this.playerList = this.gameList.localPlayerRoomInfo.gameRoom.playersName;
        });
        this.socket.on('roomcreated', (game: WaitingAreaGameParameters) => {
            this.gameList.localPlayerRoomInfo = game;
            this.playerList = this.gameList.localPlayerRoomInfo.gameRoom.playersName;
        });
        this.socket.on('roomLeft', (game: WaitingAreaGameParameters) => {
            this.gameList.localPlayerRoomInfo = game;
            this.playerList = this.gameList.localPlayerRoomInfo.gameRoom.playersName;
            this.joindre = false;
            this.nameValid = false;
            this.gameCancelled = true;
        });
    }
}
