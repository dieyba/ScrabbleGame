import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameParameters } from '@app/classes/game-parameters';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameService } from '@app/services/game.service';
import * as io from 'socket.io-client';
import { EndGamePopupComponent } from '../end-game-popup/end-game-popup.component';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    winnerName: string;
    private dialogRef: MatDialogRef<EndGamePopupComponent>;
    private socket: io.Socket;
    private readonly server: string;

    constructor(public router: Router, public dialog: MatDialog, private gameService: GameService) {
        this.server = 'http://' + window.location.hostname + ':3000';
        this.socket = SocketHandler.requestSocket(this.server);
        this.winnerName = '';
        this.roomLeft()
    }
    roomLeft() {
        this.socket.on('roomLeft', (game: GameParameters) => {
            this.gameService.currentGameService.game.localPlayer.isWinner = true;
            this.gameService.currentGameService.game.isEndGame = true;
        })
    }

    getPlayer1Name(): string {
        return this.gameService.currentGameService.game.localPlayer.name;
    }

    getPlayer2Name(): string {
        return this.gameService.currentGameService.game.opponentPlayer.name;
    }

    getLettersLeftCount(): number {
        return this.gameService.currentGameService.stock.letterStock.length;
    }

    getPlayer1LetterCount(): number {
        return this.gameService.currentGameService.game.localPlayer.letters.length;
    }

    getPlayer2LetterCount(): number {
        return this.gameService.currentGameService.game.opponentPlayer.letters.length;
    }

    getPlayer1Score(): number {
        return this.gameService.currentGameService.game.localPlayer.score;
    }

    getPlayer2Score(): number {
        return this.gameService.currentGameService.game.opponentPlayer.score;
    }

    isPlayer1Active(): boolean {
        return this.gameService.currentGameService.game.localPlayer.isActive;
    }

    isPlayer2Active(): boolean {
        return this.gameService.currentGameService.game.opponentPlayer.isActive;
    }
    getTimer(): string {
        return this.gameService.currentGameService.timer;
    }

    isEndGame(): boolean {
        this.getWinnerName();
        return this.gameService.currentGameService.game.isEndGame;
    }

    hasWinner(): boolean {
        return this.gameService.currentGameService.game.localPlayer.isWinner || this.gameService.currentGameService.game.opponentPlayer.isWinner;
    }

    isDrawnGame(): boolean {
        if (this.gameService.currentGameService.game.localPlayer.isWinner && this.gameService.currentGameService.game.opponentPlayer.isWinner) {
            return true;
        } else {
            return false;
        }
    }

    getWinnerName() {
        if (this.isDrawnGame()) {
            this.winnerName =
                this.gameService.currentGameService.game.localPlayer.name + ' et ' + this.gameService.currentGameService.game.opponentPlayer.name;
        } else if (this.gameService.currentGameService.game.localPlayer.isWinner) {
            this.winnerName = this.gameService.currentGameService.game.localPlayer.name;
        } else if (this.gameService.currentGameService.game.opponentPlayer.isWinner) {
            this.winnerName = this.gameService.currentGameService.game.opponentPlayer.name;
        }
    }

    quitGame(): void {
        // User confirmation popup
        this.dialogRef = this.dialog.open(EndGamePopupComponent);

        // User confirmation response
        this.dialogRef.afterClosed().subscribe((confirmQuit) => {
            if (confirmQuit) {
                this.socket.emit('leaveRoom')
                // this.socket = SocketHandler.disconnectSocket();
                // calls server to display message in opponent's chat box
                // this.socket.emit('playerQuit');
                this.router.navigate(['/start']);
            }
        });
    }
}

