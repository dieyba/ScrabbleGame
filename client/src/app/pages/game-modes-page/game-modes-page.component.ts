import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GameInitFormComponent } from '@app/components/game-init-form/game-init-form.component';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';

@Component({
    selector: 'app-game-modes-page',
    templateUrl: './game-modes-page.component.html',
    styleUrls: ['./game-modes-page.component.scss'],
})
export class GameModesComponent {
    constructor(private dialog: MatDialog, private route: ActivatedRoute) {}

    openDialog(isSolo: boolean): void {
        this.dialog.open(GameInitFormComponent, { data: { isSolo, isLog2990: this.route.snapshot.params.isLog2990 } });
    }
    openJoinRoom(isGameSelected: boolean) {
        this.dialog.open(WaitingAreaComponent, {
            data: {
                isGameSelected,
                isLog2990: this.route.snapshot.params.isLog2990,
            },
            disableClose: true,
        });
    }
}
