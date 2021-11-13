import { Injectable } from '@angular/core';
import { PlaceParams } from '@app/classes/commands';
import { ErrorType } from '@app/classes/errors';
import { GameInitInfo, GameParameters, GameType, WaitingAreaGameParameters } from '@app/classes/game-parameters';
import { LetterStock } from '@app/classes/letter-stock';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { BoardUpdate, LettersUpdate } from '@app/classes/server-message';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
import { SocketHandler } from '@app/modules/socket-handler';
import { BehaviorSubject, Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';

export const TIMER_INTERVAL = 1000;
export const DEFAULT_LETTER_COUNT = 7;
export const MAX_TURNS_PASSED = 6;
const DOUBLE_DIGIT = 10;
const MINUTE_IN_SEC = 60;
@Injectable({
    providedIn: 'root',
})
export class GameService {
    game: GameParameters;
    isOpponentTurnObservable: Observable<boolean>;
    isOpponentTurnSubject: BehaviorSubject<boolean>;
    timer: string; // used for the ui timer?
    intervalValue: NodeJS.Timeout;
    private socket: io.Socket;
    private readonly server: string;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
        protected chatDisplayService: ChatDisplayService,
        protected placeService: PlaceService,
    ) {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.socketOnConnect();
        this.game = new GameParameters();
    }
    socketOnConnect() {
        this.socket.on('turn changed', (isTurnPassed: boolean, consecutivePassedTurns: number) => {
            this.game.isTurnPassed = isTurnPassed;
            this.game.consecutivePassedTurns = consecutivePassedTurns;
            if (!this.game.isEndGame) {
                // if it is not already the endgame
                const isLocalPlayerEndingGame = this.game.consecutivePassedTurns >= MAX_TURNS_PASSED && this.game.getLocalPlayer().isActive;
                if (isLocalPlayerEndingGame) {
                    this.endGame();
                }
                this.updateActivePlayer();
                this.resetTimer();
                this.game.isTurnPassed = false;
            } else {
                this.resetTimer();
            }
        });
        this.socket.on('gameEnded', () => {
            this.displayEndGameMessage();
            this.endLocalGame();
            this.resetTimer(); // basically we just want to stop the timer tbh
        });
        // updates board after a new word was placed
        this.socket.on('update board', (boardUpdate: BoardUpdate) => {
            this.updateBoard(boardUpdate.word, boardUpdate.orientation, new Vec2(boardUpdate.positionX, boardUpdate.positionY));
        });
        // updates the stock and the letters of the player who placed or exchanged letters
        this.socket.on('update letters', (update: LettersUpdate) => {
            this.game.stock.letterStock = update.newStock;
            this.game.players[update.playerIndex].letters = update.newLetters;
            if (update.newScore !== undefined) {
                this.game.players[update.playerIndex].score = update.newScore;
            }
        });
    }
    initializeSoloGame(initInfo: WaitingAreaGameParameters, virtualPlayerDifficulty: Difficulty) {
        if (initInfo.gameMode === GameType.Solo) {
            this.game.scrabbleBoard = new ScrabbleBoard(initInfo.isRandomBonus);
            this.game.stock = new LetterStock();
            this.game.totalCountDown = initInfo.totalCountDown;
            this.game.timerMs = this.game.totalCountDown;
            this.game.gameMode = initInfo.gameMode;
            this.game.setLocalPlayer(new LocalPlayer(initInfo.creatorName));
            this.game.setOpponent(new VirtualPlayer(initInfo.joinerName, virtualPlayerDifficulty));
            this.game.getLocalPlayer().letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
            this.game.getOpponent().letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
            const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
            this.game.players[starterPlayerIndex].isActive = true;
            // TODO: set objectives to initialize here
            // TODO: add creating a dictionary in client validation service (go put dictionary class back to how it was)
            console.log('init solo done:', this.game.players);
        }
    }
    initializeMultiplayerGame(initInfo: GameInitInfo) {
        if (initInfo.gameMode === GameType.MultiPlayer) {
            const localPlayerIndex = this.socket.id === initInfo.players[0].socketId ? 0 : 1;
            const opponentPlayerIndex = this.socket.id === initInfo.players[0].socketId ? 1 : 0;
            this.game.setLocalAndOpponentId(localPlayerIndex, opponentPlayerIndex);
            this.game.setLocalPlayer(initInfo.players[localPlayerIndex]);
            this.game.setOpponent(initInfo.players[opponentPlayerIndex]);
            this.game.scrabbleBoard = new ScrabbleBoard(initInfo.scrabbleBoard); // stock and board not init properly
            this.game.stock = new LetterStock(initInfo.stockLetters);
            this.game.totalCountDown = initInfo.totalCountDown;
            this.game.timerMs = this.game.totalCountDown;
            this.game.gameMode = initInfo.gameMode;
            // TODO:set objectives initialized in server
        }
    }
    startNewGame() {
        this.isOpponentTurnSubject = new BehaviorSubject<boolean>(this.game.getOpponent().isActive);
        this.isOpponentTurnObservable = this.isOpponentTurnSubject.asObservable();
        this.rackService.rackLetters = [];
        this.gridService.scrabbleBoard = this.game.scrabbleBoard;
        this.chatDisplayService.initialize(this.game.getLocalPlayer().name);
        this.addRackLetters(this.game.getLocalPlayer().letters);
        this.startCountdown();
    }
    resetTimer() {
        this.game.timerMs = +this.game.totalCountDown;
        this.secondsToMinutes();
        clearInterval(this.intervalValue);
        this.startCountdown();
    }
    secondsToMinutes() {
        const s = Math.floor(this.game.timerMs / MINUTE_IN_SEC);
        const ms = this.game.timerMs % MINUTE_IN_SEC;
        if (ms < DOUBLE_DIGIT) {
            this.timer = s + ':' + 0 + ms;
        } else {
            this.timer = s + ':' + ms;
        }
    }
    startCountdown() {
        if (!this.game.isEndGame) {
            this.secondsToMinutes();
            this.intervalValue = setInterval(() => {
                this.game.timerMs--;
                if (this.game.timerMs < 0) {
                    this.game.timerMs = 0; // to prevent timer from going into negative values?
                    this.game.isTurnPassed = true;
                    this.changeTurn();
                }
                this.secondsToMinutes();
            }, TIMER_INTERVAL);
        }
    }
    changeTurn() {
        if (!this.game.isEndGame) {
            // this.updateConsecutivePassedTurns(); TODO: copy this from solo game service
            this.updateActivePlayer();
            this.resetTimer();
            if (this.game.getOpponent().isActive) {
                this.isOpponentTurnSubject.next(this.game.getOpponent().isActive);
            }
            this.game.isTurnPassed = false; // reset isTurnedPassed when new turn starts
        }
    }

    async place(player: Player, placeParams: PlaceParams): Promise<ErrorType> {
        // TODO: add what place was in solo game service to call here
        // if solo mode use validation from client else call server
        const errorResult = ErrorType.NoError; // const errorResult = await super.place(player, placeParams); 
        if (errorResult === ErrorType.NoError) {
            this.socket.emit('word placed', {
                word: placeParams.word,
                orientation: placeParams.orientation,
                positionX: placeParams.position.x,
                positionY: placeParams.position.y,
            });
            this.socket.emit('place word', { stock: this.game.stock.letterStock, newLetters: player.letters, newScore: player.score });
        }
        return errorResult;
    }
    exchangeLetters(player: Player, letters: string): ErrorType {
        // TODO: add call to exchange method that was in solo
        const errorResult = ErrorType.NoError; // const errorResult = super.exchangeLetters(player, letters); 
        if (errorResult === ErrorType.NoError) {
            this.socket.emit('exchange letters', { stock: this.game.stock.letterStock, newLetters: player.letters, newScore: player.score });
        }
        return errorResult;
    }
    passTurn(player: Player): ErrorType {
        let errorResult = ErrorType.ImpossibleCommand;
        if (player.isActive) {
            this.game.isTurnPassed = true;
            this.changeTurn();
            errorResult = ErrorType.NoError;
        }
        return errorResult;
    }

    updateBoard(word: string, orientation: string, position: Vec2) {
        if (orientation === 'h') {
            for (const letter of word) {
                const character = new ScrabbleLetter(letter);
                character.tile.position.x = position.x;
                character.tile.position.y = position.y;
                this.gridService.drawLetter(character, position.x, position.y);
                this.gridService.scrabbleBoard.squares[position.x][position.y].isValidated = true;
                this.gridService.scrabbleBoard.squares[position.x][position.y].isBonusUsed = true;
                position.x++;
            }
        } else {
            for (const letter of word) {
                const character = new ScrabbleLetter(letter);
                character.tile.position.x = position.x;
                character.tile.position.y = position.y;
                this.gridService.drawLetter(character, position.x, position.y);
                this.gridService.scrabbleBoard.squares[position.x][position.y].isBonusUsed = true;
                this.gridService.scrabbleBoard.squares[position.x][position.y].isValidated = true;
                position.y++;
            }
        }
    }

    displayEndGameMessage() {
        const endGameMessages = this.chatDisplayService.createEndGameMessages(
            this.game.stock.letterStock,
            this.game.getLocalPlayer(),
            this.game.getOpponent(),
        );
        endGameMessages.forEach((message) => {
            this.chatDisplayService.addEntry(message);
        });
    }

    // TODO: check what was in multi 
    endGame() {
        this.socket.emit('endGame');
    }

    endLocalGame() {
        const localPlayerPoints = this.calculateRackPoints(this.game.getLocalPlayer());
        const oppnentPlayerPoints = this.calculateRackPoints(this.game.getOpponent());

        if (this.game.getLocalPlayer().isWinner === true) {
            this.game.getLocalPlayer().score += oppnentPlayerPoints;
            this.game.getOpponent().score -= oppnentPlayerPoints;
        } else if (this.game.getOpponent().isWinner === true) {
            this.game.getOpponent().score += localPlayerPoints;
            this.game.getLocalPlayer().score -= localPlayerPoints;
        } else {
            this.game.getLocalPlayer().score -= localPlayerPoints;
            this.game.getOpponent().score -= oppnentPlayerPoints;
            if (this.game.getLocalPlayer().score > this.game.getOpponent().score) {
                this.game.getLocalPlayer().isWinner = true;
            } else if (this.game.getLocalPlayer().score < this.game.getOpponent().score) {
                this.game.getOpponent().isWinner = true;
            } else {
                this.game.getLocalPlayer().isWinner = true;
                this.game.getOpponent().isWinner = true;
            }
        }
        clearInterval(this.intervalValue);
        this.game.timerMs = 0;
        this.secondsToMinutes();
        this.game.isEndGame = true;
    }

    updateActivePlayer() {
        // Switch the active player
        if (this.game.getLocalPlayer().isActive) {
            // If the rack is empty, end game + player won
            if (this.game.getLocalPlayer().letters.length === 0 && this.game.stock.letterStock.length !== 0) {
                this.game.getLocalPlayer().isWinner = true;
                this.endGame();
                return;
            }
            this.game.getLocalPlayer().isActive = false;
            this.game.getOpponent().isActive = true;
        } else {
            // If the rack is empty, end game + player won
            if (this.game.getOpponent().letters.length === 0 && this.game.stock.letterStock.length !== 0) {
                this.game.getOpponent().isWinner = true;
                this.endGame();
                return;
            }
            this.game.getOpponent().isActive = false;
            this.game.getLocalPlayer().isActive = true;
        }
    }

    addRackLetters(letters: ScrabbleLetter[]): void {
        for (const letter of letters) {
            this.addRackLetter(letter);
        }
    }
    addRackLetter(letter: ScrabbleLetter): void {
        this.rackService.addLetter(letter);
    }
    removeRackLetter(scrabbleLetter: ScrabbleLetter): void {
        const i = this.rackService.removeLetter(scrabbleLetter);
        this.game.getLocalPlayer().letters.splice(i, 1);
    }

    drawRack(newWords: ScrabbleWord[]): void {
        newWords.forEach((newWord) => {
            for (let j = 0; j < newWord.content.length; j++) {
                if (newWord.orientation === Axis.V) {
                    if (this.gridService.scrabbleBoard.squares[newWord.startPosition.x][newWord.startPosition.y + j].isValidated !== true) {
                        this.addRackLetter(newWord.content[j]);
                    }
                }
                if (newWord.orientation === Axis.H) {
                    if (this.gridService.scrabbleBoard.squares[newWord.startPosition.x + j][newWord.startPosition.y].isValidated !== true) {
                        this.addRackLetter(newWord.content[j]);
                    }
                }
            }
        });
    }
    getLettersSelected(): string {
        let letters = '';

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.rackService.exchangeSelected.length; i++) {
            if (this.rackService.exchangeSelected[i] === true) {
                letters += this.rackService.rackLetters[i].character;
                this.rackService.exchangeSelected[i] = false;
            }
        }
        return letters;
    }

    // TODO: could move this somewhere else if needed
    calculateRackPoints(player: Player): number {
        let totalValue = 0;
        player.letters.forEach((letter) => {
            totalValue += letter.value;
        });
        return totalValue;
    }
}
