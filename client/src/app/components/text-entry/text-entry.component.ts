import { Component } from '@angular/core';
//import { SocketHandler } from '@app/modules/socket-handler';
//import { GameService } from '@app/services/game.service';
//import { SoloGameService } from '@app/services/solo-game.service';
import { TextEntryService } from '@app/services/text-entry.service';
//import * as io from 'socket.io-client';
@Component({
    selector: 'app-text-entry',
    templateUrl: './text-entry.component.html',
    styleUrls: ['./text-entry.component.scss'],
})
export class TextEntryComponent {
    inputText = '';
    //private socket: io.Socket;
    //private readonly server = 'http://' + window.location.hostname + ':3000';

    constructor(private textEntryService: TextEntryService /*, private game: GameService*/) {
        //this.socket = SocketHandler.requestSocket(this.server);
    }

    onKeyUpEnter() {
        // if (this.game.currentGameService instanceof SoloGameService) {
        //     // onKeyUp events are always from the local player.
        //     this.textEntryService.handleInput(this.inputText, true);
        // } else {
        //     this.socket.emit();
        // }
        this.textEntryService.handleInput(this.inputText, true);

        this.inputText = '';
    }
}
