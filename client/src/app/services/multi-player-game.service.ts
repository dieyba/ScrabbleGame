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
    areNewWordsValid: boolean = false;
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
        this.socket.on('timer reset', () => {
            this.updateActivePlayer();
            this.resetTimer();
        });
        this.socket.on('increaseTurnsPassed', (hasTurnsBeenPassed: boolean[]) => {
            this.game.hasTurnsBeenPassed = hasTurnsBeenPassed;
            const isLocalPlayerEndingGame = this.isConsecutivePassedTurnsLimit() && this.game.localPlayer.isActive;
            if (isLocalPlayerEndingGame) {
                this.endGame(); // calling MultiPlayerGameService to end game on both clients
            }
            this.currentTurnId++;
        });
        this.socket.on('gameEnded', () => {
            this.displayEndGameMessage();
            this.endLocalGame();
        });
        // TODO: add a socket.on 'synchronize' for board and player or something
        // Need to have the opponent player letters syncrhonized on both clients for the displayEndGameMessage(),
        // or ill pass it when emitting end game ig but its simpler to just synchronize when exchange/place
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

    // TODO: add override function to emit to server to syncrhonize board and player letters
    // or do that emit in exchange service and place service

    override updateHasTurnsBeenPassed(isCurrentTurnedPassed: boolean) {
        this.socket.emit('updateTurnsPassed', isCurrentTurnedPassed, this.game.hasTurnsBeenPassed);
    }
    override changeActivePlayer() {
        this.socket.emit('reset timer');
    }
    // TODO: see if endGame multi (en solo ig) works for when triggered by empty racks
    override endGame() {
        this.socket.emit('endGame');
    }
}
