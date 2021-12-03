import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BASE_URL, BestScores, BestScoresService } from '@app/services/best-scores.service/best-scores.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-best-scores',
    templateUrl: './best-scores.component.html',
    styleUrls: ['./best-scores.component.scss'],
})
export class BestScoresComponent implements OnInit, OnDestroy {
    classicModeBestScores: BestScores[];
    log2990ModeBestScores: BestScores[];
    classicBestScoresSubscription: Subscription;
    log2990BestScoresSubscription: Subscription;
    constructor(private bestScoresService: BestScoresService, private dialogRef: MatDialogRef<BestScoresComponent>) {
        this.classicModeBestScores = [];
        this.log2990ModeBestScores = [];
    }
    ngOnDestroy(): void {
        this.classicBestScoresSubscription.unsubscribe();
        this.log2990BestScoresSubscription.unsubscribe();
    }

    ngOnInit() {
        this.getClassicBestScores(BASE_URL + '/classicMode');
        this.getLog2990BestScores(BASE_URL + '/log2990Mode');
    }

    samePosition(tab: BestScores[]) {
        for (const score of tab) {
            let nextScore = tab.indexOf(score) + 1;
            if (nextScore === tab.length) {
                nextScore -= 1;
            }
            if (score.score === tab[nextScore].score) {
                tab[nextScore - 1].playerName += ' - ';
                tab[nextScore - 1].playerName += tab[nextScore].playerName;
                tab.splice(nextScore, 1);
            }
        }
    }

    getClassicBestScores(url: string) {
        this.classicBestScoresSubscription = this.bestScoresService.getBestScores(url).subscribe(
            (receiveBestScore) => {
                this.classicModeBestScores = receiveBestScore;
                this.samePosition(this.classicModeBestScores);
            },
            (error: HttpErrorResponse) => {
                this.bestScoresService.handleErrorSnackBar(error);
            },
        );
    }

    getLog2990BestScores(url: string) {
        this.log2990BestScoresSubscription = this.bestScoresService.getBestScores(url).subscribe(
            (receiveBestScore) => {
                this.log2990ModeBestScores = receiveBestScore;
            },
            (error: HttpErrorResponse) => {
                this.bestScoresService.handleErrorSnackBar(error);
            },
        );
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
