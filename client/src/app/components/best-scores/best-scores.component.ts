import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BestScores, BestScoresService } from '@app/services/best-scores.service';

@Component({
  selector: 'app-best-scores',
  templateUrl: './best-scores.component.html',
  styleUrls: ['./best-scores.component.scss']
})
export class BestScoresComponent implements OnInit {
  classicModeBestScores: BestScores[];
  log2990ModeBestScores: BestScores[];

  constructor(private bestScoresService: BestScoresService, private dialogRef: MatDialogRef<BestScoresComponent>) {
    this.classicModeBestScores = [];
    this.log2990ModeBestScores = [];
  }

  ngOnInit(): void {
    this.getClassicModeBestScores();
    this.getLog2990ModeBestScores();
  }
  getClassicModeBestScores(): void {
    this.bestScoresService.getClassicModeBestScores().subscribe(classicModeBestScore => { (this.classicModeBestScores = classicModeBestScore) },
      (error: HttpErrorResponse) => {
        this.bestScoresService.handleErrorSnackBar(error);
      },
    );
  }
  getLog2990ModeBestScores() {
    this.bestScoresService.getLog2990ModeBestScores().subscribe(log2990ModeBestScore => { (this.log2990ModeBestScores = log2990ModeBestScore) },
      (error: HttpErrorResponse) => {
        this.bestScoresService.handleErrorSnackBar(error);
      },

    );
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
