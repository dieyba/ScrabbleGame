import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DictionaryInterface } from './virtual-player-name.service';

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

    reset(): Observable<DictionaryInterface> {
        return this.http.delete<DictionaryInterface>(BASE_URL);
    }

    update(url: string, dictionaryName: string, dictionaryId: unknown, updatedTitle: string, updatedDescription: string) {
        return this.http.patch<DictionaryInterface>(url + '/' + dictionaryName, { id: dictionaryId, newTitle: updatedTitle, newDescription: updatedDescription});
    }

    handleErrorSnackBar(error: HttpErrorResponse): void {
        if (error.status !== HttpStatusCode.Ok) {
            this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'close');
        }
    }
}
