import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalPlayer } from '@app/classes/local-player';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BestScores {
  idScore: string;
  playerName: string;
  score: number;
  // idGame: number;
}

@Injectable({
  providedIn: 'root'
})
export class BestScoresService {

  constructor(private http: HttpClient) {}

  classicModeUrl = 'http://localhost:3000/api/bestScores/classicMode';
  log2990ModeUrl = 'http://localhost:3000/api/bestScores/log2990Mode';

  getClassicModeBestScores(): Observable<BestScores[]> {
    return this.http.get<BestScores[]>(this.classicModeUrl)
      .pipe(
        catchError(this.handleError('getClassicModeBestScores', []))
      );
  }

  getLog2990ModeBestScores(): Observable<BestScores[]> {
    return this.http.get<BestScores[]>(this.log2990ModeUrl)
      .pipe(
        catchError(this.handleError('getClassicModeBestScores', []))
      );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }


  postScores(player: LocalPlayer) {
    return this.http.post<BestScores>(this.classicModeUrl, { player })
      .pipe(
        catchError(this.handleError('getClassicModeBestScores', []))
      );
  }
}