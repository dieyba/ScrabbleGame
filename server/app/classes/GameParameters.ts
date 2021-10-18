import { Dictionary } from "./dictionary";
import { Player } from "./player";

export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[];
}
export class GameParameters {
    gameRoom: GameRoom = { idGame: 15, capacity: 2, playersName: new Array<string>() };
    player: Player[];
    createrPlayer: Player;
    dictionary: Dictionary;
    randomBonus: boolean;
    totalCountDown: number;
    constructor(createrPlayerName: string, timer: number, id: number) {
        this.gameRoom.idGame = id;
        this.gameRoom.capacity = 2;
        this.player = new Array<Player>();
        this.dictionary = new Dictionary(0);
        // this.randomBonus = boni;
        this.createrPlayer = new Player(createrPlayerName);
        this.totalCountDown = timer;
    }
    addPlayer(player: Player) {
        if (this.gameRoom.playersName.length < this.gameRoom.capacity) {
            this.gameRoom.playersName.push(player.getName());
            this.player.push(player);
        }
    }
}