import { Injectable } from '@angular/core';
import { GameType } from '@app/classes/game-parameters';
import { MultiPlayerGameService } from './multi-player-game.service';
import { SoloGameService } from './solo-game.service';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    currentGameService: SoloGameService;

    constructor(protected soloGameService: SoloGameService, protected multiPlayerGameService: MultiPlayerGameService) {}

    initializeGameType(gameType: GameType) {
        switch (gameType) {
            case GameType.Solo:
                this.currentGameService = this.soloGameService;
                break;
            case GameType.MultiPlayer:
                this.currentGameService = this.multiPlayerGameService;
                break;
        }
    }
}
