import { AfterViewInit, Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Goal } from '@app/classes/goal/goal';
import { Player } from '@app/classes/player/player';
import { EndGamePopupComponent } from '@app/components/end-game-popup/end-game-popup.component';
import * as SocketHandler from '@app/modules/socket-handler';
import { GameService } from '@app/services/game.service/game.service';
import { GoalsService } from '@app/services/goals.service/goals.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { GAME_CAPACITY } from '../game-init-form/game-init-form.component';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements AfterViewInit {
    winnerName: string;
    sharedGoals: Goal[];
    localPlayer: Player;
    opponentPlayer: Player;
    private dialogRef: MatDialogRef<EndGamePopupComponent>;
    private socket: io.Socket;
    private readonly server: string;

    constructor(public router: Router, public dialog: MatDialog, private gameService: GameService, private goalsService: GoalsService) {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.winnerName = '';
        this.sharedGoals = this.goalsService.sharedGoals;
        this.localPlayer = gameService.game.getLocalPlayer();
        this.opponentPlayer = gameService.game.getOpponent();
    }
    ngAfterViewInit(): void {
        clearTimeout(this.gameService.game.gameTimer.intervalValue);
    }

    isLog2990(): string {
        return String(this.gameService.game.isLog2990);
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

    getPrivateGoalDescription(): string {
        return this.goalsService.getGoalOfAPlayer(this.localPlayer).description;
    }

    getOpponentGoalDescription(): string {
        return this.goalsService.getGoalOfAPlayer(this.opponentPlayer).description;
    }

    isPlayer1GoalAchieved(): boolean {
        return this.goalsService.getGoalOfAPlayer(this.localPlayer).isAchieved;
    }

    isPlayer2GoalAchieved(): boolean {
        return this.goalsService.getGoalOfAPlayer(this.opponentPlayer).isAchieved;
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

    quitGame(): void {
        // User confirmation popup
        this.dialogRef = this.dialog.open(EndGamePopupComponent);

        // User confirmation response
        this.dialogRef.afterClosed().subscribe((confirmQuit) => {
            if (confirmQuit) {
                this.socket.emit('leaveRoom');
                this.router.navigate(['/start']);
            }
        });
    }
}
