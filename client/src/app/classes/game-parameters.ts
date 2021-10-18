import { Dictionary } from './dictionary';
import { LocalPlayer } from './local-player';
export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[];
}
export class GameParameters {
    gameRoom: GameRoom = { idGame: 15, capacity: 0, playersName: new Array<string>() };
    createrPlayer: LocalPlayer;
    dictionary: Dictionary;
    randomBonus: boolean;
    totalCountDown: number;
    constructor(createrPlayerName: string, timer: number) {
        this.gameRoom.capacity = 2;
        this.dictionary = new Dictionary(0);
        this.createrPlayer = new LocalPlayer(createrPlayerName);
        this.totalCountDown = timer;
    }
    addPlayer(player: LocalPlayer) {
        if (this.gameRoom.playersName.length < this.gameRoom.capacity) {
            this.gameRoom.playersName.push(player.name);
        }
    }
    // initializing(form: FormGroup) {
    //     this.player = new LocalPlayer(form.controls.name.value);
    //     this.dictionary = new Dictionary(+form.controls.dictionaryForm.value);
    //     this.randomBonus = form.controls.bonus.value;
    //     this.totalCountDown = +form.controls.timer.value;
    // }
}
