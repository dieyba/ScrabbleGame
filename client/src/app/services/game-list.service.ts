import { Injectable } from '@angular/core';
import { GameParameters } from '@app/classes/game-parameters';

@Injectable({
    providedIn: 'root',
})
export class GameListService {
    gameList: GameParameters[] = [];
    // player: LocalPlayer;
    // dictionary: Dictionary;
    // randomBonus: boolean;
    // totalCountDown: number;
    constructor() {}
    addGame(game: GameParameters) {
        // console.log(game.controls.name.value);
        // console.log(game.controls.dictionaryForm.value);
        // console.log(game.controls.bonus.value);
        // console.log(game.controls.timer.value);
        // let singleGame = new GameParameters(
        //     game.controls.name.value,
        //     game.controls.dictionaryForm.value,
        //     game.controls.bonus.value,
        //     game.controls.timer.value,
        // );
        console.log(game);
        this.gameList.push(game);
        // this.player = new LocalPlayer(game.controls.name.value)
        // this.dictionary = new Dictionary(game.controls.dictionaryForm.value);
        // this.randomBonus = game.controls.bonus.value;
        // this.totalCountDown = game.controls.timer.value;
    }
    getList(): GameParameters[] {
        return this.gameList;
    }
}
