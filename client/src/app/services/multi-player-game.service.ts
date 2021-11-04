import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlaceParams } from '@app/classes/commands';
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
import { DEFAULT_LETTER_COUNT, SoloGameService } from './solo-game.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';
const LOCAL_PLAYER_INDEX = 0;
@Injectable({
    providedIn: 'root',
})
export class MultiPlayerGameService extends SoloGameService {
    game: GameParameters;
    stock: LetterStock;
    private socket: io.Socket;
    private readonly server: string;
    // localPlayer: LocalPlayer;

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
        this.socket.on('timer reset', (timer: number) => {
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
        this.socket.on('update board', (board: any) => {
            this.updateBoard(board.word, board.orientation, new Vec2(board.positionX, board.positionY));
        });
        this.socket.on('letters exchange', (update: any) => {
            this.stock.letterStock = update.stock;
            this.game.opponentPlayer.letters = update.newLetters;
            this.game.opponentPlayer.score = update.newScore;
        });
        this.socket.on('update place', (update: any) => {
            this.stock.letterStock = update.stock;
            this.game.opponentPlayer.letters = update.newLetters;
            this.game.opponentPlayer.score = update.newScore;
        });
        // TODO: add a socket.on 'synchronize' for board and player or something
        // Need to have the opponent player letters syncrhonized on both clients for the displayEndGameMessage(),
        // or ill pass it when emitting end game ig but its simpler to just synchronize when exchange/place
    }
    override initializeGame(gameInfo: FormGroup): GameParameters {
        this.game = new GameParameters(gameInfo.controls.name.value, +gameInfo.controls.timer.value, gameInfo.controls.bonus.value);
        this.chatDisplayService.entries = [];
        this.game.creatorPlayer = this.game.localPlayer;
        const starterPlayerIndex = Math.round(Math.random()); // return 0 or 1
        const starterPlayer = starterPlayerIndex === LOCAL_PLAYER_INDEX ? this.game.localPlayer : this.game.opponentPlayer;
        this.game.opponentPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.creatorPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.stock = this.stock.letterStock;
        starterPlayer.isActive = true;
        return this.game;
    }

    initializeGame2(game: GameParameters) {
        this.game = game;
        this.stock.letterStock = game.stock;
        const localPlayerIndex = this.socket.id === this.game.players[0].socketId ? 0 : 1;
        const opponentPlayerIndex = this.socket.id === this.game.players[0].socketId ? 1 : 0;

        let tempOpponentPlayer = new LocalPlayer(game.gameRoom.playersName[opponentPlayerIndex]);
        tempOpponentPlayer.letters = game.opponentPlayer.letters;
        this.game.creatorPlayer = game.creatorPlayer;
        this.game.opponentPlayer = tempOpponentPlayer;

        this.game.localPlayer = new LocalPlayer(game.gameRoom.playersName[localPlayerIndex]);
        this.game.localPlayer.letters = this.socket.id === this.game.players[0].socketId ? this.game.creatorPlayer.letters : this.game.opponentPlayer.letters;
        // this.game.opponentPlayer = new LocalPlayer(game.gameRoom.playersName[opponentPlayerIndex]);

        // this.game.opponentPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        // this.game.localPlayer.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);

        this.game.localPlayer.isActive = this.game.players[localPlayerIndex].isActive;
        this.game.opponentPlayer.isActive = this.game.players[opponentPlayerIndex].isActive;
        // this.game.localPlayer = this.socket.id === this.game.creatorPlayer.socketId ? this.game.creatorPlayer : this.game.opponentPlayer;
        /// todo c'est ici que le 2e rejoint pour randomize qui joue en 1er
        console.log('les joueurs dans le initialize2 : ', this.game);
    }

    override async place(player: Player, placeParams: PlaceParams): Promise<ErrorType> {
        const errorResult = super.place(player, placeParams);
        // la fonction peut retourner NoError mais le mot n'appartient pas au dictionnaire, a regler
        if (await errorResult === ErrorType.NoError) {
            console.log('avant les emits');
            this.socket.emit('word placed', { word: placeParams.word, orientation: placeParams.orientation, positionX: placeParams.position.x, positionY: placeParams.position.y });
            console.log('avant le emit');
            this.socket.emit('place word', { stock: this.stock.letterStock, newLetters: player.letters, newScore: player.score });
            console.log('apres les emits');
        }
        return errorResult;
    }

    override exchangeLetters(player: Player, letters: string): ErrorType {
        const errorResult = super.exchangeLetters(player, letters);
        if (errorResult === ErrorType.NoError) {
            this.socket.emit('exchange letters', { stock: this.stock.letterStock, newLetters: player.letters, newScore: player.score });
        }
        return errorResult;
    }

    updateBoard(word: string, orientation: string, position: Vec2) {
        if (orientation === 'h') {
            for (const letter of word) {
                let character = new ScrabbleLetter(letter);
                character.tile.position.x = position.x;
                character.tile.position.y = position.y;
                this.gridService.drawLetter(character, position.x, position.y);
                position.x++;
            }
        } else {
            for (const letter of word) {
                let character = new ScrabbleLetter(letter)
                character.tile.position.x = position.x;
                character.tile.position.y = position.y;
                this.gridService.drawLetter(character, position.x, position.y);
                position.y++;
            }
        }
    }

    // TODO: add override function to emit to server to syncrhonize board and player letters
    // or do that emit in exchange service and place service

    override updateHasTurnsBeenPassed(isCurrentTurnedPassed: boolean) {
        this.socket.emit('updateTurnsPassed', isCurrentTurnedPassed, this.game.hasTurnsBeenPassed);
    }
    override changeActivePlayer() {
        this.socket.emit('reset timer');
    }
    // TODO: see if endGame multi (and solo ig) works for when triggered by empty racks
    override endGame() {
        this.socket.emit('endGame');
    }
}
