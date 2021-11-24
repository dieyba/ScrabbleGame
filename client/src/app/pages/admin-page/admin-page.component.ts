// import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VirtualPlayerNameManager } from '@app/services/virtual-player-name-manager';
import { BestScoresService } from '@app/services/best-scores.service';

export interface DictionaryInterface {
    idDict: number;
    title: string;
    description: string;
    words: string[];
}

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    privateName: boolean;
    constructor(public virtualPlayerNameManagerService: VirtualPlayerNameManager, private bestScoreService: BestScoresService, private snack: MatSnackBar) {
        this.privateName = false;
    }

    // ngOnInit(): void {
    //     // console.log('beginner names : ', this.beginnerNameList);
    // }

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

        this.virtualPlayerNameManagerService.reset().subscribe(
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
