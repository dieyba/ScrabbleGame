import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BASE_URL, BestScores, BestScoresService } from '@app/services/best-scores.service';

@Component({
    selector: 'app-best-scores',
    templateUrl: './best-scores.component.html',
    styleUrls: ['./best-scores.component.scss'],
})
export class BestScoresComponent implements OnInit {
    classicModeBestScores: BestScores[];
    log2990ModeBestScores: BestScores[];

    constructor(private bestScoresService: BestScoresService, private dialogRef: MatDialogRef<BestScoresComponent>) {
        this.classicModeBestScores = [];
        this.log2990ModeBestScores = [];
    }

    ngOnInit() {
        this.getClassicBestScores(BASE_URL + '/classicMode');
        this.getLog2990BestScores(BASE_URL + '/log2990Mode');
    }

    getClassicBestScores(url: string) {
        this.bestScoresService.getBestScores(url).subscribe(
            (receiveBestScore) => {
                this.classicModeBestScores = receiveBestScore;
            },
            (error: HttpErrorResponse) => {
                this.bestScoresService.handleErrorSnackBar(error);
            },
        );
    }

    getLog2990BestScores(url: string) {
        this.bestScoresService.getBestScores(url).subscribe(
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
