import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EndGamePopupComponent } from '@app/components/end-game-popup/end-game-popup.component';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameService } from '@app/services/game.service';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    canNavBack: boolean = false;
    private dialogRef: MatDialogRef<EndGamePopupComponent>;
    private socket: io.Socket;
    private readonly server: string;
    constructor(private dialog: MatDialog, private gameService: GameService) {
        this.server = 'http://' + window.location.hostname + ':3000';
        this.socket = SocketHandler.requestSocket(this.server);
        history.pushState(null, '', window.location.href);
    }

    @HostListener('window:popstate', ['$event'])
    onPopState() {
        if (!this.canNavBack) {
            // User confirmation popup
            this.dialogRef = this.dialog.open(EndGamePopupComponent);

            // User confirmation response
            this.dialogRef.afterClosed().subscribe((confirmQuit) => {
                if (confirmQuit) {
                    // calls server to display message in opponent's chat box
                    this.socket.emit('leaveRoom');
                    this.gameService.currentGameService.game.isEndGame = true;
                    this.canNavBack = true;
                    history.back();
                } else {
                    this.canNavBack = false;
                    history.pushState(null, '', window.location.href);
                }
            });
        }
    }
}
