import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { FormComponent } from '@app/components/form/form.component';
import { PlayerHandler } from '@app/modules/player-handler';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameListService } from '@app/services/game-list.service';
import { MultiPlayerGameService } from '@app/services/multi-player-game.service';
import * as io from 'socket.io-client';
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
@Component({
    selector: 'app-waiting-area',
    templateUrl: './waiting-area.component.html',
    styleUrls: ['./waiting-area.component.scss'],
})
export class WaitingAreaComponent {
    private readonly server = 'http://' + window.location.hostname + ':3000';
    selectedGame: GameParameters;
    playerName: FormControl;
    playerList: string[] = [];
    isStarting: boolean;
    name = false;
    private timer: any;
    player: LocalPlayer;
    list: GameParameters[] = [];
    private socket: io.Socket;
    constructor(
        private multiManService: MultiPlayerGameService,
        private router: Router,
        private dialogRef: MatDialogRef<WaitingAreaComponent>,
        private dialog: MatDialog,
        public gameList: GameListService,
        @Inject(MAT_DIALOG_DATA) public gameSelected: boolean,
    ) {
        if (gameSelected) {
            this.selectedGame = new GameParameters('', 0);
            this.playerName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZÉé]*')]);
        }
        this.socket = SocketHandler.requestSocket(this.server);
        this.list = this.gameList.getList();
        this.player = PlayerHandler.requestPlayer();
        this.player.roomId = this.gameList.player.roomId;
        this.timer = setInterval(() => {
            this.list = this.gameList.getList();
            this.playerList = this.gameList.roomInfo.gameRoom.playersName;
            // this.startIfFull();
        }, 500);
        this.socket.on('updateInfo', (game: GameParameters) => {
            // this.players = players;
            this.dialogRef.close();
            this.router.navigate(['/game']);
            this.multiManService.initializeGame2(game);
            console.log(this.gameList.players);
            // this.gameList.initializeGame(this.gameList.roomInfo.gameRoom.idGame);
            // this.socket.emit('startGame', this.gameList.roomInfo.gameRoom.idGame);
        });
    }
    onSelect(game: GameParameters): GameParameters {
        if (this.gameSelected) {
            this.selectedGame = game;
        }
        return this.selectedGame;
    }
    openName(selected: boolean): boolean {
        if (this.gameSelected) {
            return (this.name = selected);
        }
        return false;
    }
    startIfFull(): void {
        if (this.playerList.length == 2) {
            this.isStarting = true;
            clearInterval(this.timer);

            // this.router.navigate(['/game']);
            // this.dialogRef.close();
            this.gameList.initializeGame(this.gameList.roomInfo.gameRoom.idGame);
            // setTimeout(() => {
            // }, 5000);
        }
    }
    start(): void {
        this.gameList.start(this.selectedGame, this.playerName.value);
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
}
