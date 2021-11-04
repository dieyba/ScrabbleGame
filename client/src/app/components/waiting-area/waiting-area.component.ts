import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameParameters } from '@app/classes/game-parameters';
import { FormComponent } from '@app/components/form/form.component';
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
    // mettre server dans un ficher pour les constantes
    private readonly server: string;
    private timer: any;
    private socket: io.Socket;
    selectedGame: GameParameters;
    playerName: FormControl;
    playerList: string[];
    list: GameParameters[];
    nameErrorMessage: string;
    isStarting: boolean;
    name: boolean;
    error: boolean;
    nameValid: boolean;
    joindre: boolean;
    full: boolean;
    gameCancelled: boolean;


    constructor(
        private multiManService: MultiPlayerGameService,
        private router: Router,
        private dialogRef: MatDialogRef<WaitingAreaComponent>,
        private dialog: MatDialog,
        public gameList: GameListService,
        @Inject(MAT_DIALOG_DATA) public gameSelected: boolean,
    ) {
        this.server = 'http://' + window.location.hostname + ':3000';
        this.socket = SocketHandler.requestSocket(this.server);
        this.playerList = [];
        this.list = [];
        this.name = false;
        if (gameSelected) {
            this.selectedGame = new GameParameters('', 0, false);
            this.playerName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(12), Validators.minLength(3)]);
        }
        this.full = false;
        this.nameErrorMessage = '';
        this.nameValid = false;
        this.timer = setInterval(() => {
            this.list = this.gameList.getList();
        }, 500);

        this.socket.on('updateInfo', (game: GameParameters) => {
            this.dialogRef.close();
            this.router.navigate(['/game']);
            this.multiManService.initializeGame2(game);
            this.socket.emit('deleteRoom');
        });
        // this.socket.on('getAllGames', (game: GameParameters[]) => {
        //     this.list = game;
        // });
        this.socket.on('roomdeleted', (game: GameParameters) => {
            this.joindre = false;
            this.nameValid = false;
            this.gameCancelled = true;
        })
        // this.socket.on('roomLeft', (game: GameParameters) => {
        //     console.log('left')
        //     this.joindre = false;
        //     this.nameValid = false;
        //     this.gameCancelled = true;
        // })
        this.socket.on('roomJoined', (game: GameParameters) => {
            this.gameList.roomInfo = game;
            this.gameList.roomInfo.gameRoom = game.gameRoom;
            this.playerList = this.gameList.roomInfo.gameRoom.playersName;
            // this.selectedGame.gameRoom.playersName = this.gameList.roomInfo.gameRoom.playersName;
        });
        this.socket.on('roomcreated', (game: GameParameters) => {
            this.gameList.roomInfo = game;
            this.playerList = this.gameList.roomInfo.gameRoom.playersName;
            // this.roomInfo.gameRoom.playersName = game.gameRoom.playersName;
            // this.roomInfo.scrabbleBoard = game.scrabbleBoard;
            // this.roomInfo.creatorPlayer.letters = game.creatorPlayer.letters;
            // this.roomInfo.opponentPlayer.letters = game.opponentPlayer.letters;
        });
        this.socket.on('roomLeft', (game: GameParameters) => {
            console.log(game)
            this.gameList.roomInfo = game;
            this.playerList = this.gameList.roomInfo.gameRoom.playersName;
            // this.selectedGame.gameRoom.playersName = this.gameList.roomInfo.gameRoom.playersName;
            //  console.log(player)
        });
    }

    onSelect(game: GameParameters): GameParameters {
        if (this.gameSelected) {
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
        if (this.gameSelected) {
            return (this.name = selected);
        }
        return false;
    }

    startIfFull(): void {
        if (this.playerList.length == 2) {
            this.isStarting = true;
            clearInterval(this.timer);
            this.gameList.initializeGame(this.gameList.roomInfo.gameRoom.idGame);
        }
    }

    start(): void {
        if (this.playerList.length !== 2) {
            this.nameValid = true;
            this.gameList.start(this.selectedGame, this.playerName.value);
        } else {
            this.full = true;
        }
    }

    confirmName(game: GameParameters) {
        console.log(this.playerName.value);
        console.log(game.creatorPlayer.name)
        if (this.playerName.value === game.creatorPlayer.name || !this.playerName.valid) {
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
}
