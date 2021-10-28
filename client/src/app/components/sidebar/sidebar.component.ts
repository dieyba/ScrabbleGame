import { AfterViewInit, Component, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalPlayer } from '@app/classes/local-player';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';
import * as io from 'socket.io-client';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
    player1Name: string;
    player2Name: string;
    player1Active: boolean;
    player2Active: boolean;
    winnerName: string;
    isSolo: boolean;
    private readonly server = 'http://' + window.location.hostname + ':3000';
    private socket: io.Socket;
    players: Array<LocalPlayer>;
    private dialogRef: MatDialogRef<EndGamePopupComponent>;
    constructor(public router: Router, public dialog: MatDialog,private gameService: GameService, private gameList: GameListService) {
        this.winnerName = '';
        this.socket = SocketHandler.requestSocket(this.server);
        this.players = new Array<LocalPlayer>();
        this.player1Active = this.gameList.roomInfo.players[0]?.isActive;
        this.player2Active = this.gameList.roomInfo.players[1]?.isActive;
        setInterval(() => {
            this.player1Name = this.gameList.roomInfo.gameRoom.playersName[0];
            this.player2Name = this.gameList.roomInfo.gameRoom.playersName[1];
            this.socket.on('updateInfo', (players: Array<LocalPlayer>) => {
                this.players = players;
                this.socket.emit('startGame', this.gameList.roomInfo.gameRoom.idGame);
            });
        }, 1000);
    }
    ngOnInit() {
        setInterval(() => {
            this.player1Name = this.gameList.roomInfo.gameRoom.playersName[0];
            this.player2Name = this.gameList.roomInfo.gameRoom.playersName[1];
            this.socket.on('updateInfo', (players: Array<LocalPlayer>) => {
                this.players = players;
                this.socket.emit('startGame', this.gameList.roomInfo.gameRoom.idGame);
            });
        }, 1000);
    }
    ngAfterViewInit() {}


    getPlayer1Name(): string {
        return this.gameList.roomInfo.creatorPlayer.name;
    }
    getPlayer2Name(): string {
        return this.players[1]?.name;
    }

    getPlayer1Score(): number {
        return this.gameList.roomInfo.creatorPlayer.score;
    }

    getPlayer2Score(): number {
        return this.players[1]?.score;
    }


    isPlayer1Active(): boolean {
        return this.gameList.roomInfo.creatorPlayer.isActive;
    }

    isPlayer2Active(): boolean {
        return this.players[1]?.isActive;
    }

    isEndGame(): boolean {
        this.getWinnerName();
        return this.gameService.currentGameService.game.isEndGame;
    }

    hasWinner(): boolean {
        return this.gameService.currentGameService.game.creatorPlayer.isWinner || this.gameService.currentGameService.game.opponentPlayer.isWinner;
    }

    isDrawnGame(): boolean {
        if (this.gameService.currentGameService.game.creatorPlayer.isWinner && this.gameService.currentGameService.game.opponentPlayer.isWinner) {
            return true;
        } else {
            return false;
        }
    }

    getWinnerName() {
        if (this.isDrawnGame()) {
            this.winnerName =
                this.gameService.currentGameService.game.creatorPlayer.name + ' et ' + this.gameService.currentGameService.game.opponentPlayer.name;
        }
        if (this.gameService.currentGameService.game.creatorPlayer.isWinner) {
            this.winnerName = this.gameService.currentGameService.game.creatorPlayer.name;
        }
        if (this.gameService.currentGameService.game.opponentPlayer.isWinner) {
            this.winnerName = this.gameService.currentGameService.game.opponentPlayer.name;
        }
    }
    public quitGame(): void {
        // User confirmation popup
        this.dialogRef = this.dialog.open(EndGamePopupComponent);

        // User confirmation response
        this.dialogRef.afterClosed().subscribe((confirmQuit) => {
            if (confirmQuit) {
                this.router.navigate(['/start']);
            }
        });
    }

}

@Component({
    template: `<h1 md-dialog-title>Fin de la partie</h1>

    <div md-dialog-content>Êtes-vous sûr/sûre de vouloir abandonner la partie</div>
    
    <div md-dialog-actions align="center">
        <button md-raised-button color="warn" (click)="dialogReference.close(true)">OUI</button>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <button id="cancelQuitButton" md-raised-button color="primary" (click)="dialogReference.close(false)">NON</button>
    </div>
    `,
})
export class EndGamePopupComponent {
    constructor(@Optional() public dialogReference: MatDialogRef<any>) {}
}

