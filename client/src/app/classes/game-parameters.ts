import { GAME_CAPACITY } from '@app/components/form/form.component';
import { GameTimer } from './game-timer';
import { LetterStock } from './letter-stock';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { Square } from './square';

export const UNDEFINE_ID = 'none';
export const DEFAULT_LOCAL_PLAYER_ID = 0;
export const DEFAULT_OPPONENT_ID = 1;
export enum GameType {
    Solo = 0,
    MultiPlayer = 1,
}

export enum Goals {
    PlaceLetterWorthTenPts = 0, // Place a word containing a letter with a 10 pts value
    FormTwoLettersStarsOnly = 1, // Form 2 letter word, both letters are *
    FormWordWithLettersFromName = 2, /* Form a word containing at least 3 letters from the player's name
        (can be same letter, but different occurence)*/
    FormAnExistingWord = 3, // Form a word already on the board
    FormThreeWords = 4, // Form three words at the same time 
    PlaceLetterOnBoardCorner = 5, // Place a letter on one of the 4 boaard corners
    ActivateTwoBonuses = 6, // Active 2 bonuses at the same time / place a word with 2 letters on a colour square
    PlaceLetterOnColorSquare = 7, // Place letter x on a square of color y. x and y are randomly chosen at start of game
}

export enum GoalPoints {
    PlaceLetterWorthTenPts = 20,
    FormTwoLettersStarsOnly = 20,
    FormWordWithLettersFromName = 30,
    FormAnExistingWord = 20,
    FormThreeWords = 50,
    PlaceLetterOnBoardCorner = 30,
    ActivateTwoBonuses = 30,
    PlaceLetterOnColorSquare = 50,
}

export interface GameInitInfo {
    players: Player[];
    totalCountDown: number;
    scrabbleBoard: Square[][];
    stockLetters: ScrabbleLetter[];
    gameMode: GameType;
    isLog2990: boolean;
    isRandomBonus?: boolean; // to randomize bonus tile position when creating the board
    goals: Goals[];
}

export class GameParameters {
    players: Player[];
    gameTimer: GameTimer;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    isEndGame: boolean;
    gameMode: GameType;
    isLog2990: boolean;
    private localPlayerIndex: number;
    private opponentPlayerIndex: number;

    constructor() {
        this.players = new Array<Player>();
        this.gameTimer = new GameTimer();
        this.isEndGame = false;
        this.gameMode = GameType.Solo;
        this.isLog2990 = false;
        this.localPlayerIndex = DEFAULT_LOCAL_PLAYER_ID; // by default, in solo games, the local player is the first player
        this.opponentPlayerIndex = DEFAULT_OPPONENT_ID;
    }

    setLocalAndOpponentId(localPlayerIndex: number, opponentPlayerIndex: number) {
        this.localPlayerIndex = localPlayerIndex;
        this.opponentPlayerIndex = opponentPlayerIndex;
    }
    getLocalPlayer(): Player {
        return this.players[this.localPlayerIndex];
    }
    getOpponent(): Player {
        return this.players[this.opponentPlayerIndex];
    }
    setLocalPlayer(localPlayer: Player) {
        if (this.localPlayerIndex >= 0 && this.localPlayerIndex < GAME_CAPACITY) {
            this.players[this.localPlayerIndex] = localPlayer;
        }
    }
    setOpponent(opponent: Player) {
        if (this.opponentPlayerIndex >= 0 && this.opponentPlayerIndex < GAME_CAPACITY) {
            this.players[this.opponentPlayerIndex] = opponent;
        }
    }
}
