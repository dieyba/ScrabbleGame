import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '@app/components/form/form.component';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';
// import { JoinRoomComponent } from '@app/components/join-room/join-room.component';

@Component({
    selector: 'app-classic-mode',
    templateUrl: './classic-mode.component.html',
    styleUrls: ['./classic-mode.component.scss'],
})
export class ClassicModeComponent {
    constructor(private dialog: MatDialog) {}

    openDialog(isSolo: boolean): void {
        this.dialog.open(FormComponent, { data: isSolo });
    }
    openJoinRoom(gameSelection: boolean) {
        this.dialog.open(WaitingAreaComponent, { data: gameSelection, disableClose: true });
    }
}
