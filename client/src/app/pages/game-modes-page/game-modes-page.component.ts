import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@app/components/form/form.component';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';

@Component({
    selector: 'game-modes-page',
    templateUrl: './game-modes-page.component.html',
    styleUrls: ['./game-modes-page.component.scss'],
})
export class GameModesComponent {
    constructor(private dialog: MatDialog, private route: ActivatedRoute) {}

    openDialog(isSolo: boolean): void {
        this.dialog.open(FormComponent, { data: { isSolo: isSolo, isLog2990: this.route.snapshot.params.isLog2990 } });
    }
    openJoinRoom(isGameSelected: boolean) {
        this.dialog.open(WaitingAreaComponent, { data: { isGameSelected: isGameSelected, isLog2990: this.route.snapshot.params.isLog2990 }, disableClose: true });
    }
}
