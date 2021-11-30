import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryInterface } from '@app/classes/dictionary';
import { Observable } from 'rxjs';

export const BASE_URL = 'http://localhost:3000/api/dictionary';
@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    constructor(private http: HttpClient, private snack: MatSnackBar) {}

    uploadFromString(dictionaryJSONString: string): Observable<DictionaryInterface> {
        const dictionary = JSON.parse(dictionaryJSONString) as DictionaryInterface;
        return this.postDictionary(dictionary, BASE_URL);
    }

    getDictionaries(url: string): Observable<DictionaryInterface[]> {
        return this.http.get<DictionaryInterface[]>(url);
    }

    getDictionary(url: string, dictionaryName: string): Observable<DictionaryInterface> {
        return this.http.get<DictionaryInterface>(url + '/' + dictionaryName);
    }

    postDictionary(dictionary: DictionaryInterface, url: string): Observable<DictionaryInterface> {
        return this.http.post<DictionaryInterface>(url, dictionary);
    }

    // resetDbBestScores() {
    //     return this.http.delete<BestScores>(BASE_URL);
    // }

    handleErrorSnackBar(error: HttpErrorResponse): void {
        switch (error.status) {
            case HttpStatusCode.Ok: {
                this.snack.open('Téléversement réussi!', 'Fermer');
                break;
            }
            case HttpStatusCode.UnprocessableEntity: {
                this.snack.open('Erreur : ' + error.error, 'Fermer');
                break;
            }
            default: {
                this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard.', 'Fermer');
                break;
            }
        }
    }
}
