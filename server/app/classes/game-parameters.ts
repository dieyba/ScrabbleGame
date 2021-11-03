// import { MultiPlayerGameService } from './services/multi-player-game.service';
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
    creatorPlayer: Player;
    opponentPlayer: Player;
    dictionary: Dictionary;
    randomBonus: boolean;
    totalCountDown: number;
    creatorName: string;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;
    // multiplayerGame: MultiPlayerGameService;

    constructor(creatorPlayerName: string, timer: number, isRandomBonus: boolean, id: number) {
        this.players = new Array<Player>();
        this.creatorPlayer = new Player(creatorPlayerName, '');
        this.totalCountDown = timer;
        this.gameRoom.idGame = id;
        this.gameRoom.capacity = 2;
        this.dictionary = new Dictionary(0);
        this.randomBonus = isRandomBonus;
        this.stock = new LetterStock();
        this.hasTurnsBeenPassed = [false, false, false];
        // this.multiplayerGame = new MultiPlayerGameService(this.players);
        console.log(this.randomBonus);
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
