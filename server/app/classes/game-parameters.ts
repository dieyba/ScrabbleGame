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
    // to init when creating game in waiting room
    // wainting room doesnt actually need game. just needs pending-game with creator player, dictionary, timer, and is random bonus
    gameRoom: GameRoom = { idGame: 0, capacity: 2, playersName: new Array<string>() };
    creatorPlayer: Player;
    players: Player[]; // do we still need that?
    dictionary: Dictionary;
    totalCountDown: number;
    randomBonus: boolean;

    // to init when creating the game service
    localPlayer: Player;
    opponentPlayer: Player;

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
}
