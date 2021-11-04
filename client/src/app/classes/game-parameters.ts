import { LetterStock } from '@app/services/letter-stock.service';
import { Dictionary } from './dictionary';
import { LocalPlayer } from './local-player';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleWord } from './scrabble-word';

export enum GameType {
    Solo = 0,
    MultiPlayer = 1,
    MultiPlayerLog = 2,
}

// TODO: vrm besoin de ça? players name peut appeler player attributs directement et capacité toujours 2
// unless we plan to make a game with more than 2 players, 
// then having players instead of localPlayer/opponentPlayer would be better
export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[];
}

export class GameParameters {
    gameRoom: GameRoom; // = { idGame: 15, capacity: 2, playersName: new Array<string>() };
    players: Player[];
    localPlayer: Player;
    opponentPlayer: Player;
    creatorPlayer: Player;
    dictionary: Dictionary;
    randomBonus: boolean;
    totalCountDown: number;
    timerMs: number;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    isTurnPassed: boolean;
    consecutivePassedTurns: number;
    isEndGame: boolean;
    newWords: ScrabbleWord[];

    constructor(creatorPlayerName: string, timer: number, isRandom: boolean) {
        this.gameRoom = { idGame: 15, capacity: 2, playersName: new Array<string>() };
        this.dictionary = new Dictionary(0);
        this.localPlayer = new LocalPlayer(creatorPlayerName);
        this.timerMs = timer;
        this.stock = new LetterStock();
        this.consecutivePassedTurns = 0;
        this.isEndGame = false;
        this.isTurnPassed = false;
        this.randomBonus = false;
        this.scrabbleBoard = new ScrabbleBoard(isRandom);
    }
}
