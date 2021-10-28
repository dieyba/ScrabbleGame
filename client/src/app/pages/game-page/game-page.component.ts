import { Component } from '@angular/core';
import { GameListService } from '@app/services/game-list.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(private gameList: GameListService) {
        console.log(this.gameList.players);
    }
}
