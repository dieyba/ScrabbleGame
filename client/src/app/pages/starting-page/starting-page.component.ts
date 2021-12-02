import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BestScoresComponent } from '@app/components/best-scores/best-scores.component';

@Component({
    selector: 'app-starting-page',
    templateUrl: './starting-page.component.html',
    styleUrls: ['./starting-page.component.scss'],
})
export class StartingPageComponent {
    playerName: string;
    playerScore: number
    constructor(private dialog: MatDialog) {
        this.playerName = '';
        this.playerScore = 0;
    }

    openDialog(): void {
        this.dialog.open(BestScoresComponent, {});
    }
}
