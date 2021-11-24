import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DictionaryInterface {
    idDict: number;
    title: string;
    description: string;
    words: string[];
}

export interface VirtualPlayerName {
    _id: unknown;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerNameManager {
    private databaseUrl = 'http://localhost:3000/api/VirtualPlayerName';
    private beginnerNameUrl = 'http://localhost:3000/api/VirtualPlayerName/beginners';
    private expertNameUrl = 'http://localhost:3000/api/VirtualPlayerName/experts';

    constructor(private http: HttpClient) {}

    getBeginnersVirtualPlayerNames(): Observable<VirtualPlayerName[]> {
        return this.http.get<VirtualPlayerName[]>(this.beginnerNameUrl);
    }

    getExpertsVirtualPlayerNames(): Observable<VirtualPlayerName[]> {
        return this.http.get<VirtualPlayerName[]>(this.expertNameUrl);
    }

    postBeginnersVirtualPlayerNames(name: string): Observable<VirtualPlayerName> {
        return this.http.post<VirtualPlayerName>(this.beginnerNameUrl, { name });
    }

    postExpertsVirtualPlayerNames(name: string): Observable<VirtualPlayerName> {
        return this.http.post<VirtualPlayerName>(this.expertNameUrl, { name });
    }

    deleteBeginner(name: string): Observable<VirtualPlayerName> {
        const url = this.beginnerNameUrl + '/' + name;

        return this.http.delete<VirtualPlayerName>(url);
    }

    deleteExpert(name: string): Observable<VirtualPlayerName> {
        const url = this.expertNameUrl + '/' + name;

        return this.http.delete<VirtualPlayerName>(url);
    }

    updateBeginner(nameToUpdateId: unknown, updatedName: string) {
        return this.http.patch<VirtualPlayerName>(this.beginnerNameUrl, { id: nameToUpdateId, newName: updatedName });
    }

    updateExpert(nameToUpdateId: unknown, updatedName: string) {
        return this.http.patch<VirtualPlayerName>(this.expertNameUrl, { name: nameToUpdateId, newName: updatedName });
    }

    reset() {
        return this.http.delete<VirtualPlayerName[]>(this.databaseUrl);
    }
}
