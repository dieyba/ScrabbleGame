import { Component, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameListService } from '@app/services/game-list.service';
import { MultiPlayerGameService } from '@app/services/multi-player-game.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    winnerName: string;
    isSolo: boolean;
    private dialogRef: MatDialogRef<EndGamePopupComponent>;
    constructor(public router: Router, public dialog: MatDialog, private gameService: MultiPlayerGameService, private gameList: GameListService) {
        console.log(this.gameList.players);
        this.winnerName = '';
    }
    getPlayer1Name(): string {
        return this.gameService.game.creatorPlayer.name;
    }

    getPlayer2Name(): string {
        return this.gameService.game.opponentPlayer.name;
    }

    getLettersLeftCount(): number {
        return this.gameService.game.stock.letterStock.length;
    }

    getPlayer1LetterCount(): number {
        return this.gameService.game.creatorPlayer.letters.length;
    }

    getPlayer2LetterCount(): number {
        return this.gameService.game.opponentPlayer.letters.length;
    }

    getPlayer1Score(): number {
        return this.gameService.game.creatorPlayer.score;
    }

    getPlayer2Score(): number {
        return this.gameService.game.opponentPlayer.score;
    }

    isPlayer1Active(): boolean {
        return this.gameService.game.creatorPlayer.isActive;
    }

    isPlayer2Active(): boolean {
        return this.gameService.game.creatorPlayer.isActive;
    }
    getTimer(): string {
        return this.gameService.timer;
    }

    isEndGame(): boolean {
        this.getWinnerName();
        return this.gameService.game.isEndGame;
    }

    hasWinner(): boolean {
        return this.gameService.game.creatorPlayer.isWinner || this.gameService.game.opponentPlayer.isWinner;
    }

    isDrawnGame(): boolean {
        if (this.gameService.game.creatorPlayer.isWinner && this.gameService.game.opponentPlayer.isWinner) {
            return true;
        } else {
            return false;
        }
    }

    getWinnerName() {
        if (this.isDrawnGame()) {
            this.winnerName = this.gameService.game.creatorPlayer.name + ' et ' + this.gameService.game.opponentPlayer.name;
        }
        if (this.gameService.game.creatorPlayer.isWinner) {
            this.winnerName = this.gameService.game.creatorPlayer.name;
        }
        if (this.gameService.game.opponentPlayer.isWinner) {
            this.winnerName = this.gameService.game.opponentPlayer.name;
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
        </div> `,
})
export class EndGamePopupComponent {
    constructor(@Optional() public dialogReference: MatDialogRef<any>) {}
}
