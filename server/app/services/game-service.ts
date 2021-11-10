// import { PlaceParams } from '@app/classes/commands';
// import { ErrorType } from '@app/classes/errors';
import { ClientGameInitParameters, GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
// import { BehaviorSubject, Observable } from 'rxjs'; TODO: is there a server version of observable? if not leave vp on client 
import { Service } from 'typedi';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

export const TIMER_INTERVAL = 1000;
export const DEFAULT_LETTER_COUNT = 7;
export const MAX_TURNS_PASSED = 6;
// const DOUBLE_DIGIT = 10;
// const MINUTE_IN_SEC = 60;

// TODO: should it even be a service a this point. it's not going to be injected anywhere i think?

@Service()
export class GameService {
    game: GameParameters;
    // isVirtualPlayerObservable: Observable<boolean>;
    // virtualPlayerSubject: BehaviorSubject<boolean>;
    // timer: string; isn't this only for the ui? not needed on server no?
    intervalValue: NodeJS.Timeout;

    constructor(
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
    ) {}
    initializeGame(gameParams: GameParameters): ClientGameInitParameters {
        this.game = gameParams;
        const starterPlayerIndex = Math.round(Math.random()); // initialize random starter player
        this.game.players[starterPlayerIndex].isActive = true;
        const clientInitParams: ClientGameInitParameters = {
            players: this.game.players,
            totalCountDown: this.game.totalCountDown,
            scrabbleBoard: this.game.scrabbleBoard.squares,
            stock: this.game.stock.letterStock, // stock is scrabbleLetters[] or string?
            gameMode: this.game.gameMode,
        }
        return clientInitParams;
    }
    createNewGame() {
        // see how vp service will work
        // this.virtualPlayerSubject = new BehaviorSubject<boolean>(this.game.opponentPlayer.isActive);
        // this.isVirtualPlayerObservable = this.virtualPlayerSubject.asObservable();
        this.game.isTurnPassed = false;
        this.game.consecutivePassedTurns = 0;
        // and emit to client(s) to start the game?
        this.startCountdown();
    }
    resetTimer() {
        this.game.timerMs = +this.game.totalCountDown;
        // this.secondsToMinutes();
        clearInterval(this.intervalValue);
        this.startCountdown();
    }
    // secondsToMinutes() {
    //     const s = Math.floor(this.game.timerMs / MINUTE_IN_SEC);
    //     const ms = this.game.timerMs % MINUTE_IN_SEC;
    //     if (ms < DOUBLE_DIGIT) {
    //         this.timer = s + ':' + 0 + ms;
    //     } else {
    //         this.timer = s + ':' + ms;
    //     }
    // }
    startCountdown() {
        if (!this.game.isEndGame) {
            // this.secondsToMinutes();
            this.intervalValue = setInterval(() => {
                this.game.timerMs--;
                if (this.game.timerMs < 0) {
                    this.game.isTurnPassed = true;
                    this.changeTurn();
                }
                // this.secondsToMinutes();
            }, TIMER_INTERVAL);
        }
    }
    passTurn(player: Player) {
        // if (player.isActive) {
        //     this.game.isTurnPassed = true;
        //     this.changeTurn();
        //     return ErrorType.NoError;
        // }
        // return ErrorType.ImpossibleCommand;
    }
    changeTurn() {
        // if (!this.game.isEndGame) {
        //     this.updateConsecutivePassedTurns();
        //     this.updateActivePlayer();
        //     this.resetTimer();
        //     if (this.game.opponentPlayer.isActive) this.virtualPlayerSubject.next(this.game.opponentPlayer.isActive);
        //     this.game.isTurnPassed = false; // reset isTurnedPassed when new turn starts
        // }
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
        // if (this.game.localPlayer.isActive) {
        //     // If the rack is empty, end game + player won
        //     if (this.game.localPlayer.letters.length === 0 && this.stock.isEmpty()) {
        //         this.game.localPlayer.isWinner = true;
        //         this.endGame();
        //         return;
        //     }
        //     this.game.localPlayer.isActive = false;
        //     this.game.opponentPlayer.isActive = true;
        // } else {
        //     // If the rack is empty, end game + player won
        //     if (this.game.opponentPlayer.letters.length === 0 && this.stock.isEmpty()) {
        //         this.game.opponentPlayer.isWinner = true;
        //         this.endGame();
        //         return;
        //     }
        //     this.game.opponentPlayer.isActive = false;
        //     this.game.localPlayer.isActive = true;
        // }
    }
    addLetterToPlayer(letter: ScrabbleLetter) {
        // this.game.localPlayer.addLetter(letter);
    }
    // exchangeLetters(player: Player, letters: string): ErrorType {
    // if (player.isActive && this.stock.letterStock.length > DEFAULT_LETTER_COUNT) {
    //     const lettersToRemove: ScrabbleLetter[] = [];
    //     if (player.removeLetter(letters) === true) {
    //         for (let i = 0; i < letters.length; i++) {
    //             lettersToRemove[i] = new ScrabbleLetter(letters[i]);
    //         }

    //         const lettersToAdd: ScrabbleLetter[] = this.stock.exchangeLetters(lettersToRemove);
    //         for (let i = 0; i < lettersToAdd.length; i++) {
    //             this.rackService.removeLetter(lettersToRemove[i]);
    //             this.addRackLetter(lettersToAdd[i]);
    //             this.addLetterToPlayer(lettersToAdd[i]);
    //         }
    //         this.game.isTurnPassed = false;
    //         this.changeTurn();
    //         return ErrorType.NoError;
    //     }
    // }
    // return ErrorType.ImpossibleCommand;
    // }

    // async place(player: Player, placeParams: PlaceParams): Promise<ErrorType> {
    // if (!player.isActive) {
    //     return ErrorType.ImpossibleCommand;
    // }
    // let errorResult = this.placeService.place(player, placeParams);
    // if (errorResult === ErrorType.NoError) {
    //     // Generate all words created
    //     let tempScrabbleWords: ScrabbleWord[];
    //     if (placeParams.orientation === Axis.H) {
    //         tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.H);
    //     } else {
    //         tempScrabbleWords = this.wordBuilder.buildWordsOnBoard(placeParams.word, placeParams.position, Axis.V);
    //     }
    //     const strWords: string[] = [];
    //     tempScrabbleWords.forEach((scrabbleWord) => {
    //         strWords.push(scrabbleWord.stringify().toLowerCase());
    //     });
    //     // validate words waits 3sec if the words are invalid or the server doesn't answer.
    //     await this.validationService.validateWords(tempScrabbleWords).then((isValidWordsResult: boolean) => {
    //         errorResult = isValidWordsResult ? ErrorType.NoError : ErrorType.ImpossibleCommand;
    //         if (!this.validationService.areWordsValid) {
    //             // Retake letters
    //             const removedLetters = this.gridService.removeInvalidLetters(
    //                 placeParams.position,
    //                 placeParams.word.length,
    //                 placeParams.orientation,
    //             );
    //             this.addRackLetters(removedLetters);
    //             removedLetters.forEach((letter) => {
    //                 this.addLetterToPlayer(letter);
    //             });
    //         } else {
    //             // Score
    //             this.validationService.updatePlayerScore(tempScrabbleWords, player);
    //             // Take new letters
    //             const newLetters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT - player.letters.length);
    //             this.addRackLetters(newLetters);
    //             newLetters.forEach((letter) => {
    //                 this.addLetterToPlayer(letter);
    //             });
    //         }
    //         this.game.isTurnPassed = false;
    //         this.changeTurn();
    //     });
    //     return errorResult;
    // }
    // return errorResult;
    // }
    endGame() {
        // stop the game on the server too?
        // emit end game to clients
    }
}
