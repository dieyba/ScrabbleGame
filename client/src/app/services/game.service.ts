import { Injectable } from '@angular/core';
import { PlaceParams } from '@app/classes/commands';
import { ErrorType } from '@app/classes/errors';
import { GameParameters, GameType } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { BoardUpdate, GameInitInfo, LettersUpdate } from '@app/classes/server-message';
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
            stock: [],
            isEndGame: false,
            gameMode: GameType.Solo,
        };
    }
    socketOnConnect() {
        this.socket.on('turn changed', (isTurnPassed: boolean, consecutivePassedTurns: number) => {
            // TODO: this to be done on server, client only changes active player and timer for the ui?
            // aka update active player and reset the timer ig
            // if (this.game.opponentPlayer.isActive) this.isOpponentTurnSubject.next(this.game.opponentPlayer.isActive);


            // this.game.isTurnPassed = isTurnPassed;
            // this.game.consecutivePassedTurns = consecutivePassedTurns;
            // if (!this.game.isEndGame) {
            //     // if it is not already the endgame
            //     const isLocalPlayerEndingGame = this.game.consecutivePassedTurns >= MAX_TURNS_PASSED && this.game.players[this.localPlayerIndex].isActive;
            //     if (isLocalPlayerEndingGame) {
            //         this.endGame();
            //     }
            //     this.updateActivePlayer();
            //     this.resetTimer();
            //     this.game.isTurnPassed = false;
            // } else {
            //     this.resetTimer();
            // }
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
            this.game.stock = update.newStock;
            this.game.players[update.playerIndex].letters = update.newLetters;
            if (update.newScore !== undefined) {
                this.game.players[update.playerIndex].score = update.newScore;
            }
        });
    }
    // TODO: put this in a socket.on('init game') or something?
    // TODO: see if we need a dictionary or not. Normally not but see issue on gitlab
    // and might want to make sure there is a player in players[] before accessing index
    initializeGame(initInfo: GameInitInfo) {
        this.localPlayerIndex = this.socket.id === initInfo.players[0].socketId ? 0 : 1;
        this.opponentPlayerIndex = this.socket.id === initInfo.players[0].socketId ? 1 : 0;
        this.game.gameMode = initInfo.gameMode;
        this.game.players[this.localPlayerIndex] = initInfo.players[this.localPlayerIndex];
        this.game.players[this.opponentPlayerIndex] = initInfo.players[this.opponentPlayerIndex];
        this.game.totalCountDown = initInfo.totalCountDown;
        this.game.timerMs = this.game.totalCountDown;
        this.game.scrabbleBoard = new ScrabbleBoard(initInfo.boardSquares);
        this.game.stock = initInfo.stock;
        this.game.isEndGame = false;
        console.log('initializedGame:', this.game);
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

    // TODO: see if the timer related methods are to be kept on client 
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
    // TODO: starts countdown probably should be on the server no? or would that cause delays
    startCountdown() {
        if (!this.game.isEndGame) {
            this.secondsToMinutes();
            this.intervalValue = setInterval(() => {
                this.game.timerMs--;
                if (this.game.timerMs < 0) {
                    this.game.timerMs = 0; // to prevent timer from going into negative values
                    // TODO: to restart the timer server will have to emit every time kinda like it alreay does when !passer
                    // this.game.isTurnPassed = true;
                    // this.changeTurn();
                }
                this.secondsToMinutes();
            }, TIMER_INTERVAL);
        }
    }


    /*  
        1) place in client game service: validates place command syntax, places letter on board ui,
        2) emits place to call place/validation in server game service. Vaildate Words
        2.a) depending on result will emit to client the word is invalid and make it put letters back in rack
        2.b) or will do:
                this.validationService.updatePlayerScore(tempScrabbleWords, player);
                // Take new letters
                const newLetters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
                this.addRackLetters(newLetters);
                newLetters.forEach((letter) => {
                    this.addLetterToPlayer(letter);
                });
            and then emit to client to synchronize player letters and stock
    */
    async place(player: Player, placeParams: PlaceParams): Promise<ErrorType> {
        // const errorResult = await super.place(player, placeParams); // replace this by what's in solo game
        const errorResult = ErrorType.NoError;
        // if (errorResult === ErrorType.NoError) {
        // TODO: this should be called from the server
        // this.socket.emit('word placed', {
        //     word: placeParams.word,
        //     orientation: placeParams.orientation,
        //     positionX: placeParams.position.x,
        //     positionY: placeParams.position.y,
        // });
        // this.socket.emit('place word', { stock: this.stock.letterStock, newLetters: player.letters, newScore: player.score });
        // }
        return errorResult;
    }

    /*
    1) emits to server to exchange letters
    2) server exchanges letters
    3) server emits back to synchronize new letters/stock and calls back give back if error?
    */
    async exchangeLetters(player: Player, letters: string): Promise<ErrorType> {
        // const errorResult = super.exchangeLetters(player, letters); // TODO: replace this by await promise of emit to server
        const errorResult = ErrorType.NoError;
        // if (errorResult === ErrorType.NoError) {
        //     this.socket.emit('exchange letters', { stock: this.stock.letterStock, newLetters: player.letters, newScore: player.score });
        // }
        return errorResult;
    }
    passTurn(player: Player): ErrorType {
        let errorResult = ErrorType.ImpossibleCommand;
        if (player.isActive) {
            // TODO: replce by emit to server "pass turn" or something
            // this.game.isTurnPassed = true;
            // this.changeTurn();
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
            this.game.stock,
            this.game.players[this.localPlayerIndex],
            this.game.players[this.opponentPlayerIndex],
        );
        endGameMessages.forEach((message) => {
            this.chatDisplayService.addEntry(message);
        });
    }

    endGame() {
        this.socket.emit('endGame');
    }

    // From solo game service
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
            if (this.game.players[this.localPlayerIndex].letters.length === 0 && this.game.stock.length !== 0) {
                this.game.players[this.localPlayerIndex].isWinner = true;
                this.endGame();
                return;
            }
            this.game.players[this.localPlayerIndex].isActive = false;
            this.game.players[this.opponentPlayerIndex].isActive = true;
        } else {
            // If the rack is empty, end game + player won
            if (this.game.players[this.opponentPlayerIndex].letters.length === 0 && this.game.stock.length !== 0) {
                this.game.players[this.opponentPlayerIndex].isWinner = true;
                this.endGame();
                return;
            }
            this.game.players[this.opponentPlayerIndex].isActive = false;
            this.game.players[this.localPlayerIndex].isActive = true;
        }
    }

    // TODO: to call in emit? see how exchange works
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
