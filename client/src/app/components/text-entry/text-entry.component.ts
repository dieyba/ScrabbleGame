import { Component } from '@angular/core';
// import { SocketHandler } from '@app/modules/socket-handler';
// import { GameService } from '@app/services/game.service';
// import { SoloGameService } from '@app/services/solo-game.service';
import { TextEntryService } from '@app/services/text-entry.service';
// import * as io from 'socket.io-client';
@Component({
    selector: 'app-text-entry',
    templateUrl: './text-entry.component.html',
    styleUrls: ['./text-entry.component.scss'],
})
export class TextEntryComponent {
    inputText: string;

    constructor(private textEntryService: TextEntryService) {
        this.inputText = '';
    }

    onKeyUpEnter() {
        this.textEntryService.handleInput(this.inputText);
        this.inputText = '';
    }
}
