// import { Dictionary } from './dictionary';
import { DictionaryType } from './dictionary';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';

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

export class PendingGameParameters {
    gameRoom: GameRoom;
    capacity: number; // if we want to create more than 2 player games
    creatorName: string;
    joinerName: string;
    dictionaryType: DictionaryType;
    totalCountDown: number;
    isRandomBonus: boolean;
    gameMode: GameType;

    // TODO: see assurance qualité if we can have more than 3 params for constructor
    constructor(
        gameMode: GameType,
        capacity: number,
        dictionaryType: DictionaryType,
        totalCountDown: number,
        isRandomBonus: boolean,
        creatorPlayerName: string,
        opponentName?: string
    ) {
        this.gameMode = gameMode;
        this.gameRoom = { idGame: 0, capacity: capacity, playersName: new Array<string>() };
        this.dictionaryType = dictionaryType;
        this.totalCountDown = totalCountDown;
        this.isRandomBonus = isRandomBonus;
        this.creatorName = creatorPlayerName;
        this.gameRoom.playersName.push(this.creatorName);
        if (opponentName !== undefined && GameType.Solo) {
            this.joinerName = opponentName;
            this.gameRoom.playersName.push(this.joinerName);
        } else {
            this.joinerName = '';
        }
    }
}

export interface GameParameters {
    players: Player[];
    totalCountDown: number;
    timerMs: number;
    scrabbleBoard: ScrabbleBoard; // will be constructed with squares[][] coming from the server
    stock: ScrabbleLetter[];
    isEndGame: boolean;
    gameMode: GameType;
}
