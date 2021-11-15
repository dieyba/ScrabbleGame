import { Injectable } from '@angular/core';
import { GameType } from '@app/classes/game-parameters';
import { calculateRackPoints } from '@app/classes/player';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatDisplayService } from './chat-display.service';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class EndGameService {
  private socket: io.Socket;
  private readonly server: string;

  constructor(private gameService: GameService, private chatDisplayService: ChatDisplayService) {
    this.server = environment.socketUrl;
    this.socket = SocketHandler.requestSocket(this.server);
    this.socket.on('gameEnded', () => {
      this.chatDisplayService.displayEndGameMessage(this.gameService.game.stock.letterStock, this.gameService.game.getLocalPlayer(), this.gameService.game.getOpponent());
      this.endLocalGame();
      this.gameService.game.gameTimer.resetTimer(this.gameService.game.isEndGame); // to stop the timer
    });
  }
  endGame() {
    if (this.gameService.game.gameMode === GameType.Solo) {
      this.chatDisplayService.displayEndGameMessage(this.gameService.game.stock.letterStock, this.gameService.game.getLocalPlayer(), this.gameService.game.getOpponent());
      this.endLocalGame();
      this.gameService.game.gameTimer.resetTimer(this.gameService.game.isEndGame);
    } else if (this.gameService.game.gameMode === GameType.MultiPlayer) {
      this.socket.emit('endGame');
    }
  }
  private endLocalGame() {
    const isEmptyPlayerRack = this.gameService.game.getLocalPlayer().letters.length === 0 && this.gameService.game.getLocalPlayer().letters.length === 0;
    const isEndGameAfterPlacing = this.gameService.game.stock.isEmpty() && isEmptyPlayerRack;
    if (isEndGameAfterPlacing) {
      let winnerPlayer = this.gameService.game.getLocalPlayer().letters.length === 0 ? this.gameService.game.getLocalPlayer() : this.gameService.game.getOpponent();
      let loserPlayer = this.gameService.game.getLocalPlayer().letters.length === 0 ? this.gameService.game.getOpponent() : this.gameService.game.getLocalPlayer();
      winnerPlayer.score += calculateRackPoints(loserPlayer);
      loserPlayer.score -= calculateRackPoints(winnerPlayer);
    } else {
      this.endGameAfterPassedTurns();
    }
    clearInterval(this.gameService.game.gameTimer.intervalValue);
    this.gameService.game.gameTimer.timerMs = 0;
    this.gameService.game.gameTimer.secondsToMinutes();
    this.gameService.game.isEndGame = true;
  }
  private endGameAfterPassedTurns() {
    let maxScore = 0;
    // remove points for letters still in the player's rack and find the highest score
    this.gameService.game.players.forEach(player => {
      player.score -= calculateRackPoints(player);
      if (player.score > maxScore) {
        maxScore = player.score;
      }
    });
    // set the winner, both players are winner if they have the same score
    this.gameService.game.players.forEach(player => {
      if (player.score === maxScore) {
        player.isWinner = true;
      }
    });
  }
}
