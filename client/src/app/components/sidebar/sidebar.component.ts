import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EndGamePopupComponent } from '@app/components/end-game-popup/end-game-popup.component';
import { GAME_CAPACITY } from '@app/components/form/form.component';
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
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.winnerName = '';
        this.roomLeft();
    }
    roomLeft() {
        this.socket.on('roomLeft', () => {
            this.gameService.game.getLocalPlayer().isWinner = true;
            this.gameService.game.isEndGame = true;
        });
    }

    isLog2990(): boolean {
        return this.gameService.game.isLog2990;
    }

    getPlayer1Name(): string {
        return this.gameService.game.getLocalPlayer().name;
    }

    getPlayer2Name(): string {
        return this.gameService.game.getOpponent().name;
    }

    getLettersLeftCount(): number {
        return this.gameService.game.stock.letterStock.length;
    }

    getPlayer1LetterCount(): number {
        return this.gameService.game.getLocalPlayer().letters.length;
    }

    getPlayer2LetterCount(): number {
        return this.gameService.game.getOpponent().letters.length;
    }

    getPlayer1Score(): number {
        return this.gameService.game.getLocalPlayer().score;
    }

    getPlayer2Score(): number {
        return this.gameService.game.getOpponent().score;
    }

    isPlayer1Active(): boolean {
        if (this.gameService.game.players.length === GAME_CAPACITY) {
            return this.gameService.game.getLocalPlayer().isActive;
        }
        return false;
    }

    isPlayer2Active(): boolean {
        if (this.gameService.game.players.length === GAME_CAPACITY) {
            return this.gameService.game.getOpponent().isActive;
        }
        return false;
    }
    getTimer(): string {
        return this.gameService.game.gameTimer.timer;
    }

    isEndGame(): boolean {
        this.getWinnerName();
        return this.gameService.game.isEndGame;
    }

    hasWinner(): boolean {
        return this.gameService.game.getLocalPlayer().isWinner || this.gameService.game.getOpponent().isWinner;
    }

    isDrawnGame(): boolean {
        if (this.gameService.game.getLocalPlayer().isWinner && this.gameService.game.getOpponent().isWinner) {
            return true;
        } else {
            return false;
        }
    }

    getWinnerName() {
        if (this.isDrawnGame()) {
            this.winnerName = this.gameService.game.getLocalPlayer().name + ' et ' + this.gameService.game.getOpponent().name;
        } else if (this.gameService.game.getLocalPlayer().isWinner) {
            this.winnerName = this.gameService.game.getLocalPlayer().name;
        } else if (this.gameService.game.getOpponent().isWinner) {
            this.winnerName = this.gameService.game.getOpponent().name;
        }
    }

    // TODO: test if quit game still works (on the server too)
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
