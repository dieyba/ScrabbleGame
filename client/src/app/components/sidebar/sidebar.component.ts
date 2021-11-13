import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EndGamePopupComponent } from '@app/components/end-game-popup/end-game-popup.component';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameService } from '@app/services/game.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
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
        // this.server = 'http://' + window.location.hostname + ':3000';
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.winnerName = '';
        this.roomLeft();
    }
    roomLeft() {
        this.socket.on('roomLeft', () => {
            this.gameService.game.players[this.gameService.localPlayerIndex].isWinner = true;
            this.gameService.game.isEndGame = true;
        });
    }

    getPlayer1Name(): string {
        return this.gameService.game.players[this.gameService.localPlayerIndex].name;
    }

    getPlayer2Name(): string {
        return this.gameService.game.players[this.gameService.opponentPlayerIndex].name;
    }

    getLettersLeftCount(): number {
        return this.gameService.game.stock.letterStock.length;
    }

    getPlayer1LetterCount(): number {
        return this.gameService.game.players[this.gameService.localPlayerIndex].letters.length;
    }

    getPlayer2LetterCount(): number {
        return this.gameService.game.players[this.gameService.opponentPlayerIndex].letters.length;
    }

    getPlayer1Score(): number {
        return this.gameService.game.players[this.gameService.localPlayerIndex].score;
    }

    getPlayer2Score(): number {
        return this.gameService.game.players[this.gameService.opponentPlayerIndex].score;
    }

    isPlayer1Active(): boolean {
        return this.gameService.game.players[this.gameService.localPlayerIndex].isActive;
    }

    isPlayer2Active(): boolean {
        return this.gameService.game.players[this.gameService.opponentPlayerIndex].isActive;
    }
    getTimer(): string {
        return this.gameService.timer;
    }

    isEndGame(): boolean {
        this.getWinnerName();
        return this.gameService.game.isEndGame;
    }

    hasWinner(): boolean {
        return this.gameService.game.players[this.gameService.localPlayerIndex].isWinner || this.gameService.game.players[this.gameService.opponentPlayerIndex].isWinner;
    }

    isDrawnGame(): boolean {
        if (this.gameService.game.players[this.gameService.localPlayerIndex].isWinner && this.gameService.game.players[this.gameService.opponentPlayerIndex].isWinner) {
            return true;
        } else {
            return false;
        }
    }

    getWinnerName() {
        if (this.isDrawnGame()) {
            this.winnerName =
                this.gameService.game.players[this.gameService.localPlayerIndex].name + ' et ' + this.gameService.game.players[this.gameService.opponentPlayerIndex].name;
        } else if (this.gameService.game.players[this.gameService.localPlayerIndex].isWinner) {
            this.winnerName = this.gameService.game.players[this.gameService.localPlayerIndex].name;
        } else if (this.gameService.game.players[this.gameService.opponentPlayerIndex].isWinner) {
            this.winnerName = this.gameService.game.players[this.gameService.opponentPlayerIndex].name;
        }
    }

    quitGame(): void {
        // User confirmation popup
        this.dialogRef = this.dialog.open(EndGamePopupComponent);

        // User confirmation response
        this.dialogRef.afterClosed().subscribe((confirmQuit) => {
            if (confirmQuit) {
                this.socket.emit('leaveRoom');
                // this.socket = SocketHandler.disconnectSocket();
                // calls server to display message in opponent's chat box
                // this.socket.emit('playerQuit');
                this.router.navigate(['/start']);
            }
        });
    }
}
