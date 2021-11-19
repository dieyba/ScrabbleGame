import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryType } from '@app/classes/dictionary';
import { GameInitInfo, GameType } from '@app/classes/game-parameters';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters';
import { FormComponent, GAME_CAPACITY } from '@app/components/form/form.component';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

const MAX_NAME_LENGHT = 12;
const MIN_NAME_LENGHT = 3;
const LIST_UPDATE_TIMEOUT = 500;

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
    name: boolean;
    error: boolean;
    nameValid: boolean;
    joindre: boolean;
    full: boolean;
    gameCancelled: boolean;

    private readonly server: string;
    private timer: NodeJS.Timeout;
    private socket: io.Socket;

    constructor(
        private gameService: GameService,
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
            this.selectedGame = new WaitingAreaGameParameters(GameType.MultiPlayer, GAME_CAPACITY, DictionaryType.Default, 0, false, false, '');
            this.playerName = new FormControl('', [
                Validators.required,
                Validators.pattern('[a-zA-ZÉé]*'),
                Validators.maxLength(MAX_NAME_LENGHT),
                Validators.minLength(MIN_NAME_LENGHT),
            ]);
        }
        this.full = false;
        this.nameErrorMessage = '';
        this.nameValid = false;
        this.timer = setInterval(() => {
            this.pendingGameslist = this.gameList.waitingAreaGames;
        }, LIST_UPDATE_TIMEOUT);
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

    randomGame() {
        let randomFloat = Math.random() * this.pendingGameslist.length;
        randomFloat = Math.floor(randomFloat);
        this.selectedGame = this.pendingGameslist[randomFloat];
        this.openName(true);
    }

    onSelect(game: WaitingAreaGameParameters): WaitingAreaGameParameters {
        if (this.isGameSelected) {
            this.selectedGame = game;
            // when selecting a new game, the previous game was cancelled message should be removed
            this.gameCancelled = false;
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
            this.gameList.initializeMultiplayerGame();
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
        this.socket.on('initClientGame', (gameParams: GameInitInfo) => {
            clearTimeout(this.timer);
            this.dialogRef.close();
            this.router.navigate(['/game']);
            this.gameService.initializeMultiplayerGame(gameParams);
            this.socket.emit('deleteWaitingAreaRoom');
        });
        this.socket.on('waitingAreaRoomDeleted', (game: WaitingAreaGameParameters) => {
            this.joindre = false;
            this.nameValid = false;
            this.nameErrorMessage = '';
            this.gameCancelled = true;
            this.roomDeletedId = game.gameRoom.idGame;
        });
        this.socket.on('roomJoined', (game: WaitingAreaGameParameters) => {
            this.gameList.localPlayerRoomInfo = game;
            this.gameList.localPlayerRoomInfo.gameRoom = game.gameRoom;
            this.playerList = this.gameList.localPlayerRoomInfo.gameRoom.playersName;
        });
        this.socket.on('waitingAreaRoomCreated', (game: WaitingAreaGameParameters) => {
            this.gameList.localPlayerRoomInfo = game;
            this.playerList = this.gameList.localPlayerRoomInfo.gameRoom.playersName;
        });
        this.socket.on('roomLeft', (game: WaitingAreaGameParameters) => {
            if (game !== undefined) {
                this.gameList.localPlayerRoomInfo = game;
                this.playerList = this.gameList.localPlayerRoomInfo.gameRoom.playersName;
                this.joindre = false;
                this.nameValid = false;
                this.gameCancelled = true;
            }
        });
    }
}
