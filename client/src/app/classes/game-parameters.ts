import { Dictionary } from './dictionary';
import { LocalPlayer } from './local-player';

export class GameParameters {
    player: LocalPlayer;
    dictionary: Dictionary;
    randomBonus: boolean;
    totalCountDown: number;
    constructor(playerName: string, dico: Dictionary, timer: number) {
        this.player = new LocalPlayer(playerName);
        this.dictionary = new Dictionary(0);
        // this.randomBonus = boni;
        this.totalCountDown = timer;
    }
    // initializing(form: FormGroup) {
    //     this.player = new LocalPlayer(form.controls.name.value);
    //     this.dictionary = new Dictionary(+form.controls.dictionaryForm.value);
    //     this.randomBonus = form.controls.bonus.value;
    //     this.totalCountDown = +form.controls.timer.value;
    // }
}
