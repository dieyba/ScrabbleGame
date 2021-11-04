/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlaceParams } from '@app/classes/commands';
import { Dictionary } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Axis } from '@app/classes/utilities';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { LetterStock } from './letter-stock.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

export const TIMER_INTERVAL = 1000;
export const DEFAULT_LETTER_COUNT = 7;
export const MAX_TURNS_PASSED = 6;
const DOUBLE_DIGIT = 10;
const MINUTE_IN_SEC = 60;
const LOCAL_PLAYER_INDEX = 0;

@Injectable({
    providedIn: 'root',
})
export class SoloGameService {
    game: GameParameters;
    isVirtualPlayerObservable: Observable<boolean>;
    virtualPlayerSubject: BehaviorSubject<boolean>;
    timer: string;
    intervalValue: NodeJS.Timeout;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
        protected chatDisplayService: ChatDisplayService,
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
        protected placeService: PlaceService,
    ) {}
    initializeGame(gameInfo: FormGroup) {
        this.game = new GameParameters(gameInfo.controls.name.value, +gameInfo.controls.timer.value, gameInfo.controls.bonus.value);
        this.chatDisplayService.entries = [];
        this.game.creatorPlayer = new LocalPlayer(gameInfo.controls.name.value);
        this.game.creatorPlayer.isActive = true;
        this.game.stock = new LetterStock();
        this.game.localPlayer = new LocalPlayer(gameInfo.controls.name.value); // where does local player take his letters from stock?
        this.game.creatorPlayer = this.game.localPlayer;
        this.game.opponentPlayer = new VirtualPlayer(gameInfo.controls.opponent.value, gameInfo.controls.level.value);
        this.game.localPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.opponentPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.dictionary = new Dictionary(+gameInfo.controls.dictionaryForm.value);
        this.game.randomBonus = gameInfo.controls.bonus.value;
        this.game.totalCountDown = gameInfo.controls.timer.value;
        this.game.timerMs = gameInfo.controls.timer.value;
        const starterPlayerIndex = Math.round(Math.random()); // return 0 or 1
        const starterPlayer = starterPlayerIndex === LOCAL_PLAYER_INDEX ? this.game.localPlayer : this.game.opponentPlayer;
        starterPlayer.isActive = true;
        return this.game;
    }
    createNewGame() {
        this.virtualPlayerSubject = new BehaviorSubject<boolean>(this.game.opponentPlayer.isActive);
        this.isVirtualPlayerObservable = this.virtualPlayerSubject.asObservable();
        this.rackService.rackLetters = [];
        this.gridService.scrabbleBoard = this.game.scrabbleBoard;
        this.chatDisplayService.initialize(this.game.localPlayer.name);
        this.addRackLetters(this.game.localPlayer.letters);
        this.startCountdown();
        this.game.isTurnPassed = false;
        this.game.consecutivePassedTurns = 0;
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
                    this.game.isTurnPassed = true;
                    const activePlayer = this.game.localPlayer.isActive ? this.game.localPlayer : this.game.opponentPlayer;
                    this.changeTurn();
                    console.log("End of timer:", activePlayer.name, " should have turned pass");
                    // TODO: send 'activePlayerName >> !passer' message to chat via observer?
                }
                this.secondsToMinutes();
            }, TIMER_INTERVAL);
        }
    }
    passTurn(player: Player) {
        if (player.isActive) {
            this.game.isTurnPassed = true;
            this.changeTurn();
            return ErrorType.NoError;
        }
        return ErrorType.ImpossibleCommand;
    }
    changeTurn() {
        this.updateConsecutivePassedTurns();
        this.updateActivePlayer();
        this.resetTimer();
        if (this.game.opponentPlayer.isActive) this.virtualPlayerSubject.next(this.game.opponentPlayer.isActive);
        this.game.isTurnPassed = false; // reset isTurnedPassed when new turn starts
    }
    // Check if last 5 turns have been passed (by the command or the timer running out) (current turn is the 6th)
    updateConsecutivePassedTurns() {
        if (this.game.isTurnPassed) {
            this.game.consecutivePassedTurns++;
        } else {
            this.game.consecutivePassedTurns = 0;
        }
        if (this.game.consecutivePassedTurns >= MAX_TURNS_PASSED) {
            this.endGame();
        }
    }
    updateActivePlayer() {
        // Switch the active player
        if (this.game.localPlayer.isActive) {
            // If the rack is empty, end game + player won
            if (this.game.localPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
                this.game.localPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.localPlayer.isActive = false;
            this.game.opponentPlayer.isActive = true;
        } else {
            // If the rack is empty, end game + player won
            if (this.game.opponentPlayer.letters.length === 0 && this.game.stock.isEmpty()) {
                this.game.opponentPlayer.isWinner = true;
                this.endGame();
                return;
            }
            this.game.opponentPlayer.isActive = false;
            this.game.localPlayer.isActive = true;
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
    addLetterToPlayer(letter: ScrabbleLetter) {
        this.game.localPlayer.addLetter(letter);
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
                    this.addLetterToPlayer(lettersToAdd[i]);
                }
                this.game.isTurnPassed = false;
                this.changeTurn();
                return ErrorType.NoError;
            }
        }
        return ErrorType.ImpossibleCommand;
    }

    async place(player: Player, placeParams: PlaceParams): Promise<ErrorType /* Promise<ErrorType> */> /* Promise<ErrorType> */ {
        if (!player.isActive) {
            return ErrorType.ImpossibleCommand;
        }
        let errorResult = this.placeService.place(player, placeParams);
        if (errorResult === ErrorType.NoError) {
            // Generate all words created
            let tempScrabbleWords: ScrabbleWord[];
            if (placeParams.orientation === 'h') {
                tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.H);
            } else {
                tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.V);
            }
            const strWords: string[] = [];
            tempScrabbleWords.forEach((scrabbleWord) => {
                strWords.push(scrabbleWord.stringify().toLowerCase());
            });
            // validate words waits 3sec if the words are invalid or the server doesn't answer.
            await this.validationService.validateWords(tempScrabbleWords).then((isValidWordsResult: boolean) => {
                errorResult = isValidWordsResult ? ErrorType.NoError : ErrorType.ImpossibleCommand;
                if (!this.validationService.areWordsValid) {
                    // Retake letters
                    const removedLetters = this.gridService.removeInvalidLetters(
                        placeParams.position,
                        placeParams.word.length,
                        placeParams.orientation,
                    );
                    this.addRackLetters(removedLetters);
                    removedLetters.forEach((letter) => {
                        this.addLetterToPlayer(letter);
                    });
                } else {
                    // Score
                    this.validationService.updatePlayerScore(tempScrabbleWords, player);
                    // Take new letters
                    const newLetters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
                    this.addRackLetters(newLetters);
                    newLetters.forEach((letter) => {
                        this.addLetterToPlayer(letter);
                    });
                }
                this.game.isTurnPassed = false;
                this.changeTurn();
            });
            return errorResult;
        }
        return errorResult;
    }
    displayEndGameMessage() {
        const endGameMessages = this.chatDisplayService.createEndGameMessages(
            this.game.stock.letterStock,
            this.game.localPlayer,
            this.game.opponentPlayer,
        );
        endGameMessages.forEach((message) => {
            this.chatDisplayService.addEntry(message);
        });
    }
    endLocalGame() {
        const localPlayerPoints = this.calculateRackPoints(this.game.localPlayer);
        const oppnentPlayerPoints = this.calculateRackPoints(this.game.opponentPlayer);

        if (this.game.localPlayer.isWinner === true) {
            this.game.localPlayer.score += oppnentPlayerPoints;
            this.game.opponentPlayer.score -= oppnentPlayerPoints;
        } else if (this.game.opponentPlayer.isWinner === true) {
            this.game.opponentPlayer.score += localPlayerPoints;
            this.game.localPlayer.score -= localPlayerPoints;
        } else {
            this.game.localPlayer.score -= localPlayerPoints;
            this.game.opponentPlayer.score -= oppnentPlayerPoints;
        }
        clearInterval(this.intervalValue);
        this.game.timerMs = 0;
        this.secondsToMinutes();
        this.game.isEndGame = true;
    }
    endGame() {
        this.displayEndGameMessage();
        this.endLocalGame();
    }
    calculateRackPoints(player: Player): number {
        let totalValue = 0;
        player.letters.forEach((letter) => {
            totalValue += letter.value;
        });
        return totalValue;
    }
    removeRackLetter(scrabbleLetter: ScrabbleLetter): void {
        const i = this.rackService.removeLetter(scrabbleLetter);
        this.game.localPlayer.letters.splice(i, 1);
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
}
