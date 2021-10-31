import { Component, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    winnerName: string;
    private dialogRef: MatDialogRef<EndGamePopupComponent>;
    constructor(public router: Router, public dialog: MatDialog, private gameService: GameService) {
        this.winnerName = '';
    }
    getPlayer1Name(): string {
        return this.gameService.currentGameService.game.creatorPlayer.name;
    }

    getPlayer2Name(): string {
        return this.gameService.currentGameService.game.opponentPlayer.name;
    }

    getLettersLeftCount(): number {
        return this.gameService.currentGameService.game.stock.letterStock.length;
    }

    getPlayer1LetterCount(): number {
        return this.gameService.currentGameService.localPlayer.letters.length;
    }

    getPlayer2LetterCount(): number {
        return this.gameService.currentGameService.localPlayer.letters.length;
    }

    getPlayer1Score(): number {
        return this.gameService.currentGameService.game.creatorPlayer.score;
    }

    getPlayer2Score(): number {
        return this.gameService.currentGameService.game.opponentPlayer.score;
    }

    isPlayer1Active(): boolean {
        return this.gameService.currentGameService.game.creatorPlayer.isActive;
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
    quitGame(): void {
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
        </div> `,
})
export class EndGamePopupComponent {
    // private readonly server = 'http://' + window.location.hostname + ':3000';
    // private socket: io.Socket;
    constructor(@Optional() public dialogReference: MatDialogRef<unknown>, private gameList: GameListService) {}
    disconnect() {
        this.gameList.disconnectUser();
    }
}
