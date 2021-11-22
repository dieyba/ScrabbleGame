import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, /*of,*/ throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// enum ErrorCase {
//     ALREADY_THERE = 'Le nom que vous essayez d ajouter est déjà dans la base de données',
//     DELETED = 'Le nom que vous essayer de supprimer a déjà été supprimé'
// }

export interface DictionaryInterface {
    idDict: number;
    title: string;
    description: string;
    words: string[];
}

export interface VirtualPlayerName {
    // idName: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    beginnerNameUrl = 'http://localhost:3000/api/VirtualPlayerName/beginners';
    expertNameUrl = 'http://localhost:3000/api/VirtualPlayerName/experts';

    constructor(private http: HttpClient) {}

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error): Observable<T> => {
            return throwError(error);
            // return of(result as T);
        };
    }

    getBeginnersVirtualPlayerNames(): Observable<VirtualPlayerName[]> {
        return this.http.get<VirtualPlayerName[]>(this.beginnerNameUrl).pipe(catchError(this.handleError('getBeginnersVirtualPlayerNames', [])));
    }

    getExpertsVirtualPlayerNames(): Observable<VirtualPlayerName[]> {
        return this.http.get<VirtualPlayerName[]>(this.expertNameUrl).pipe(catchError(this.handleError('getExpertsVirtualPlayerNames', [])));
    }

    postBeginnersVirtualPlayerNames(name: string): Observable<VirtualPlayerName> {
        return this.http.post<VirtualPlayerName>(this.beginnerNameUrl + "/send", { name: name })
        // .pipe(
        //     catchError(this.handleError('postBeginnersVirtualPlayerNames', { name: name }))
        // );
    }

    postExpertsVirtualPlayerNames(name: string): Observable<VirtualPlayerName> {
        return this.http.post<VirtualPlayerName>(this.expertNameUrl, { name: name })
            .pipe(
                catchError(this.handleError('postExpertsVirtualPlayerNames', { name: name }))
            );
    }

    deleteBeginner(name: string): Observable<VirtualPlayerName> {
        const url = this.beginnerNameUrl + '/' + name;//this.selectedName.name;

        return this.http.delete<VirtualPlayerName>(url)
            .pipe(
                catchError(this.handleError('deleteBeginnerName', { name: "" }))
            );
    }

    deleteExpert(name: string): Observable<VirtualPlayerName> {
        const url = this.expertNameUrl + '/' + name;//this.selectedName.name;

        return this.http.delete<VirtualPlayerName>(url)
            .pipe(
                catchError(this.handleError('deleteExpertName', { name: "" }))
            );
    }

    updateBeginner() {
        return this.http.patch<VirtualPlayerName>(this.beginnerNameUrl, { name: "" })
            .pipe(
                catchError(this.handleError('updateBeginner', { name: "" }))
            );
    }

    updateExpert() {
        return this.http.patch<VirtualPlayerName>(this.expertNameUrl, { name: "" })
            .pipe(
                catchError(this.handleError('updateExpert', { name: "" }))
            );
    }
}
