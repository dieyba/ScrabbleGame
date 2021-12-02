import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BestScoresComponent } from '@app/components/best-scores/best-scores.component';
import { BASE_URL, BestScoresService } from '@app/services/best-scores.service';

@Component({
    selector: 'app-starting-page',
    templateUrl: './starting-page.component.html',
    styleUrls: ['./starting-page.component.scss'],
})
export class StartingPageComponent {
    playerName: string;
    playerScore: number
    constructor(private dialog: MatDialog, private bestScoresService: BestScoresService) {
        this.playerName = '';
        this.playerScore = 0;
    }

    openDialog(): void {
        this.dialog.open(BestScoresComponent, {});
    }

    postScore() {
        this.bestScoresService
            .postBestScore(this.playerName, this.playerScore, BASE_URL + '/classicMode/send')
            .subscribe(
                () => {
                    /* Do nothing */
                },
                (error: HttpErrorResponse) => {
                    console.log(error)
                    // }
                },
            );
    }
}
