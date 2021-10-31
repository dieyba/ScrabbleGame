import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlaceParams } from '@app/classes/commands';
import { Dictionary } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Vec2 } from '@app/classes/vec2';
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
            this.changePlayerAfterEmit();
            this.resetTimer();
        });
    }

    override initializeGame(gameInfo: FormGroup) {
        this.game = new GameParameters(gameInfo.controls.name.value, +gameInfo.controls.timer.value);
        this.chatDisplayService.entries = [];
        this.game.creatorPlayer = new LocalPlayer(gameInfo.controls.name.value);
        this.game.creatorPlayer.isActive = true;
        this.game.stock = new LetterStock();
        //this.game.opponentPlayer = new LocalPlayer(gameInfo.controls.opponent.value);
        //this.game.opponentPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        //this.game.opponentPlayer.isActive = false;
        this.game.dictionary = new Dictionary(+gameInfo.controls.dictionaryForm.value);
        this.game.totalCountDown = +gameInfo.controls.timer.value;
        this.game.randomBonus = gameInfo.controls.bonus.value;
        this.game.timerMs = +this.game.totalCountDown;
        return new GameParameters(this.game.creatorPlayer.name, this.game.timerMs);
    }
    initializeGame2(game: GameParameters) {
        this.game = game;
        this.game.stock = new LetterStock();
        this.game.creatorPlayer = new LocalPlayer(game.gameRoom.playersName[0]);
        this.game.creatorPlayer.isActive = true;
        this.game.opponentPlayer = new LocalPlayer(game.gameRoom.playersName[1]);
        this.game.opponentPlayer.isActive = false;
        this.game.opponentPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.creatorPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        //this.game.dictionary = new Dictionary(0);
        this.game.totalCountDown = game.totalCountDown;
        //this.game.randomBonus = gameInfo.controls.bonus.value;
        this.game.timerMs = +this.game.totalCountDown;
        this.game.creatorPlayer.socketId = game.players[0].socketId;
        this.game.opponentPlayer.socketId = game.players[1].socketId;
        this.localPlayer = this.socket.id === this.game.creatorPlayer.socketId ? this.game.creatorPlayer : this.game.opponentPlayer;
        // return new GameParameters(this.game.creatorPlayer.name, this.game.timerMs);
    }

    override createNewGame() {
        this.chatDisplayService.initialize(this.localPlayer.name);
        // Empty board and stack
        this.rackService.rackLetters = [];
        // Add rack letters for localPlayer and remote player on their own screen
        //this.game.creatorPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.addRackLetters(this.localPlayer.letters);
        // this.addRackLetters(this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT));
        this.startCountdown();
        this.game.hasTurnsBeenPassed[0] = false;
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

    // New Turn
    changeActivePlayer() {
        // Check if last turn was passed by player
        if (this.game.turnPassed) {
            this.game.hasTurnsBeenPassed[this.game.hasTurnsBeenPassed.length] = false;
            // Set last turn to hasBeenPassed = true
            this.game.hasTurnsBeenPassed[this.game.hasTurnsBeenPassed.length - 1] = true;
        } else {
            this.game.hasTurnsBeenPassed[this.game.hasTurnsBeenPassed.length] = false;
        }


        // Change active player and reset timer for new turn
        // const isLocalPlayerActive = this.game.creatorPlayer.isActive;
        // if (isLocalPlayerActive) {
        //     // If the rack is empty, end game + player won
        //     if (this.game.creatorPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
        //         this.game.creatorPlayer.isWinner = true;
        //         this.endGame();
        //         return;
        //     }
        //     this.game.creatorPlayer.isActive = false;
        //     this.game.opponentPlayer.isActive = true;
        // } else {
        //     // If the rack is empty, end game + player won
        //     if (this.game.opponentPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
        //         this.game.opponentPlayer.isWinner = true;
        //         this.endGame();
        //         return;
        //     }
        //     this.game.opponentPlayer.isActive = false;
        //     this.game.creatorPlayer.isActive = true;
        // }
        this.socket.emit('reset timer');
    }

    changePlayerAfterEmit() {
        // Change active player and reset timer for new turn
        const isLocalPlayerActive = this.game.creatorPlayer.isActive;
        if (isLocalPlayerActive) {
            // If the rack is empty, end game + player won
            if (this.game.creatorPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
                this.game.creatorPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.creatorPlayer.isActive = false;
            this.game.opponentPlayer.isActive = true;
        } else {
            // If the rack is empty, end game + player won
            if (this.game.opponentPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
                this.game.opponentPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.opponentPlayer.isActive = false;
            this.game.creatorPlayer.isActive = true;
        }
    }

    exchangeLetters(player: Player, letters: string): ErrorType {
        if (player.isActive && this.game.stock.letterStock.length > DEFAULT_LETTER_COUNT) {
            const lettersToRemove: ScrabbleLetter[] = [];

            if (player.removeLetter(letters) === true) {
                for (let i = 0; i < letters.length; i++) {
                    lettersToRemove[i] = new ScrabbleLetter(letters[i]);
                }
                const lettersToAdd: ScrabbleLetter[] = this.game.stock.exchangeLetters(lettersToRemove);
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

    override place(player: Player, placeParams: PlaceParams): ErrorType {
        const tempCoord = new Vec2();
        // Checking if its player's turn
        if (!this.placeService.canPlaceWord(player, placeParams)) {
            return ErrorType.SyntaxError;
        }
        // Removing all the letters from my "word" that are already on the board
        let wordCopy = placeParams.word;
        const letterOnBoard = this.gridService.scrabbleBoard.getStringFromCoord(
            placeParams.position,
            placeParams.word.length,
            placeParams.orientation,
        );
        for (const letter of letterOnBoard) {
            wordCopy = wordCopy.replace(letter.toLowerCase(), '');
        }
        // All letter are already placed
        if (wordCopy === '') {
            return ErrorType.SyntaxError;
        }
        // Checking if the rest of the letters are on the rack
        for (const letter of player.letters) {
            // If there is an star, removing a upper letter from "word" string
            if (letter.character === '*') {
                let upperLetter = '';
                for (const wordLetter of wordCopy) {
                    if (wordLetter === wordLetter.toUpperCase()) {
                        upperLetter = wordLetter;
                    }
                }
                wordCopy = wordCopy.replace(upperLetter, '');
            } else {
                wordCopy = wordCopy.replace(letter.character, '');
            }
        }
        // There should be no letters left, else there is not enough letter on the rack to place de "word"
        if (wordCopy !== '') {
            return ErrorType.SyntaxError;
        }
        // Placing letters
        tempCoord.clone(placeParams.position);
        for (const letter of placeParams.word) {
            if (!this.gridService.scrabbleBoard.squares[tempCoord.x][tempCoord.y].occupied) {
                // Taking letter from player and placing it
                this.placeService.placeLetter(player.letters, letter, tempCoord);
            }
            if (placeParams.orientation === 'h') {
                tempCoord.x++;
            } else {
                tempCoord.y++;
            }
        }
        const newLetters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
        for (const letter of newLetters) {
            this.rackService.addLetter(letter);
            player.letters.push(letter);
        }
        // call server to placeword
        this.socket.emit('placeLetter', this.game, placeParams);
        return ErrorType.NoError;
    }
}
