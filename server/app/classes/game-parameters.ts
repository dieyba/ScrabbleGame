import { Dictionary } from './dictionary';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';

export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[];
}
export class GameParameters {
    gameRoom: GameRoom = { idGame: 0, capacity: 2, playersName: new Array<string>() };
    players: Player[];

    localPlayer: Player;
    creatorPlayer: Player;
    opponentPlayer: Player;
    dictionary: Dictionary;
    randomBonus: boolean;
    totalCountDown: number;
    creatorName: string;
    timerMs: number;
    scrabbleBoard: ScrabbleBoard;
    stock: ScrabbleLetter[];
    turnPassed: boolean;
    isEndGame: boolean;

    constructor(creatorPlayerName: string, timer: number, randBonus: boolean, id: number) {
        this.players = new Array<Player>();
        this.dictionary = new Dictionary(0);
        this.gameRoom = { idGame: 0, capacity: 2, playersName: new Array<string>() };
        this.gameRoom.idGame = id;
        this.localPlayer = new Player(creatorPlayerName, '');
        this.creatorPlayer = this.localPlayer;
        this.totalCountDown = timer;
        this.timerMs = +this.totalCountDown;
        this.stock = [];
        this.scrabbleBoard = new ScrabbleBoard(randBonus);
    }
    addPlayer(player: Player) {
        if (this.gameRoom.playersName.length < this.gameRoom.capacity) {
            this.gameRoom.playersName.push(player.name);
            this.players.push(player);
        }
    }
    setPlayerName(name: string) {
        this.gameRoom.playersName.push(name);
    }
    setIdGame(id: number) {
        this.gameRoom.idGame = id;
    }
}
