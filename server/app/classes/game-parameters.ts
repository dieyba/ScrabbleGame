import { Dictionary } from './dictionary';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';

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
    creatorName: string;
    scrabbleBoard: ScrabbleBoard;
    stock: ScrabbleLetter[];
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;
    newWords: ScrabbleWord[];

    constructor(creatorPlayerName: string, timer: number, id: number) {
        this.gameRoom.idGame = id;
        this.gameRoom.capacity = 2;
        this.dictionary = new Dictionary(0);
        // this.randomBonus = boni;
        this.creatorPlayer = new Player(creatorPlayerName);
        this.totalCountDown = timer;
    }
}
