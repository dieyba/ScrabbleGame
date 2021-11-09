import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryType } from '@app/classes/dictionary';
import { GameType, PendingGameParameters } from '@app/classes/game-parameters';
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
    selectedGame: PendingGameParameters;
    playerName: FormControl;
    playerList: string[];
    pendingGameslist: PendingGameParameters[];
    roomDeletedId: number;
    nameErrorMessage: string;
    isStarting: boolean;

    // please rename the booleans according to convention
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
            this.selectedGame = new PendingGameParameters(
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

    onSelect(game: PendingGameParameters): PendingGameParameters {
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
            this.gameList.initializeGame(this.gameList.localRoomInfo.gameRoom.idGame);
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

    confirmName(game: PendingGameParameters) {
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
        this.socket.on('updateInfo', (game: PendingGameParameters) => {
            this.dialogRef.close();
            this.router.navigate(['/game']);
            // this.multiManService.initializeGame2(game);
            this.socket.emit('deleteRoom');
        });
        this.socket.on('roomdeleted', (game: PendingGameParameters) => {
            this.joindre = false;
            this.nameValid = false;
            this.gameCancelled = true;
            this.roomDeletedId = game.gameRoom.idGame;
        });
        this.socket.on('roomJoined', (game: PendingGameParameters) => {
            this.gameList.localRoomInfo = game;
            this.gameList.localRoomInfo.gameRoom = game.gameRoom;
            this.playerList = this.gameList.localRoomInfo.gameRoom.playersName;
        });
        this.socket.on('roomcreated', (game: PendingGameParameters) => {
            this.gameList.localRoomInfo = game;
            this.playerList = this.gameList.localRoomInfo.gameRoom.playersName;
        });
        this.socket.on('roomLeft', (game: PendingGameParameters) => {
            this.gameList.localRoomInfo = game;
            this.playerList = this.gameList.localRoomInfo.gameRoom.playersName;
            this.joindre = false;
            this.nameValid = false;
            this.gameCancelled = true;
        });
    }
}
