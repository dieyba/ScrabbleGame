import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface VirtualPlayerName {
    _id: unknown;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerNameService {
    private databaseUrl = environment.serverUrl + `/VirtualPlayerName`;

    constructor(private http: HttpClient) {}

    getVirtualPlayerNames(url: string): Observable<VirtualPlayerName[]> {
        return this.http.get<VirtualPlayerName[]>(url);
    }

    postVirtualPlayerNames(url: string, name: string): Observable<VirtualPlayerName> {
        return this.http.post<VirtualPlayerName>(url, { name });
    }

    delete(url: string, name: string): Observable<VirtualPlayerName> {
        const lastUrl = url + '/' + name;

        return this.http.delete<VirtualPlayerName>(lastUrl);
    }

    update(url: string, nameToUpdateId: unknown, updatedName: string) {
        return this.http.patch<VirtualPlayerName>(url, { id: nameToUpdateId, newName: updatedName });
    }

    reset() {
        return this.http.delete<VirtualPlayerName[]>(this.databaseUrl);
    }
}
