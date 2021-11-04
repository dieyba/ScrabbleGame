import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { LetterStock } from './letter-stock.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { DEFAULT_LETTER_COUNT, MAX_TURNS_PASSED, SoloGameService } from './solo-game.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

@Injectable({
    providedIn: 'root',
})
export class MultiPlayerGameService extends SoloGameService {
    game: GameParameters;
    private socket: io.Socket;
    private readonly server: string;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
        protected chatDisplayService: ChatDisplayService,
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
        protected placeService: PlaceService,
    ) {
        super(gridService, rackService, chatDisplayService, validationService, wordBuilder, placeService);
        this.server = 'http://' + window.location.hostname + ':3000';
        this.socket = SocketHandler.requestSocket(this.server);
        this.socket.on('turn changed', (isTurnPassed: boolean, consecutivePassedTurns: number) => {
            this.game.isTurnPassed = isTurnPassed
            this.game.consecutivePassedTurns = consecutivePassedTurns;
            const isLocalPlayerEndingGame = this.game.consecutivePassedTurns >= MAX_TURNS_PASSED && this.game.localPlayer.isActive;
            if (isLocalPlayerEndingGame) {
                this.endGame();
            }
            this.updateActivePlayer();
            this.resetTimer();
            this.game.isTurnPassed = false;
        });
        this.socket.on('gameEnded', () => {
            this.displayEndGameMessage();
            this.endLocalGame();
        });
    }

    initializeGame2(game: GameParameters) {
        this.game = game;
        this.game.stock = new LetterStock();
        const localPlayerIndex = this.socket.id === this.game.players[0].socketId ? 0 : 1;
        const opponentPlayerIndex = this.socket.id === this.game.players[0].socketId ? 1 : 0;
        this.game.localPlayer = new LocalPlayer(game.gameRoom.playersName[localPlayerIndex]);
        this.game.opponentPlayer = new LocalPlayer(game.gameRoom.playersName[opponentPlayerIndex]);
        this.game.localPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.opponentPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.localPlayer.isActive = this.game.players[localPlayerIndex].isActive;
        this.game.opponentPlayer.isActive = this.game.players[opponentPlayerIndex].isActive;
        this.game.dictionary = new Dictionary(0);
        this.game.totalCountDown = game.totalCountDown;
        this.game.timerMs = +this.game.totalCountDown;
        this.game.randomBonus = game.randomBonus;
    }
    override changeTurn() {
        this.socket.emit('change turn', this.game.isTurnPassed, this.game.consecutivePassedTurns);
    }

    // TODO: see if endGame multi (and solo) works for when triggered by empty racks
    override endGame() {
        this.socket.emit('endGame');
    }
}
