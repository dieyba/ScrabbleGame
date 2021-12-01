import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const BASE_URL = environment.serverUrl + `/bestScores`;

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
        const bestScore: BestScores = { playerName, score: playerScore };
        return this.http.post<BestScores>(url, bestScore);
    }

    // postClassicBestScore(playerName: string, playerScore: number): Observable<BestScores> {
    //   // const bestScore: BestScores = { playerName: playerName, score: playerScore };
    //   return this.http.post<BestScores>(this.baseUrl + '/classicMode/send', { playerName: playerName, score: playerScore });
    // }

    // postLog2990BestScore(playerName: string, playerScore: number): Observable<BestScores> {
    //   // const bestScore: BestScores = { playerName: playerName, score: playerScore };
    //   return this.http.post<BestScores>(this.baseUrl + '/log2990Mode/send', { playerName: playerName, score: playerScore });
    // }

    resetDbBestScores() {
        return this.http.delete<BestScores>(BASE_URL);
    }

    handleErrorSnackBar(error: HttpErrorResponse): void {
        if (error.status !== HttpStatusCode.Ok) {
            this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'close');
        }
    }
}
