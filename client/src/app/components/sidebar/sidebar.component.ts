import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    player1Name: string;
    player2Name: string;
    winnerName: string;
    isSolo: boolean;

    constructor(private gameService: GameService) {
        this.player1Name = this.gameService.currentGameService.game.creatorPlayer.name;
        this.player2Name = this.gameService.currentGameService.game.opponentPlayer.name;
        this.winnerName = '';
    }

    getLettersLeftCount(): number {
        return this.gameService.currentGameService.game.stock.letterStock.length;
    }

    getPlayer1LetterCount(): number {
        return this.gameService.currentGameService.game.creatorPlayer.letters.length;
    }

    getPlayer2LetterCount(): number {
        return this.gameService.currentGameService.game.opponentPlayer.letters.length;
    }

    getPlayer1Score(): number {
        return this.gameService.currentGameService.game.creatorPlayer.score;
    }

    getPlayer2Score(): number {
        return this.gameService.currentGameService.game.opponentPlayer.score;
    }

    getTimer(): string {
        return this.gameService.currentGameService.timer;
    }

    isPlayer1Active(): boolean {
        return this.gameService.currentGameService.game.creatorPlayer.isActive;
    }

    isPlayer2Active(): boolean {
        return this.gameService.currentGameService.game.opponentPlayer.isActive;
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
}
