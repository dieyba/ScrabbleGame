import { Injectable } from '@angular/core';
import { PlaceParams } from '@app/classes/commands';
import { ErrorType } from '@app/classes/errors';
import { DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID, GameInitInfo, GameParameters, GameType } from '@app/classes/game-parameters';
import { LetterStock } from '@app/classes/letter-stock';
import { calculateRackPoints, Player, removePlayerLetters } from '@app/classes/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { BoardUpdate, LettersUpdate } from '@app/classes/server-message';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters';
import { SocketHandler } from '@app/modules/socket-handler';
import { BehaviorSubject, Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';
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
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
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
                const isLocalPlayerEndingGame = this.game.consecutivePassedTurns >= MAX_TURNS_PASSED && this.game.getLocalPlayer().isActive;
                if (isLocalPlayerEndingGame) {
                    this.endGame();
                }
                this.updateActivePlayer();
                this.resetTimer();
                this.game.isTurnPassed = false;
            }
        });
        this.socket.on('gameEnded', () => {
            this.chatDisplayService.displayEndGameMessage(this.game.stock.letterStock, this.game.getLocalPlayer(), this.game.getOpponent());
            this.endLocalGame();
            this.resetTimer(); // to stop the timer
        });
        // updates board after a new word was placed
        this.socket.on('update board', (boardUpdate: BoardUpdate) => {
            this.gridService.updateBoard(boardUpdate.word, boardUpdate.orientation, new Vec2(boardUpdate.positionX, boardUpdate.positionY));
        });
        // updates the stock and the letters of the player who placed or exchanged letters
        this.socket.on('update letters', (update: LettersUpdate) => {
            this.game.stock.letterStock = update.newStock;
            this.game.getOpponent().letters = update.newLetters;
            this.game.getOpponent().score = update.newScore;
        });
    }
    initializeSoloGame(initInfo: WaitingAreaGameParameters, virtualPlayerDifficulty: Difficulty) {
        if (initInfo.gameMode === GameType.Solo) {
            this.game.scrabbleBoard = new ScrabbleBoard(initInfo.isRandomBonus);
            this.game.stock = new LetterStock();
            this.game.totalCountDown = initInfo.totalCountDown;
            this.game.timerMs = this.game.totalCountDown;
            this.game.gameMode = initInfo.gameMode;
            this.game.consecutivePassedTurns = 0;
            this.game.isTurnPassed = false;
            this.game.isEndGame = false;
            this.game.setLocalAndOpponentId(DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID);
            this.game.setLocalPlayer(new Player(initInfo.creatorName));
            this.game.setOpponent(new VirtualPlayer(initInfo.joinerName, virtualPlayerDifficulty));
            this.game.getLocalPlayer().letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
            this.game.getOpponent().letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
            const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
            this.game.players[starterPlayerIndex].isActive = true;
            // TODO: see how selecting and loading dictionary on client in solo mode will work
            this.validationService.dictionary.selectDictionary(initInfo.dictionaryType);
            // TODO: set objectives to initialize here
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
            this.game.consecutivePassedTurns = 0;
            this.game.isTurnPassed = false;
            this.game.isEndGame = false;
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
    // TODO: create a timer class
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
                    this.game.timerMs = 0; // TODO: to prevent timer from going into negative values? does it work?
                    this.game.isTurnPassed = true;
                    this.changeTurn();
                }
                this.secondsToMinutes();
            }, TIMER_INTERVAL);
        }
    }
    // TODO: should we create a turn manager service or something?
    // Check if last 5 turns have been passed(by the command or the timer running out)(current turn is the 6th)
    updateConsecutivePassedTurns() {
        this.game.consecutivePassedTurns = this.game.isTurnPassed ? this.game.consecutivePassedTurns + 1 : 0;
        if (this.game.consecutivePassedTurns >= MAX_TURNS_PASSED) {
            this.endGame();
        }
    }
    // TODO: test if still works
    updateActivePlayer() {
        let activePlayer = this.game.getLocalPlayer().isActive ? this.game.getLocalPlayer() : this.game.getOpponent();
        let inactivePlayer = this.game.getLocalPlayer().isActive ? this.game.getOpponent() : this.game.getLocalPlayer();

        if (activePlayer.letters.length === 0 && this.game.stock.isEmpty()) {
            activePlayer.isWinner = true;
            this.endGame();
            return;
        }
        activePlayer.isActive = false;
        inactivePlayer.isActive = true;
    }
    // TODO: see if can refactor this and endgame to prevent code duplication
    changeTurn() {
        if (this.game.isEndGame) {
            return;
        }
        if (this.game.gameMode === GameType.Solo) {
            this.updateConsecutivePassedTurns();
            this.updateActivePlayer();
            this.resetTimer();
            if (this.game.getOpponent().isActive) {
                this.isOpponentTurnSubject.next(this.game.getOpponent().isActive);
            }
            this.game.isTurnPassed = false; // reset isTurnedPassed when new turn starts
        } else {
            this.socket.emit('change turn', this.game.isTurnPassed, this.game.consecutivePassedTurns);
        }
    }
    passTurn(player: Player): ErrorType {
        if (player.isActive) {
            this.game.isTurnPassed = true;
            this.changeTurn();
            return ErrorType.NoError;
        }
        return ErrorType.ImpossibleCommand;
    }
    exchangeLetters(player: Player, letters: string): ErrorType {
        if (player.isActive && this.game.stock.letterStock.length > DEFAULT_LETTER_COUNT) {
            const lettersToRemove: ScrabbleLetter[] = [];
            if (removePlayerLetters(letters, player) === true) {
                for (let i = 0; i < letters.length; i++) {
                    lettersToRemove[i] = new ScrabbleLetter(letters[i]);
                }
                const lettersToAdd: ScrabbleLetter[] = this.game.stock.exchangeLetters(lettersToRemove);
                for (let i = 0; i < lettersToAdd.length; i++) {
                    this.rackService.removeLetter(lettersToRemove[i]);
                    this.rackService.addLetter(lettersToAdd[i]);
                    player.letters.push(lettersToAdd[i]);
                }
                if (this.game.gameMode === GameType.MultiPlayer) {
                    const lettersUpdate: LettersUpdate = {
                        newStock: this.game.stock.letterStock,
                        newLetters: player.letters,
                        newScore: player.score,
                    };
                    this.socket.emit('exchange letters', lettersUpdate);
                }
                this.game.isTurnPassed = false;
                this.changeTurn();
                return ErrorType.NoError;
            }
        }
        return ErrorType.ImpossibleCommand;
    }
    // TODO: to refactor, put blocs of code in methods
    async place(player: Player, placeParams: PlaceParams): Promise<ErrorType> {
        if (!player.isActive) {
            return ErrorType.ImpossibleCommand;
        }
        let errorResult = this.placeService.place(player, placeParams);
        if (errorResult === ErrorType.NoError) {
            // Generate all words created
            let tempScrabbleWords: ScrabbleWord[];
            if (placeParams.orientation === Axis.H) {
                tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.H);
            } else {
                tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.V);
            }
            const strWords: string[] = [];
            tempScrabbleWords.forEach((scrabbleWord) => {
                strWords.push(scrabbleWord.stringify().toLowerCase());
            });
            // validate words waits 3sec if the words are invalid or the server doesn't answer.
            await this.validationService.validateWords(tempScrabbleWords, this.game.gameMode).then((isValidWordsResult: boolean) => {
                errorResult = isValidWordsResult ? ErrorType.NoError : ErrorType.ImpossibleCommand;
                let lettersToAddToRack;
                if (!this.validationService.areWordsValid) {
                    // Retake letters
                    lettersToAddToRack = this.gridService.removeInvalidLetters(
                        placeParams.position,
                        placeParams.word.length,
                        placeParams.orientation,
                    );
                } else {
                    // Take new letters
                    this.validationService.updatePlayerScore(tempScrabbleWords, player);
                    lettersToAddToRack = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
                }
                this.addRackLetters(lettersToAddToRack);
                lettersToAddToRack.forEach((letter) => {
                    player.letters.push(letter);
                });
                this.synchronizeAfterPlaceCommand(errorResult, placeParams, player);
                this.game.isTurnPassed = false;
                this.changeTurn();
            });
            return errorResult;
        }
        return errorResult;
    }
    // TODO : could be moved somewhere else if too many lines
    synchronizeAfterPlaceCommand(errorResult: ErrorType, placeParams: PlaceParams, player: Player) {
        if (errorResult === ErrorType.NoError && this.game.gameMode === GameType.MultiPlayer) {
            this.socket.emit('word placed', {
                word: placeParams.word,
                orientation: placeParams.orientation,
                positionX: placeParams.position.x,
                positionY: placeParams.position.y,
            });
            this.socket.emit('place word', { stock: this.game.stock.letterStock, newLetters: player.letters, newScore: player.score });
        }
    }
    endGame() {
        if (this.game.gameMode === GameType.Solo) {
            this.chatDisplayService.displayEndGameMessage(this.game.stock.letterStock, this.game.getLocalPlayer(), this.game.getOpponent());
            this.endLocalGame();
            this.resetTimer();
        } else if (this.game.gameMode === GameType.MultiPlayer) {
            this.socket.emit('endGame');
        }
    }
    endLocalGame() {
        const localPlayerPoints = calculateRackPoints(this.game.getLocalPlayer());
        const oppnentPlayerPoints = calculateRackPoints(this.game.getOpponent());

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
    addRackLetters(letters: ScrabbleLetter[]): void {
        for (const letter of letters) {
            this.rackService.addLetter(letter);
        }
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
                        this.rackService.addLetter(newWord.content[j]);
                    }
                }
                if (newWord.orientation === Axis.H) {
                    if (this.gridService.scrabbleBoard.squares[newWord.startPosition.x + j][newWord.startPosition.y].isValidated !== true) {
                        this.rackService.addLetter(newWord.content[j]);
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
}
