import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
export const BASE_URL = 'http://localhost:3000/api/bestScores';
// export enum HttpStatus {
export const HttpStatus_OK = 200;
// CREATED = 201,
// NO_CONTENT = 204,
// BAD_REQUEST = 400,
// FORBIDDEN = 403,
// NOT_FOUND = 404,
// UNPROCESSABLE = 422,
// TOO_MANY = 429,
// INTERNAL_ERROR = 500,
// }

export interface BestScores {
  playerName: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class BestScoresService {
  constructor(private http: HttpClient, private snack: MatSnackBar,) {
  }
  getBestScores(url: string): Observable<BestScores[]> {
    return this.http.get<BestScores[]>(url);
  }
  postBestScore(playerName: string, playerScore: number, url: string): Observable<BestScores> {
    return this.http.post<BestScores>(url, { playerName: playerName, score: playerScore });
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
    if (error.status !== HttpStatus_OK) {
      this.snack.open("La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!", 'close');
    }
  }
}