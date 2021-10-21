import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '@app/classes/game';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private readonly GAME_URL: string = 'http://localhost:3000/api/game';

    constructor(private http: HttpClient) {}

    addGame(data: Game): Observable<Game> {
        return this.http.post<Game>(this.GAME_URL + '/', data).pipe(catchError(this.handleError<Game>('addGameInfo')));
    }

    getAllGamesById(): Observable<Game[]> {
        return this.http.get<Game[]>(this.GAME_URL).pipe(catchError(this.handleError<Game[]>('getAllGames')));
    }

    deleteGameById(idCopy: string): Observable<Game[]> {
        return this.http.delete<Game[]>(this.GAME_URL + '/' + idCopy).pipe(catchError(this.handleError<Game[]>('deleteGame')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
