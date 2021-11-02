import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorType } from '@app/classes/errors';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { LetterStock } from './letter-stock.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { DEFAULT_LETTER_COUNT, SoloGameService, TIMER_INTERVAL } from './solo-game.service';
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
        // Change active player and reset timer
        this.socket.on('timer reset', (timer: number) => {
            this.updateActivePlayer();
            this.resetTimer();
        });
    }
    override initializeGame(gameInfo: FormGroup): GameParameters {
        this.game = new GameParameters(gameInfo.controls.name.value, +gameInfo.controls.timer.value, gameInfo.controls.bonus.value);
        console.log('moi')
        this.chatDisplayService.entries = [];
        this.game.creatorPlayer = this.game.localPlayer;

        return this.game;
    }

    initializeGame2(game: GameParameters) {
        this.game = game;
        this.game.creatorPlayer.stock = new LetterStock();
        const localPlayerIndex = this.socket.id === this.game.players[0].socketId ? 0 : 1;
        const opponentPlayerIndex = this.socket.id === this.game.players[0].socketId ? 1 : 0;
        this.game.localPlayer = new LocalPlayer(game.gameRoom.playersName[localPlayerIndex]);
        this.game.opponentPlayer = new LocalPlayer(game.gameRoom.playersName[opponentPlayerIndex]);
        this.game.localPlayer.letters = this.game.creatorPlayer.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.opponentPlayer.letters = this.game.creatorPlayer.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.localPlayer.isActive = this.game.players[localPlayerIndex].isActive;
        this.game.opponentPlayer.isActive = this.game.players[opponentPlayerIndex].isActive;
        this.game.scrabbleBoard = game.scrabbleBoard;

        /// todo c'est ici que le 2e rejoint pour randomize qui joue en 1er
        const starterPlayerIndex = Math.round(Math.random()); // return 0 or 1
        const starterPlayer = starterPlayerIndex === localPlayerIndex ? this.game.localPlayer : this.game.opponentPlayer;
        starterPlayer.isActive = true;
    }

    override changeActivePlayer() {
        this.updateLastTurnsPassed();
        this.socket.emit('reset timer');
    }

    override displayEndGameMessage() {
        const endGameMessages = this.chatDisplayService.createEndGameMessages(this.game.creatorPlayer.stock.letterStock, this.game.localPlayer, this.game.opponentPlayer);
        endGameMessages.forEach(chatEntry => {
            this.chatDisplayService.sendSystemMessageToServer(chatEntry.message);
        });
    }

    override startCountdown() {
        this.secondsToMinutes();
        this.intervalValue = setInterval(() => {
            this.game.timerMs--;
            if (this.game.timerMs < 0) {
                this.game.timerMs = 0;
                this.secondsToMinutes();
                this.changeActivePlayer();
                // this.resetTimer();
            }
            this.secondsToMinutes();
        }, TIMER_INTERVAL);
    }

    changePlayerAfterEmit() {
        // Change active player and reset timer for new turn
        const isLocalPlayerActive = this.game.creatorPlayer.isActive;
        if (isLocalPlayerActive) {
            // If the rack is empty, end game + player won
            if (this.game.creatorPlayer.letters.length === 0 && this.game.creatorPlayer.stock.isEmpty()) {
                this.game.creatorPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.creatorPlayer.isActive = false;
            this.game.opponentPlayer.isActive = true;
        } else {
            // If the rack is empty, end game + player won
            if (this.game.opponentPlayer.letters.length === 0 && this.game.creatorPlayer.stock.isEmpty()) {
                this.game.opponentPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.opponentPlayer.isActive = false;
            this.game.creatorPlayer.isActive = true;
        }
    }

    exchangeLetters(player: Player, letters: string): ErrorType {
        if (player.isActive && this.game.creatorPlayer.stock.letterStock.length > DEFAULT_LETTER_COUNT) {
            const lettersToRemove: ScrabbleLetter[] = [];

            if (player.removeLetter(letters) === true) {
                for (let i = 0; i < letters.length; i++) {
                    lettersToRemove[i] = new ScrabbleLetter(letters[i]);
                }
                const lettersToAdd: ScrabbleLetter[] = this.game.creatorPlayer.stock.exchangeLetters(lettersToRemove);
                for (let i = 0; i < lettersToAdd.length; i++) {
                    this.rackService.removeLetter(lettersToRemove[i]);
                    this.addRackLetter(lettersToAdd[i]);
                    player.addLetter(lettersToAdd[i]);
                }
                this.passTurn(player);
                return ErrorType.NoError;
            }
        }
        return ErrorType.ImpossibleCommand;
    }

    exchangeLettersSelected(player: Player) {
        let letters = '';
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.rackService.exchangeSelected.length; i++) {
            if (this.rackService.exchangeSelected[i] === true) {
                letters += this.rackService.rackLetters[i].character;
                this.rackService.exchangeSelected[i] = false;
            }
        }

        this.exchangeLetters(player, letters);
    }

    addRackLetters(letters: ScrabbleLetter[]): void {
        for (const letter of letters) {
            this.addRackLetter(letter);
        }
    }

    addRackLetter(letter: ScrabbleLetter): void {
        this.rackService.addLetter(letter);
        // this.game.creatorPlayer.letters[this.game.creatorPlayer.letters.length] = letter;
        // this.localPlayer.letters[this.localPlayer.letters.length] = letter;
        // this.localPlayer.addLetter(letter);
    }
}
