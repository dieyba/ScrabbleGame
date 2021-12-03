// import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BestScoresService } from '@app/services/best-scores.service/best-scores.service';
import { DictionaryService } from '@app/services/dictionary.service/dictionary.service';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service/virtual-player-name.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnDestroy {
    privateName: boolean;
    private virtualPlayerNameSubscription: Subscription;
    private bestScoresSubscription: Subscription;
    private dictionarySubscription: Subscription;

    constructor(
        public virtualPlayerNameService: VirtualPlayerNameService,
        private bestScoreService: BestScoresService,
        private dictionaryService: DictionaryService,
        private snack: MatSnackBar,
    ) {
        this.privateName = false;
    }

    ngOnDestroy() {
        this.dictionarySubscription.unsubscribe();
        this.virtualPlayerNameSubscription.unsubscribe();
        this.bestScoresSubscription.unsubscribe();
    }

    resetDataBase() {
        this.bestScoresSubscription = this.bestScoreService.resetDbBestScores().subscribe(
            () => {
                /* Do nothing */
            },
            (error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Ok) {
                    this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'Fermer');
                } else {
                    this.snack.open(' La base de données a été réinitialisé avec succès!', 'Fermer');
                }
            },
        );

        this.virtualPlayerNameSubscription = this.virtualPlayerNameService.reset().subscribe(
            () => {
                /* Do nothing */
            },
            (error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Ok) {
                    this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'Fermer');
                } else {
                    this.snack.open(' La base de données a été réinitialisé avec succès!', 'Fermer');
                }
            },
        );

        this.dictionarySubscription = this.dictionaryService.reset().subscribe(
            () => {
                /* Do nothing */
            },
            (error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Ok) {
                    this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'Fermer');
                } else {
                    this.snack.open(' La base de données a été réinitialisé avec succès!', 'Fermer');
                }
            },
        );
    }
}
