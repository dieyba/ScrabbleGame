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
    isLog2990: boolean;
    constructor(private dialog: MatDialog, private route: ActivatedRoute) {
        if (String(this.route.snapshot.params.isLog2990) === 'true') {
            this.isLog2990 = true;
        } else {
            this.isLog2990 = false;
        }
    }

    openDialog(isSolo: boolean): void {
        this.dialog.open(GameInitFormComponent, { data: { isSolo, isLog2990: this.isLog2990 } });
    }

    openJoinRoom(isGameSelected: boolean) {
        this.dialog.open(WaitingAreaComponent, {
            data: {
                isGameSelected,
                isLog2990: this.isLog2990,
            },
            disableClose: true,
        });
    }
}
