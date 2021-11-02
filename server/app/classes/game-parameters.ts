import { LetterStock } from '@app/services/letter-stock.service';
import { Dictionary } from './dictionary';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';

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
    stock: LetterStock;
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;

    constructor(creatorPlayerName: string, timer: number, randBonus: boolean, id: number) {
        this.players = new Array<Player>();
        // this.creatorPlayer = new Player(creatorPlayerName, '');
        // this.totalCountDown = timer;
        // this.gameRoom.idGame = id;
        // this.gameRoom.capacity = 2;
        this.dictionary = new Dictionary(0);
        // this.randomBonus = isRandomBonus;
        // this.stock = new LetterStock();
        this.hasTurnsBeenPassed = [false, false, false];
        // console.log(this.randomBonus);
        this.gameRoom = { idGame: 0, capacity: 2, playersName: new Array<string>() };
        this.gameRoom.idGame = id;
        // this.dictionary = new Dictionary(0);
        this.localPlayer = new Player(creatorPlayerName, '');
        this.creatorPlayer = this.localPlayer;
        this.totalCountDown = timer;
        this.timerMs = +this.totalCountDown;
        this.stock = new LetterStock();
        // this.hasTurnsBeenPassed = [];
        // this.isEndGame = false;
        // this.turnPassed = false;
        // this.randomBonus = isRandomBonus;
        this.scrabbleBoard = new ScrabbleBoard(randBonus);
        console.log('server Board', this.scrabbleBoard)
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
