import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { PlayerHandler } from '@app/modules/playerHandler';
import { GameListService } from '@app/services/game-list.service';
import { FormComponent } from '../form/form.component';

@Component({
    selector: 'app-waiting-area',
    templateUrl: './waiting-area.component.html',
    styleUrls: ['./waiting-area.component.scss'],
    providers: [GameListService],
})
export class WaitingAreaComponent {
    selectedGame: GameParameters;
    playerName: FormControl;
    private playerList: string[] = [];
    isStarting: boolean;
    name = false;
    private timer: any;
    player: LocalPlayer;
    list: GameParameters[] = [];
    constructor(
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
        // this.list = this.gameList.getList();
        this.player = PlayerHandler.requestPlayer();
        this.player.roomId = this.gameList.player.roomId;
        this.timer = setInterval(() => {
            this.list = this.gameList.getList();
            let roomInfo = this.gameList.roomInfo;
            this.playerList = roomInfo.playersName;
            console.log(this.playerList);
            this.startIfFull();
            // console.log(this.list[0].createrPlayer.roomId);
            // let roomInfo = this.gameList;
            // this.playerList = roomInfo.roomInfo.playersName;
            // this.start();
        }, 500);
    }
    onSelect(game: GameParameters): GameParameters {
        // this.dialogRef.close();
        // document.getElementById('opponents')!.style.display = 'block';
        if (this.gameSelected) {
            this.selectedGame = game;
            console.log(this.selectedGame);
        }
        return this.selectedGame;
    }
    openName(selected: boolean): boolean {
        // this.dialog.open(JoinRoomComponent, { data: selected });
        // selected === true;
        if (this.gameSelected) {
            //this.name = true;
            return (this.name = selected);
        }
        return false;
    }
    public startIfFull(): void {
        if (this.playerList.length == 2) {
            this.isStarting = true;
            clearInterval(this.timer);

            setTimeout(() => {
                this.dialogRef.close();
                this.router.navigate(['/game']);
                // this.soloGameService.initializeGame(this.myForm);
            }, 500);
        }
    }
    start(): void {
        // console.log(game);
        this.gameList.start(this.selectedGame, this.playerName.value);
        // if (true) {
        //     // this.isStarting = true;
        //     clearInterval(this.timer);

        //     setTimeout(() => {
        //         this.dialogRef.close();
        //         // this.router.navigate(['/game']);
        //     }, 500);
        // }
    }
    deleteRoom() {
        // console.log(this.gameList.player.roomId + ' in delete waiting');
        // console.log(this.player.roomId + 'id room du player dans delete');
        // let roomIndex = this.list.findIndex((r) => r.gameRoom.idGame === id);
        // console.log(roomIndex + ' position de ma room dans le tableau pour pouvoir la supprimer');
        // if (roomIndex > -1) {
        this.gameList.deleteRoom();
        // }
    }

    // public start(): void {
    //     if (this.playerList.length === 2) {
    //         this.isStarting = true;
    //         clearInterval(this.timer);

    //         setTimeout(() => {
    //             this.dialogRef.close();
    //             this.router.navigate(['/game']);
    //         }, 500);
    //     }
    // }
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
