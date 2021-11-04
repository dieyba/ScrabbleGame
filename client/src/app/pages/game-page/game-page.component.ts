import { Component, HostListener } from '@angular/core';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    private socket: io.Socket;
    private readonly server: string;
    constructor() {
        this.server = 'http://' + window.location.hostname + ':3000';
        this.socket = SocketHandler.requestSocket(this.server);
    }
    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload() {
        this.socket.emit('disconnect');
    }
}
