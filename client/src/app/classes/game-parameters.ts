// import { Dictionary } from './dictionary';
import { LocalPlayer } from './local-player';
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

// TODO: big work in progress, à voir plus tard quels paramètres sont encore utiles sur le client


export class GameParameters {
    localPlayer: Player;
    opponentPlayer: Player;
    totalCountDown: number; // think we'll need it on client too
    timerMs: number; // think we'll need it on client too
    scrabbleBoard: ScrabbleBoard; // init with squares[][] coming from the server?

    // only used for waiting area?
    gameRoom: GameRoom;
    creatorPlayer: Player;

    // de we need this on client too?
    stock: ScrabbleLetter[]; // client would only need this for the stock command
    isEndGame: boolean; // see if it will still be used by methods in the client

    // Not needed in client:
    /*  players: Player[];
     dictionary: Dictionary;
     randomBonus: boolean;
     isTurnPassed: boolean;
     consecutivePassedTurns: number;
     newWords: ScrabbleWord[]; */

    constructor(creatorPlayerName: string, timer: number, isRandom: boolean) {
        this.gameRoom = { idGame: 0, capacity: 2, playersName: new Array<string>() };
        this.creatorPlayer = new LocalPlayer(creatorPlayerName);
        this.creatorPlayer.isActive = true;
        this.localPlayer = new LocalPlayer(creatorPlayerName);
        this.opponentPlayer = new LocalPlayer('');
        this.totalCountDown = timer;
        this.timerMs = +this.totalCountDown;
        this.stock = [];
        this.isEndGame = false;
        // this.scrabbleBoard = new ScrabbleBoard(isRandom);
        // this.players = [];
        // this.consecutivePassedTurns = 0;
        // this.isTurnPassed = false;
        // this.randomBonus = isRandom;
        // this.players = [];
    }
}
