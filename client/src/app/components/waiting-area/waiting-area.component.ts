import { AfterViewInit, Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { GameInitInfo, GameType } from '@app/classes/game-parameters/game-parameters';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters/waiting-area-game-parameters';
import { DialogData, GameInitFormComponent, GAME_CAPACITY } from '@app/components/game-init-form/game-init-form.component';
import * as SocketHandler from '@app/modules/socket-handler';
import { GameListService } from '@app/services/game-list.service/game-list.service';
import { GameService } from '@app/services/game.service/game.service';
import * as io from 'socket.io-client';
import dict_path from 'src/assets/dictionary.json';
import { environment } from 'src/environments/environment';

const MAX_NAME_LENGTH = 12;
const MIN_NAME_LENGTH = 3;
const LIST_UPDATE_TIMEOUT = 500;

@Component({
    selector: 'app-waiting-area',
    templateUrl: './waiting-area.component.html',
    styleUrls: ['./waiting-area.component.scss'],
})
export class WaitingAreaComponent implements AfterViewInit {
    selectedGame: WaitingAreaGameParameters;
    playerName: FormControl;
    playerList: string[];
    pendingGamesList: WaitingAreaGameParameters[];
    roomDeletedId: number;
    nameErrorMessage: string;
    isStarting: boolean;

    // TODO: rename the booleans according to convention
    name: boolean;
    error: boolean;
    nameValid: boolean;
    join: boolean;
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
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.playerList = [];
        this.pendingGamesList = [];
        this.name = false;
        this.isStarting = false;
        if (data.isGameSelected) {
            this.selectedGame = new WaitingAreaGameParameters(
                GameType.MultiPlayer,
                GAME_CAPACITY,
                dict_path as DictionaryInterface,
                0,
                false,
                false,
                '',
            );
            this.playerName = new FormControl('', [
                Validators.required,
                Validators.pattern('[a-zA-ZÉé]*'),
                Validators.maxLength(MAX_NAME_LENGTH),
                Validators.minLength(MIN_NAME_LENGTH),
            ]);
        }
        this.full = false;
        this.nameErrorMessage = '';
        this.nameValid = false;
        this.timer = setInterval(() => {
            this.pendingGamesList = this.gameList.waitingAreaGames;
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

    ngAfterViewInit() {
        this.gameList.getGames(this.data.isLog2990);
    }

    // TODO: put random number in utilities to use it here
    randomGame() {
        let randomFloat = Math.random() * this.pendingGamesList.length;
        randomFloat = Math.floor(randomFloat);
        this.selectedGame = this.pendingGamesList[randomFloat];
        this.openName(true);
    }

    onSelect(game: WaitingAreaGameParameters): WaitingAreaGameParameters {
        if (this.data.isGameSelected) {
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
        if (this.data.isGameSelected) {
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
            this.join = true;
            this.nameErrorMessage = 'Votre nom est valide ;) ';
        }
    }

    deleteRoom() {
        this.gameList.deleteRoom();
    }

    openForm() {
        this.dialog.open(GameInitFormComponent, { data: { isSolo: this.data.isSolo, isLog2990: this.data.isLog2990 } });
    }

    convert(isSolo: boolean) {
        this.name = false;
        this.closeDialog();
        this.dialog.open(GameInitFormComponent, { data: { isSolo, isLog2990: this.data.isLog2990 } });
    }

    closeDialog() {
        this.name = false;
        this.dialogRef.close();
    }

    private socketOnConnect() {
        this.socket.on('initClientGame', (gameParams: GameInitInfo) => {
            clearTimeout(this.timer);
            this.dialogRef.close();
            this.router.navigate(['/game']);
            this.gameService.initializeMultiplayerGame(gameParams);
            this.socket.emit('deleteWaitingAreaRoom');
        });
        this.socket.on('waitingAreaRoomDeleted', (game: WaitingAreaGameParameters) => {
            this.join = false;
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
                this.join = false;
                this.nameValid = false;
                this.gameCancelled = true;
            }
        });
    }
}
