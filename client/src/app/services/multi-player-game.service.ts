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
import { DEFAULT_LETTER_COUNT, SoloGameService } from './solo-game.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

@Injectable({
    providedIn: 'root',
})
export class MultiPlayerGameService extends SoloGameService {
    game: GameParameters;
    private socket: io.Socket;
    areNewWordsValid: boolean = false;
    private readonly server: string;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
        protected chatDisplayService: ChatDisplayService,
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
        protected placeService: PlaceService, // protected gameList: GameListService,
    ) {
        super(gridService, rackService, chatDisplayService, validationService, wordBuilder, placeService);
        this.server = 'http://' + window.location.hostname + ':3000';
        this.socket = SocketHandler.requestSocket(this.server);
        this.socket.on('timer reset', (timer: number) => {
            this.updateActivePlayer();
            this.resetTimer();
        });
        this.socket.on('increaseTurnsPassed', (hasTurnsBeenPassed: boolean[]) => {
            this.game.hasTurnsBeenPassed = hasTurnsBeenPassed;
            if (this.isConsecutivePassedTurnsLimit()) {
                super.endGame(); // TODO: see why this triggers end game twice
            }
            this.currentTurnId++;
        });
        this.socket.on('gameEnded', () => {
            super.endGame(); // TODO: see why this triggers end game twice
        });
    }

    initializeGame2(game: GameParameters) {
        this.game = game;
        this.game.stock = new LetterStock()
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

    // TODO: add override function to emit to server to syncrhonize board and player letters
    // or do that emit in exchange service and place service

    override updateHasTurnsBeenPassed(isCurrentTurnedPassed: boolean) {
        this.socket.emit('updateTurnsPassed', isCurrentTurnedPassed, this.game.hasTurnsBeenPassed);
    }
    override changeActivePlayer() {
        this.socket.emit('reset timer');
    }
    override endGame() {
        this.socket.emit('endGame');
    }
    override displayEndGameMessage() {
        const endGameMessages = this.chatDisplayService.createEndGameMessages(this.game.stock.letterStock, this.game.localPlayer, this.game.opponentPlayer);
        endGameMessages.forEach(chatEntry => {
            this.chatDisplayService.sendSystemMessageToServer(chatEntry.message);
        });
    }
}
