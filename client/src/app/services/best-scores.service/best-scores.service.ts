import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const BASE_URL = environment.serverUrl + '/bestScores';

export interface BestScores {
    playerName: string;
    score: number;
}

@Injectable({
    providedIn: 'root',
})
export class BestScoresService {
    constructor(private http: HttpClient, private snack: MatSnackBar) {}

    getBestScores(url: string): Observable<BestScores[]> {
        return this.http.get<BestScores[]>(url);
    }

    postBestScore(playerName: string, playerScore: number, url: string): Observable<BestScores> {
        const bestScore = { playerName, score: playerScore } as BestScores;
        return this.http.post<BestScores>(url, bestScore);
    }

    resetDbBestScores() {
        return this.http.delete<BestScores>(BASE_URL);
    }

    handleErrorSnackBar(error: HttpErrorResponse): void {
        if (error.status !== HttpStatusCode.Ok) {
            this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'Fermer');
        }
    }
}
