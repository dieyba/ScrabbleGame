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
import { DEFAULT_LETTER_COUNT, MAX_TURNS_PASSED, SoloGameService } from './solo-game.service';
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
        this.socketOnConnect();
    }

    socketOnConnect() {
        this.socket.on('turn changed', (isTurnPassed: boolean, consecutivePassedTurns: number) => {
            this.game.isTurnPassed = isTurnPassed
            this.game.consecutivePassedTurns = consecutivePassedTurns;
            if (!this.game.isEndGame) { // if it is not already the endgame
                const isLocalPlayerEndingGame = this.game.consecutivePassedTurns >= MAX_TURNS_PASSED && this.game.localPlayer.isActive;
                if (isLocalPlayerEndingGame) {
                    this.endGame();
                }
                this.updateActivePlayer();
                this.resetTimer();
                console.log("Changed turn (multi mode): ", this.game.localPlayer.name, " active:", this.game.localPlayer.isActive, ',',
                    this.game.opponentPlayer.name, " active: ", this.game.opponentPlayer.isActive, ',consecutive passed turns:', this.game.consecutivePassedTurns);
                this.game.isTurnPassed = false;
            }
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

        this.game.localPlayer.isActive = this.game.players[localPlayerIndex].isActive;
        this.game.opponentPlayer.isActive = this.game.players[opponentPlayerIndex].isActive;
    }

    override async place(player: Player, placeParams: PlaceParams): Promise<ErrorType> {
        const errorResult = await super.place(player, placeParams);
        if (errorResult === ErrorType.NoError) {
            this.socket.emit('word placed', { word: placeParams.word, orientation: placeParams.orientation, positionX: placeParams.position.x, positionY: placeParams.position.y });
            this.socket.emit('place word', { stock: this.stock.letterStock, newLetters: player.letters, newScore: player.score });
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

    // TO DO : eviter la duplication de code
    updateBoard(word: string, orientation: string, position: Vec2) {
        if (orientation === 'h') {
            for (const letter of word) {
                let character = new ScrabbleLetter(letter);
                character.tile.position.x = position.x;
                character.tile.position.y = position.y;
                this.gridService.drawLetter(character, position.x, position.y);
                this.gridService.scrabbleBoard.squares[position.x][position.y].isValidated = true;
                this.gridService.scrabbleBoard.squares[position.x][position.y].isBonusUsed = true;
                position.x++;
            }
        } else {
            for (const letter of word) {
                let character = new ScrabbleLetter(letter)
                character.tile.position.x = position.x;
                character.tile.position.y = position.y;
                this.gridService.drawLetter(character, position.x, position.y);
                this.gridService.scrabbleBoard.squares[position.x][position.y].isValidated = true;
                position.y++;
            }
        }
    }
    override changeTurn() {
        this.socket.emit('change turn', this.game.isTurnPassed, this.game.consecutivePassedTurns);
    }

    // TODO: see if endGame multi (and solo) works for when triggered by empty racks
    override endGame() {
        this.socket.emit('endGame');
    }
}
