import { Injectable } from '@angular/core';
import { PlaceParams } from '@app/classes/commands';
import { ErrorType } from '@app/classes/errors';
import { DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID, GameInitInfo, GameParameters, GameType } from '@app/classes/game-parameters';
import { LetterStock } from '@app/classes/letter-stock';
import { Player, removePlayerLetters } from '@app/classes/player';
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
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';
export const DEFAULT_LETTER_COUNT = 7;
const TIMER_INTERVAL = 1000;

@Injectable({
    providedIn: 'root',
})
export class GameService {
    game: GameParameters;
    isTurnPassed: boolean;
    isTurnEndObservable: Observable<boolean>;
    isTurnEndSubject: BehaviorSubject<boolean>;
    private socket: io.Socket;
    private readonly server: string;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
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
        // Synchronization for multiplayer mode
        this.socket.on('update board', (boardUpdate: BoardUpdate) => {
            this.gridService.updateBoard(boardUpdate.word, boardUpdate.orientation, new Vec2(boardUpdate.positionX, boardUpdate.positionY));
        });
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
            this.game.gameMode = initInfo.gameMode;
            this.game.isEndGame = false;
            this.game.gameTimer.initializeTotalCountDown(initInfo.totalCountDown);
            this.game.setLocalAndOpponentId(DEFAULT_LOCAL_PLAYER_ID, DEFAULT_OPPONENT_ID);
            this.game.setLocalPlayer(new Player(initInfo.creatorName));
            this.game.setOpponent(new VirtualPlayer(initInfo.joinerName, virtualPlayerDifficulty));
            this.game.getLocalPlayer().letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
            this.game.getOpponent().letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
            const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
            this.game.players[starterPlayerIndex].isActive = true;
            this.validationService.dictionary.selectDictionary(initInfo.dictionaryType);
        }
    }
    initializeMultiplayerGame(initInfo: GameInitInfo) {
        if (initInfo.gameMode === GameType.MultiPlayer) {
            const localPlayerIndex = this.socket.id === initInfo.players[0].socketId ? 0 : 1;
            const opponentPlayerIndex = this.socket.id === initInfo.players[0].socketId ? 1 : 0;
            this.game.setLocalAndOpponentId(localPlayerIndex, opponentPlayerIndex);
            this.game.setLocalPlayer(initInfo.players[localPlayerIndex]);
            this.game.setOpponent(initInfo.players[opponentPlayerIndex]);
            this.game.gameTimer.initializeTotalCountDown(initInfo.totalCountDown);
            this.game.scrabbleBoard = new ScrabbleBoard(initInfo.scrabbleBoard); // stock and board not init properly
            this.game.stock = new LetterStock(initInfo.stockLetters);
            this.game.gameMode = initInfo.gameMode;
            this.game.isEndGame = false;
        }
    }
    startNewGame() {
        // create observable to know when the turn ended after a command
        this.isTurnEndSubject = new BehaviorSubject<boolean>(this.isTurnPassed);
        this.isTurnEndObservable = this.isTurnEndSubject.asObservable();
        this.rackService.rackLetters = [];
        this.gridService.scrabbleBoard = this.game.scrabbleBoard;
        this.addRackLetters(this.game.getLocalPlayer().letters);
        this.startCountdown();
    }
    startCountdown() {
        if (!this.game.isEndGame) {
            this.game.gameTimer.secondsToMinutes();
            this.game.gameTimer.intervalValue = setInterval(() => {
                this.game.gameTimer.timerMs--;
                if (this.game.gameTimer.timerMs < 0) {
                    this.game.gameTimer.timerMs = 0;
                    this.isTurnPassed = true;
                    this.isTurnEndSubject.next(this.isTurnPassed);
                }
                this.game.gameTimer.secondsToMinutes();
            }, TIMER_INTERVAL);
        }
    }
    resetTimer(isEndGame: boolean) {
        this.game.gameTimer.timerMs = +this.game.gameTimer.totalCountDown;
        this.game.gameTimer.secondsToMinutes();
        clearInterval(this.game.gameTimer.intervalValue);
        this.startCountdown();
    }
    passTurn(player: Player): ErrorType {
        if (player.isActive) {
            this.isTurnPassed = true;
            this.isTurnEndSubject.next(this.isTurnPassed);
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
                this.isTurnPassed = false;
                this.isTurnEndSubject.next(this.isTurnPassed);
                return ErrorType.NoError;
            }
        }
        return ErrorType.ImpossibleCommand;
    }
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
                    console.log('calling update plyer score after place');
                    this.validationService.updatePlayerScore(tempScrabbleWords, player);
                    lettersToAddToRack = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
                }
                this.addRackLetters(lettersToAddToRack);
                lettersToAddToRack.forEach((letter) => {
                    player.letters.push(letter);
                });
                this.isTurnPassed = false;
                this.isTurnEndSubject.next(this.isTurnPassed);
                this.synchronizeAfterPlaceCommand(errorResult, placeParams, player);
            });
            return errorResult;
        }
        return errorResult;
    }
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
        for (let i = 0; i < this.rackService.exchangeSelected.length; i++) {
            if (this.rackService.exchangeSelected[i] === true) {
                letters += this.rackService.rackLetters[i].character;
                this.rackService.exchangeSelected[i] = false;
            }
        }
        return letters;
    }
}
