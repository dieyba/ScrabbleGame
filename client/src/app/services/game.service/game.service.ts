import { Injectable } from '@angular/core';
import { createSystemEntry } from '@app/classes/chat-display-entry/chat-display-entry';
import { PlaceParams } from '@app/classes/commands/commands';
import { ErrorType } from '@app/classes/errors';
import { GameInitInfo, GameParameters, GameType } from '@app/classes/game-parameters/game-parameters';
import { GoalType } from '@app/classes/goal/goal';
import { LetterStock } from '@app/classes/letter-stock/letter-stock';
import { Player, removePlayerLetters } from '@app/classes/player/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { BoardUpdate, LettersUpdate } from '@app/classes/server-message';
import { Axis, ERROR_NUMBER } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters/waiting-area-game-parameters';
import * as SocketHandler from '@app/modules/socket-handler';
import { ChatDisplayService } from '@app/services/chat-display.service/chat-display.service';
import { GoalsService } from '@app/services/goals.service/goals.service';
import { GridService } from '@app/services/grid.service/grid.service';
import { PlaceService } from '@app/services/place.service/place.service';
import { RackService } from '@app/services/rack.service/rack.service';
import { ValidationService } from '@app/services/validation.service/validation.service';
import { WordBuilderService } from '@app/services/word-builder.service/word-builder.service';
import { BehaviorSubject, Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

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
        protected chatDisplayService: ChatDisplayService,
        protected goalsService: GoalsService,
    ) {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.socketOnConnect();
        this.game = new GameParameters();
    }

    initializeSoloGame(initInfo: WaitingAreaGameParameters, virtualPlayerDifficulty: Difficulty) {
        if (initInfo.gameMode !== GameType.Solo) {
            return;
        }
        this.game.scrabbleBoard = new ScrabbleBoard(initInfo.isRandomBonus);
        this.game.stock = new LetterStock();
        this.game.gameMode = initInfo.gameMode;
        this.game.isLog2990 = initInfo.isLog2990;
        this.game.isEndGame = false;
        this.game.gameTimer.initializeTotalCountDown(initInfo.totalCountDown);
        this.game.setLocalPlayer(new Player(initInfo.creatorName));
        this.game.setOpponent(new VirtualPlayer(initInfo.joinerName, virtualPlayerDifficulty));
        this.game.getLocalPlayer().letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.getOpponent().letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
        this.game.players[starterPlayerIndex].isActive = true;
        this.validationService.dictionary.selectDictionary(initInfo.dictionaryType);
        if (String(this.game.isLog2990) === 'true') {
            const usedGoals: GoalType[] = [];
            const sharedGoals = this.goalsService.pickSharedGoals(usedGoals);
            this.goalsService.pickPrivateGoals(usedGoals, this.game.players);
            const randomLetterAndColor = this.goalsService.pickRandomLetterAndColor(this.game.stock.letterStock);
            this.createGoals(sharedGoals, randomLetterAndColor);
        }
    }

    initializeMultiplayerGame(initInfo: GameInitInfo) {
        if (initInfo.gameMode !== GameType.MultiPlayer) {
            return;
        }
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
        this.game.isLog2990 = initInfo.isLog2990;
        if (this.game.isLog2990) this.createGoals(initInfo.sharedGoals, initInfo.randomLetterAndColor);
    }

    createGoals(sharedGoals: GoalType[], randomLetterAndColor: ScrabbleLetter) {
        this.goalsService.initialize();
        // Create the goals
        sharedGoals.forEach((sharedGoalType) => {
            this.goalsService.addSharedGoal(sharedGoalType);
        });
        this.game.players.forEach((player: Player) => {
            this.goalsService.addPrivateGoal(player.goal);
        });
        // Initialize goals' specific attributes
        const goalTypesToInitialize = [GoalType.PlaceLetterOnColorSquare, GoalType.FormAnExistingWord];
        const goalsParameters = [randomLetterAndColor, this.validationService];
        for (let i = 0; i < goalTypesToInitialize.length; i++) {
            const goalToInitialize = this.goalsService.getGoalByType(goalTypesToInitialize[i]); // set random letter and color
            if (goalToInitialize !== undefined && goalToInitialize.initialize !== undefined) {
                goalToInitialize.initialize(goalsParameters[i]);
            }
        }
        return;
    }

    startNewGame() {
        // create observable to know when the turn ended after a command
        this.isTurnEndSubject = new BehaviorSubject<boolean>(this.isTurnPassed);
        this.isTurnEndObservable = this.isTurnEndSubject.asObservable();
        this.rackService.rackLetters = [];
        this.validationService.validWordsFormed = [];
        this.gridService.scrabbleBoard = this.game.scrabbleBoard;
        this.addRackLetters(this.game.getLocalPlayer().letters);
        this.startCountdown();
    }

    startCountdown() {
        if (this.game.isEndGame) {
            return;
        }

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

    resetTimer() {
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
        if (!player.isActive || !(this.game.stock.letterStock.length > DEFAULT_LETTER_COUNT)) {
            return ErrorType.ImpossibleCommand;
        }

        const lettersToRemove: ScrabbleLetter[] = [];
        if (!removePlayerLetters(letters, player)) {
            return ErrorType.ImpossibleCommand;
        }

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

    async place(player: Player, placeParams: PlaceParams): Promise<ErrorType> {
        if (!player.isActive) {
            return ErrorType.ImpossibleCommand;
        }
        let errorResult = this.placeService.place(player, placeParams);
        if (errorResult !== ErrorType.NoError) {
            return errorResult;
        }

        const tempScrabbleWords: ScrabbleWord[] = this.wordBuilder.buildWordsOnBoard(placeParams.position, placeParams.orientation);
        const strWords: string[] = [];
        const newlyPlacedLetters: ScrabbleLetter[] = [];
        tempScrabbleWords[0].content.forEach((newWordLetter: ScrabbleLetter) => {
            if (!newWordLetter.tile.isValidated) {
                newlyPlacedLetters.push(newWordLetter);
            }
        });
        tempScrabbleWords.forEach((scrabbleWord) => {
            strWords.push(scrabbleWord.stringify().toLowerCase());
        });
        // validate words waits 3sec if the words are invalid or the server doesn't answer.
        await this.validationService.validateWords(tempScrabbleWords, this.game.gameMode).then((isValidWordsResult: boolean) => {
            errorResult = isValidWordsResult ? ErrorType.NoError : ErrorType.ImpossibleCommand;
            let lettersToAddToRack;
            if (!this.validationService.areWordsValid) {
                // Retake letters
                lettersToAddToRack = this.gridService.removeInvalidLetters(placeParams.position, placeParams.word.length, placeParams.orientation);
            } else {
                // console.log('all valid words:', strWords);
                // Take new letters
                this.validationService.updatePlayerScore(tempScrabbleWords, player);
                if (String(this.game.isLog2990) === 'true') {
                    // TODO: make sure that scrabbleLetter.tile is updated properly every turn because it is needed in goal validation
                    player.score += this.goalsService.achieveGoals(player, tempScrabbleWords, newlyPlacedLetters);
                }
                lettersToAddToRack = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
            }
            this.addRackLetters(lettersToAddToRack);
            lettersToAddToRack.forEach((letter: ScrabbleLetter) => {
                player.letters.push(letter);
            });
            // End turn
            this.isTurnPassed = false;
            this.isTurnEndSubject.next(this.isTurnPassed);
            this.synchronizeAfterPlaceCommand(errorResult, placeParams, player);
        });
        return errorResult;
    }

    synchronizeAfterPlaceCommand(errorResult: ErrorType, placeParams: PlaceParams, player: Player) {
        if (errorResult === ErrorType.NoError && this.game.gameMode === GameType.MultiPlayer) {
            let wordUpdate = '';
            for (let i = 0; i < placeParams.word.length; i++) {
                const position =
                    placeParams.orientation === Axis.H
                        ? new Vec2(placeParams.position.x + i, placeParams.position.y)
                        : new Vec2(placeParams.position.x, placeParams.position.y + i);
                const boardLetter = this.game.scrabbleBoard.squares[position.x][position.y].letter;
                wordUpdate += boardLetter.character === '*' ? boardLetter.whiteLetterCharacter : boardLetter.character;
            }
            const boardUpdate: BoardUpdate = {
                word: wordUpdate,
                orientation: placeParams.orientation,
                positionX: placeParams.position.x,
                positionY: placeParams.position.y,
            };
            this.socket.emit('word placed', boardUpdate);
            const lettersUpdate: LettersUpdate = {
                newStock: this.game.stock.letterStock,
                newLetters: player.letters,
                newScore: player.score,
            };
            this.socket.emit('place word', lettersUpdate);
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

    private socketOnConnect() {
        // Synchronization for multiplayer mode
        this.socket.on('update board', (boardUpdate: BoardUpdate) => {
            this.gridService.updateBoard(boardUpdate.word, boardUpdate.orientation, new Vec2(boardUpdate.positionX, boardUpdate.positionY));
        });
        this.socket.on('update letters', (update: LettersUpdate) => {
            this.game.stock.letterStock = update.newStock;
            this.game.getOpponent().letters = update.newLetters;
            this.game.getOpponent().score = update.newScore;
        });
        this.socket.on('convert to solo', (previousPlayerSocketId: string, virtualPlayerName: string) => {
            let newVirtualPlayer;
            const playerArrayIndex = this.game.players.findIndex((p) => p.socketId === previousPlayerSocketId);
            if (playerArrayIndex !== ERROR_NUMBER && !this.game.isEndGame) {
                const previousPlayer = this.game.players[playerArrayIndex];
                newVirtualPlayer = new VirtualPlayer(virtualPlayerName, Difficulty.Easy);
                newVirtualPlayer.letters = previousPlayer.letters;
                newVirtualPlayer.isActive = previousPlayer.isActive;
                newVirtualPlayer.score = previousPlayer.score;
                newVirtualPlayer.goal = previousPlayer.goal;
                this.game.players[playerArrayIndex] = newVirtualPlayer;
                this.game.gameMode = GameType.Solo;
                this.chatDisplayService.addEntry(createSystemEntry('Conversion en mode solo'));
            }
        });
    }
}
