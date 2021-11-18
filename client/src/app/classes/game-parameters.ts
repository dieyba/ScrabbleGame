import { GAME_CAPACITY } from '@app/components/form/form.component';
import { GameTimer } from './game-timer';
import { Goals } from './goal';
import { LetterStock } from './letter-stock';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { Square, SquareColor, TOTAL_COLORS } from './square';

export const UNDEFINE_ID = 'none';
export const DEFAULT_LOCAL_PLAYER_ID = 0;
export const DEFAULT_OPPONENT_ID = 1;
export enum GameType {
    Solo = 0,
    MultiPlayer = 1,
}

export interface GameInitInfo {
    players: Player[];
    totalCountDown: number;
    scrabbleBoard: Square[][];
    stockLetters: ScrabbleLetter[];
    gameMode: GameType;
    isLog2990: boolean;
    isRandomBonus?: boolean; // to randomize bonus tile position when creating the board
    sharedGoals: Goals[];
    randomLetterAndColor: RandomLetterAndColor;
}

export class GameParameters {
    players: Player[];
    gameTimer: GameTimer;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    isEndGame: boolean;
    gameMode: GameType;
    isLog2990: boolean;
    sharedGoals: Goals[];
    randomLetterAndColor: RandomLetterAndColor;
    private localPlayerIndex: number;
    private opponentPlayerIndex: number;

    constructor() {
        this.sharedGoals = [];
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

export class RandomLetterAndColor {
    letter: ScrabbleLetter;
    color: SquareColor;

    constructor(lettersLeft: ScrabbleLetter[]) {
        // Set random letter and random color
        const randomLetterIndex = Math.floor(Math.random() * lettersLeft.length);
        this.letter = lettersLeft[randomLetterIndex];
        let randomColorIndex = 0;
        do {
            randomColorIndex = Math.floor(Math.random() * TOTAL_COLORS);
        } while (randomColorIndex === 0);
        this.color = randomColorIndex;
    }
}