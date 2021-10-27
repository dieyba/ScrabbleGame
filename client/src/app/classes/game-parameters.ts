import { Dictionary } from './dictionary';
import { LetterStock } from './letter-stock';
import { LocalPlayer } from './local-player';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleWord } from './scrabble-word';

export enum GameType {
    Solo = 0,
    MultiPlayer = 1,
    MultiPlayerLog = 2,
}

export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[];
}

export class GameParameters {
    gameRoom: GameRoom = { idGame: 15, capacity: 2, playersName: new Array<string>() };
    creatorPlayer: Player;
    opponentPlayer: Player;
    dictionary: Dictionary;
    randomBonus: boolean;
    totalCountDown: number;
    timerMs: number;
    creatorName: string;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;
    newWords: ScrabbleWord[];

    constructor(creatorPlayerName: string, timer: number) {
        this.gameRoom.capacity = 2;
        this.dictionary = new Dictionary(0);
        this.creatorPlayer = new LocalPlayer(creatorPlayerName);
        this.timerMs = timer;
        this.stock = new LetterStock();
        this.hasTurnsBeenPassed = [];
        this.isEndGame = false;
        this.turnPassed = false;
        this.randomBonus = false;
        this.scrabbleBoard = new ScrabbleBoard();
    }
}
