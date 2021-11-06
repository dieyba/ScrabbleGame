import { Dictionary } from './dictionary';
import { LocalPlayer } from './local-player';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
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
    gameRoom: GameRoom;
    players: Player[];
    localPlayer: Player;
    opponentPlayer: Player;
    creatorPlayer: Player;
    dictionary: Dictionary;
    randomBonus: boolean;
    totalCountDown: number;
    timerMs: number;
    scrabbleBoard: ScrabbleBoard;
    stock: ScrabbleLetter[];
    isTurnPassed: boolean;
    consecutivePassedTurns: number;
    isEndGame: boolean;
    newWords: ScrabbleWord[];

    constructor(creatorPlayerName: string, timer: number, isRandom: boolean) {
        this.gameRoom = { idGame: 0, capacity: 2, playersName: new Array<string>() };
        this.players = [];
        this.creatorPlayer = new LocalPlayer(creatorPlayerName)
        this.creatorPlayer.isActive = true
        this.localPlayer = new LocalPlayer(creatorPlayerName);
        this.totalCountDown = timer;
        this.timerMs = +this.totalCountDown;
        this.opponentPlayer = new LocalPlayer('')
        this.stock = [];
        this.consecutivePassedTurns = 0;
        this.isEndGame = false;
        this.isTurnPassed = false;
        this.randomBonus = isRandom;
        this.scrabbleBoard = new ScrabbleBoard(this.randomBonus);
        this.players = [];
    }
}
