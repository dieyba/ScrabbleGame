// import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BestScoresService } from '@app/services/best-scores.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    privateName: boolean;

    constructor(
        public virtualPlayerNameService: VirtualPlayerNameService,
        private bestScoreService: BestScoresService,
        private dictionaryService: DictionaryService,
        private snack: MatSnackBar,
    ) {
        this.privateName = false;
    }

    resetDataBase() {
        this.bestScoreService.resetDbBestScores().subscribe(
            () => {
                /* Do nothing */
            },
            (error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Ok) {
                    this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'close');
                } else {
                    this.snack.open(' La base de données a été réinitialisé avec succès!', 'close');
                }
            },
        );

        this.virtualPlayerNameService.reset().subscribe(
            () => {
                /* Do nothing */
            },
            (error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Ok) {
                    this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'close');
                } else {
                    this.snack.open(' La base de données a été réinitialisé avec succès!', 'close');
                }
            },
        );

        this.dictionaryService.reset().subscribe(
            () => {
                /* Do nothing */
            },
            (error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Ok) {
                    this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'close');
                } else {
                    this.snack.open(' La base de données a été réinitialisé avec succès!', 'close');
                }
            },
        );
    }
}
