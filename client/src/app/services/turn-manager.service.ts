import { Injectable } from '@angular/core';
import { GameType } from '@app/classes/game-parameters';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { EndGameService } from './end-game.service';
import { GameService } from './game.service';
import { VirtualPlayerService } from './virtual-player.service';
export const MAX_TURNS_PASSED = 6;

@Injectable({
  providedIn: 'root'
})
export class TurnManagerService {
  private consecutivePassedTurns: number;
  private socket: io.Socket;
  private readonly server: string;

  constructor(private gameService: GameService, private endGameService: EndGameService, private virtualPlayerService: VirtualPlayerService) {
    this.consecutivePassedTurns = 0;
    this.server = environment.socketUrl;
    this.socket = SocketHandler.requestSocket(this.server);
    this.gameService.game.gameTimer.isTimerEndObservable.subscribe((isTimerEnd: boolean) => {
      this.gameService.isTurnPassed = true;
      this.gameService.isTurnEndSubject.next(this.gameService.isTurnPassed);
    });
    this.socketOnConnect();
  }
  initalize() {
    this.consecutivePassedTurns = 0;
  }

  socketOnConnect() {
    this.socket.on('turn changed', (isTurnPassed: boolean, consecutivePassedTurns: number) => {
      this.gameService.isTurnPassed = isTurnPassed;
      this.consecutivePassedTurns = consecutivePassedTurns;
      if (!this.gameService.game.isEndGame && this.consecutivePassedTurns >= MAX_TURNS_PASSED) {
        this.endGameService.endGame();
        this.updateActivePlayer();
        this.gameService.game.gameTimer.resetTimer(this.gameService.game.isEndGame);
        this.gameService.isTurnPassed = false;
      }
    });
  }
  changeTurn() {
    if (this.gameService.game.isEndGame) {
      return;
    }
    // change turn
    if (this.gameService.game.gameMode === GameType.Solo) {
      this.updateConsecutivePassedTurns();
      this.updateActivePlayer();
      this.gameService.game.gameTimer.resetTimer(this.gameService.game.isEndGame);
      const isVirtualPlayerCanPlay =
        this.gameService.game.getOpponent() instanceof VirtualPlayer &&
        this.gameService.game.getOpponent().isActive;
      if (isVirtualPlayerCanPlay) {
        this.virtualPlayerService.playTurn();
      }
      this.gameService.isTurnPassed = false; // reset isTurnedPassed when new turn starts
    } else {
      this.socket.emit('change turn', this.gameService.isTurnPassed, this.consecutivePassedTurns);
    }
  }
  updateConsecutivePassedTurns() {
    // Check if last 5 turns have been passed (by the command or the timer running out)
    this.consecutivePassedTurns = this.gameService.isTurnPassed ? this.consecutivePassedTurns + 1 : 0;
    if (this.consecutivePassedTurns >= MAX_TURNS_PASSED) {
      this.endGameService.endGame();
    }
  }
  updateActivePlayer() {
    let activePlayer = this.gameService.game.getLocalPlayer().isActive ? this.gameService.game.getLocalPlayer() : this.gameService.game.getOpponent();
    let inactivePlayer = this.gameService.game.getLocalPlayer().isActive ? this.gameService.game.getOpponent() : this.gameService.game.getLocalPlayer();
    // Call end game if a place command ended the game
    if (activePlayer.letters.length === 0 && this.gameService.game.stock.isEmpty()) {
      activePlayer.isWinner = true;
      this.endGameService.endGame();
      return;
    }
    activePlayer.isActive = false;
    inactivePlayer.isActive = true;
  }
}
