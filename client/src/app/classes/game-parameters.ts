import { GAME_CAPACITY } from '@app/components/form/form.component';
import { GameTimer } from './game-timer';
import { LetterStock } from './letter-stock';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { Square } from './square';
import { ERROR_NUMBER } from './utilities';
import { Difficulty, VirtualPlayer } from './virtual-player';

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
    isRandomBonus?: boolean; // to randomize bonus tile position when creating the board
}

export class GameParameters {
    players: Player[];
    gameTimer: GameTimer;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    isEndGame: boolean;
    gameMode: GameType;
    isLOG2990: boolean;
    private localPlayerIndex: number;
    private opponentPlayerIndex: number;

    constructor() {
        this.players = new Array<Player>();
        this.gameTimer = new GameTimer();
        this.isEndGame = false;
        this.gameMode = GameType.Solo;
        this.isLOG2990 = false;
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

    // TODO: method is a work in progress, to adapt as needed and see if the method works.
    // See where to move in client and see how synchronization with server will work
    convertToVirtualPlayer(previousPlayerIndex: number, virtualPlayerName: string): VirtualPlayer | undefined {
        let newVirtualPlayer;
        const isValidIndex = previousPlayerIndex > ERROR_NUMBER && previousPlayerIndex < this.players.length;
        if (isValidIndex) {
            const previousPlayer = this.players[previousPlayerIndex];
            newVirtualPlayer = new VirtualPlayer(virtualPlayerName, Difficulty.Easy);
            newVirtualPlayer.letters = previousPlayer.letters;
            newVirtualPlayer.isActive = previousPlayer.isActive;
            newVirtualPlayer.score = previousPlayer.score;
            newVirtualPlayer.isWinner = previousPlayer.isWinner; // probably wouldn't need that line
            newVirtualPlayer.roomId = previousPlayer.roomId; // does a vp need a room id?
            this.players[previousPlayerIndex] = newVirtualPlayer;
            this.gameMode = GameType.Solo;
        }
        return newVirtualPlayer;
    }
}
