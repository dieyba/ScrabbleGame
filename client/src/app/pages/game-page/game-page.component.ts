import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EndGamePopupComponent } from '@app/components/end-game-popup/end-game-popup.component';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    private dialogRef: MatDialogRef<EndGamePopupComponent>;
    private socket: io.Socket;
    private readonly server: string;
    private canNavBack: boolean = false;
    constructor(public router: Router, public dialog: MatDialog) {
        this.server = 'http://' + window.location.hostname + ':3000';
        this.socket = SocketHandler.requestSocket(this.server);
        history.pushState(null, '', window.location.href);
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload() {
        this.socket.emit('disconnect');
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
                    this.socket.emit('playerQuit');
                    this.canNavBack = true;
                    this.router.navigateByUrl('/');
                    this.router.navigate(['/classic']);
                } else {
                    history.pushState(null, '', window.location.href);
                }
            });
            this.socket.emit('disconnect');
        }
    }

}
