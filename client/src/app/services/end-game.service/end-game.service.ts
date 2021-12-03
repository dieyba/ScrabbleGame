import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameType } from '@app/classes/game-parameters/game-parameters';
import { calculateRackPoints } from '@app/classes/player/player';
import * as SocketHandler from '@app/modules/socket-handler';
import { BASE_URL, BestScoresService } from '@app/services/best-scores.service/best-scores.service';
import { ChatDisplayService } from '@app/services/chat-display.service/chat-display.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { GameService } from '../game.service/game.service';

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    private socket: io.Socket;
    private readonly server: string;

    constructor(
        private gameService: GameService,
        private chatDisplayService: ChatDisplayService,
        private bestScoresService: BestScoresService,
        private snack: MatSnackBar,
    ) {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.socket.on('gameEnded', () => {
            this.chatDisplayService.displayEndGameMessage(
                this.gameService.game.stock.letterStock,
                this.gameService.game.getLocalPlayer(),
                this.gameService.game.getOpponent(),
            );
            this.endLocalGame();
            this.gameService.resetTimer(); // to stop the timer
        });
    }
    endGame() {
        if (this.gameService.game.gameMode === GameType.Solo) {
            this.chatDisplayService.displayEndGameMessage(
                this.gameService.game.stock.letterStock,
                this.gameService.game.getLocalPlayer(),
                this.gameService.game.getOpponent(),
            );
            this.endLocalGame();
            this.gameService.resetTimer();
        } else if (this.gameService.game.gameMode === GameType.MultiPlayer) {
            this.socket.emit('endGame');
        }
    }
    private endLocalGame() {
        const isEmptyPlayerRack =
            this.gameService.game.getLocalPlayer().letters.length === 0 || this.gameService.game.getOpponent().letters.length === 0;
        const isEndGameAfterPlacing = this.gameService.game.stock.isEmpty() && isEmptyPlayerRack;
        if (isEndGameAfterPlacing) {
            this.endGameAfterPlace();
        } else {
            this.endGameAfterPassedTurns();
        }
        const URL = String(this.gameService.game.isLog2990) === 'true' ? '/log2990Mode/send' : '/classicMode/send';
        this.bestScoresService
            .postBestScore(this.gameService.game.getLocalPlayer().name, this.gameService.game.getLocalPlayer().score, BASE_URL + URL)
            .subscribe(
                () => {
                    /* Do nothing */
                },
                (error: HttpErrorResponse) => {
                    if (error.status !== HttpStatusCode.Ok) {
                        this.snack.open(
                            'Désolé votre score ne pourra pas être éligible au tableau' +
                            'des meilleurs scores, la base de données et/ou le serveur est momentanément indisponible.' +
                            'Veuillez réessayer plus tard!',
                            'close',
                        );
                    }
                },
            );
        clearInterval(this.gameService.game.gameTimer.intervalValue);
        this.gameService.game.gameTimer.timerMs = 0;
        this.gameService.game.gameTimer.secondsToMinutes();
        this.gameService.game.isEndGame = true;
    }
    private endGameAfterPlace() {
        const winnerPlayer =
            this.gameService.game.getLocalPlayer().letters.length === 0
                ? this.gameService.game.getLocalPlayer()
                : this.gameService.game.getOpponent();
        const loserPlayer =
            this.gameService.game.getLocalPlayer().letters.length === 0
                ? this.gameService.game.getOpponent()
                : this.gameService.game.getLocalPlayer();
        const loserRemainingLettersPoints = calculateRackPoints(loserPlayer);
        winnerPlayer.score += loserRemainingLettersPoints;
        loserPlayer.score -= loserRemainingLettersPoints;
        winnerPlayer.isWinner = true;
        loserPlayer.isWinner = false;
    }
    private endGameAfterPassedTurns() {
        let maxScore = this.gameService.game.players[0].score - calculateRackPoints(this.gameService.game.players[0]);
        this.gameService.game.players.forEach((player) => {
            // remove points for letters still in the players' rack and find the highest score
            player.score -= calculateRackPoints(player);
            if (player.score > maxScore) {
                maxScore = player.score;
            }
        });
        // set the winner, both players are winner if they have the same score
        this.gameService.game.players.forEach((player) => {
            if (player.score === maxScore) {
                player.isWinner = true;
            }
        });
    }
}
