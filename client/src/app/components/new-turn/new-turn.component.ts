import { Component, OnInit } from '@angular/core';
import { SoloGameService } from '@app/services/solo-game.service';

@Component({
    selector: 'app-new-turn',
    templateUrl: './new-turn.component.html',
    styleUrls: ['./new-turn.component.scss'],
})
export class NewTurnComponent implements OnInit {
    constructor(private soloGameSevice: SoloGameService) {}

    ngOnInit(): void {}

    play() {
        this.soloGameSevice.closeDialog();
    }

    passTurn() {
        this.soloGameSevice.changeActivePlayer();
        this.soloGameSevice.dialog.closeAll();
    }
}
