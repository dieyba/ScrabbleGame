import { Injectable } from '@angular/core';
import { PlaceParams } from '@app/classes/commands';
import { ErrorType } from '@app/classes/errors';
import { GameInitInfo, GameParameters, GameType } from '@app/classes/game-parameters';
import { LetterStock } from '@app/classes/letter-stock';
import { Player } from '@app/classes/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { BoardUpdate, LettersUpdate } from '@app/classes/server-message';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
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
    localPlayerIndex: number; // TODO: create getLocalPlayer(), getOpponent() in game params instead?
    opponentPlayerIndex: number;
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
        this.game = {
            players: new Array<Player>(),
            totalCountDown: 0,
            timerMs: 0,
            scrabbleBoard: new ScrabbleBoard(),
            stock: new LetterStock(),
            isEndGame: false,
            gameMode: GameType.Solo,
            isLOG2990: false,
            isTurnPassed: false,
            consecutivePassedTurns: 0,
        };
    }
    socketOnConnect() {
        this.socket.on('turn changed', (isTurnPassed: boolean, consecutivePassedTurns: number) => {
            this.game.isTurnPassed = isTurnPassed;
            this.game.consecutivePassedTurns = consecutivePassedTurns;
            if (!this.game.isEndGame) {
                // if it is not already the endgame
                const isLocalPlayerEndingGame = this.game.consecutivePassedTurns >= MAX_TURNS_PASSED && this.game.players[this.localPlayerIndex].isActive;
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
    initializeGame(initInfo: GameInitInfo) {
        this.game.gameMode = initInfo.gameMode;
        this.game.totalCountDown = initInfo.totalCountDown;
        this.game.timerMs = this.game.totalCountDown;
        if (initInfo.gameMode === GameType.Solo) {
            // TODO: add creating a dictionary if solo mode (go put the class back to how it was)
            this.game.scrabbleBoard = new ScrabbleBoard(initInfo.scrabbleBoard);
            this.game.stock = new LetterStock(initInfo.stock);

        } else if (initInfo.gameMode === GameType.MultiPlayer) {
            this.localPlayerIndex = this.socket.id === initInfo.players[0].socketId ? 0 : 1;
            this.opponentPlayerIndex = this.socket.id === initInfo.players[0].socketId ? 1 : 0;
            this.game.players[this.localPlayerIndex] = initInfo.players[this.localPlayerIndex];
            this.game.players[this.opponentPlayerIndex] = initInfo.players[this.opponentPlayerIndex];
            this.game.scrabbleBoard = new ScrabbleBoard(initInfo.scrabbleBoard);
            this.game.stock = new LetterStock(initInfo.stock);
        }

    }
    startNewGame() {
        this.isOpponentTurnSubject = new BehaviorSubject<boolean>(this.game.players[this.opponentPlayerIndex].isActive);
        this.isOpponentTurnObservable = this.isOpponentTurnSubject.asObservable();
        this.rackService.rackLetters = [];
        this.gridService.scrabbleBoard = this.game.scrabbleBoard;
        this.chatDisplayService.initialize(this.game.players[this.localPlayerIndex].name);
        this.addRackLetters(this.game.players[this.localPlayerIndex].letters);
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
            if (this.game.players[this.opponentPlayerIndex].isActive) {
                this.isOpponentTurnSubject.next(this.game.players[this.opponentPlayerIndex].isActive);
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
            this.game.players[this.localPlayerIndex],
            this.game.players[this.opponentPlayerIndex],
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
        const localPlayerPoints = this.calculateRackPoints(this.game.players[this.localPlayerIndex]);
        const oppnentPlayerPoints = this.calculateRackPoints(this.game.players[this.opponentPlayerIndex]);

        if (this.game.players[this.localPlayerIndex].isWinner === true) {
            this.game.players[this.localPlayerIndex].score += oppnentPlayerPoints;
            this.game.players[this.opponentPlayerIndex].score -= oppnentPlayerPoints;
        } else if (this.game.players[this.opponentPlayerIndex].isWinner === true) {
            this.game.players[this.opponentPlayerIndex].score += localPlayerPoints;
            this.game.players[this.localPlayerIndex].score -= localPlayerPoints;
        } else {
            this.game.players[this.localPlayerIndex].score -= localPlayerPoints;
            this.game.players[this.opponentPlayerIndex].score -= oppnentPlayerPoints;
            if (this.game.players[this.localPlayerIndex].score > this.game.players[this.opponentPlayerIndex].score) {
                this.game.players[this.localPlayerIndex].isWinner = true;
            } else if (this.game.players[this.localPlayerIndex].score < this.game.players[this.opponentPlayerIndex].score) {
                this.game.players[this.opponentPlayerIndex].isWinner = true;
            } else {
                this.game.players[this.localPlayerIndex].isWinner = true;
                this.game.players[this.opponentPlayerIndex].isWinner = true;
            }
        }
        clearInterval(this.intervalValue);
        this.game.timerMs = 0;
        this.secondsToMinutes();
        this.game.isEndGame = true;
    }

    updateActivePlayer() {
        // Switch the active player
        if (this.game.players[this.localPlayerIndex].isActive) {
            // If the rack is empty, end game + player won
            if (this.game.players[this.localPlayerIndex].letters.length === 0 && this.game.stock.letterStock.length !== 0) {
                this.game.players[this.localPlayerIndex].isWinner = true;
                this.endGame();
                return;
            }
            this.game.players[this.localPlayerIndex].isActive = false;
            this.game.players[this.opponentPlayerIndex].isActive = true;
        } else {
            // If the rack is empty, end game + player won
            if (this.game.players[this.opponentPlayerIndex].letters.length === 0 && this.game.stock.letterStock.length !== 0) {
                this.game.players[this.opponentPlayerIndex].isWinner = true;
                this.endGame();
                return;
            }
            this.game.players[this.opponentPlayerIndex].isActive = false;
            this.game.players[this.localPlayerIndex].isActive = true;
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
        this.game.players[this.localPlayerIndex].letters.splice(i, 1);
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
