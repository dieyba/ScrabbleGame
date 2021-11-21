import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { Observable, of } from 'rxjs';
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
    providedIn: 'root'
})
export class AdminService {
    // dictionaries: Dictionary[];

    beginnerNameList: VirtualPlayerName[];
    expertNameList: VirtualPlayerName[];
    newName: FormControl;
    editName: FormControl;
    selectedName: VirtualPlayerName;
    nameAlreadyExist: boolean;

    beginnerNameUrl = 'http://localhost:3000/api/VirtualPlayerName/beginners';
    expertNameUrl = 'http://localhost:3000/api/VirtualPlayerName/experts';
    dictionariesUrl = 'http://localhost:3000/api/Dictionary';
    private index: number;

    constructor(private http: HttpClient) {
        this.beginnerNameList = [];
        this.expertNameList = [];
        this.getBeginnersVirtualPlayerNames().subscribe(beginnerList => (this.beginnerNameList = beginnerList));
        this.getExpertsVirtualPlayerNames().subscribe(expertList => (this.expertNameList = expertList));

        this.newName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(12),
        Validators.minLength(3),]);
        this.editName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(12),
        Validators.minLength(3),]);
        this.selectedName = { name: '' };
        this.nameAlreadyExist = false;
        this.index = ERROR_NUMBER;
        // console.log('get observable : ', this.getDictionaries());
        // this.getDictionaries()
        // this.getDictionaries().subscribe(res => (this.dictionaries = res));
        // console.log('try : ', this.dictionaries);
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }

    getDictionaries(): Observable<DictionaryInterface[]> {
        return this.http.get<DictionaryInterface[]>(this.dictionariesUrl)
            .pipe(
                catchError(this.handleError('getDictionaries', []))
            );
    }

    postDictionaries(dico: DictionaryInterface) {
        return this.http.post<DictionaryInterface>(this.dictionariesUrl, { dico })
            .pipe(
                catchError(this.handleError('postDictionaries', []))
            );
    }

    getBeginnersVirtualPlayerNames(): Observable<VirtualPlayerName[]> {
        return this.http.get<VirtualPlayerName[]>(this.beginnerNameUrl)
            .pipe(
                catchError(this.handleError('getBeginnersVirtualPlayerNames', []))
            );
    }

    getExpertsVirtualPlayerNames(): Observable<VirtualPlayerName[]> {
        return this.http.get<VirtualPlayerName[]>(this.expertNameUrl)
            .pipe(
                catchError(this.handleError('getExpertsVirtualPlayerNames', []))
            );
    }

    postBeginnersVirtualPlayerNames(name: string): Observable<VirtualPlayerName> {
        return this.http.post<VirtualPlayerName>(this.beginnerNameUrl, { name: name })
            .pipe(
                catchError(this.handleError('postBeginnersVirtualPlayerNames', { name: name }))
            );
    }

    postExpertsVirtualPlayerNames(name: string): Observable<VirtualPlayerName> {
        return this.http.post<VirtualPlayerName>(this.expertNameUrl, { name: name })
            .pipe(
                catchError(this.handleError('postExpertsVirtualPlayerNames', { name: name }))
            );
    }

    deleteBeginner(): Observable<VirtualPlayerName> {
        const url = this.beginnerNameUrl + '/' + this.selectedName.name;

        return this.http.delete<VirtualPlayerName>(url)
        // .pipe(
        //     catchError(this.handleError('deleteBeginnerName', { name: this.selectedName.name }))
        // );
    }

    deleteExpert(): Observable<VirtualPlayerName> {
        const url = this.expertNameUrl + '/' + this.selectedName.name;

        return this.http.delete<VirtualPlayerName>(url)
            .pipe(
                catchError(this.handleError('deleteExpertName', { name: this.selectedName.name }))
            );
    }

    updateBeginner() {
        return this.http.patch<VirtualPlayerName>(this.beginnerNameUrl, { name: this.selectedName.name, newName: this.editName.value })
            .pipe(
                catchError(this.handleError('updateBeginner', { name: this.selectedName.name }))
            );
    }

    updateExpert() {
        return this.http.patch<VirtualPlayerName>(this.expertNameUrl, { name: this.selectedName.name, newName: this.editName.value })
            .pipe(
                catchError(this.handleError('updateExpert', { name: this.selectedName.name }))
            );
    }

    untouchable(): boolean {
        return (this.beginnerNameList.indexOf(this.selectedName) <= 2) && (this.expertNameList.indexOf(this.selectedName) <= 2);
    }

    addBeginnerName() {
        if (this.confirm(this.beginnerNameList, this.newName.value)) {
            this.postBeginnersVirtualPlayerNames(this.newName.value).subscribe(added => (this.beginnerNameList.push(added))
                // () => {
                //     let newBeginner = { name: this.newName.value }
                //     console.log('dat');
                //     this.beginnerNameList.push(newBeginner);
                // },
                // (error: HttpErrorResponse) => {
                //     // if (error.)
                // }
            );
        }
    }

    addExpertName() {
        if (this.confirm(this.expertNameList, this.newName.value)) {
            this.postExpertsVirtualPlayerNames(this.newName.value).subscribe(added => (this.expertNameList.push(added)));
        }
    }

    // getIndex(tab: string[]) {
    //     this.index = tab.indexOf(this.selectedName);
    // }

    isBeginnerTab() {
        /*this.getIndex(this.beginnerNameList); */ this.index = this.beginnerNameList.indexOf(this.selectedName);
        if (this.index === ERROR_NUMBER) {
            /*this.getIndex(this.expertNameList)*/ this.index = this.expertNameList.indexOf(this.selectedName);
            return false;
        }
        return true;
    }

    deleteBeginnerName() {
        if (this.index > 2) {
            this.deleteBeginner().subscribe(
                (deleted) => {
                    if (!deleted) {
                        this.beginnerNameList.splice(this.index, 1);
                        this.selectedName.name = '';
                        console.log('splice effectué');
                    };
                },
                (error: HttpErrorResponse) => {
                    console.log('ERREUR : ', error);
                }
            );
            console.log(this.beginnerNameList);
        }
    }

    deleteExpertName() {
        if (this.index > 2) {
            this.deleteExpert().subscribe(
                (deleted) => {
                    if (!deleted) {
                        (this.expertNameList.splice(this.index, 1));
                    }
                }
            );
            this.selectedName.name = '';
        }
    }

    updateBeginnerName() {
        if (this.index <= 2) {
            return;
        }

        if (this.confirm(this.beginnerNameList, this.editName.value)) {
            this.updateBeginner().subscribe(() => (''));
            this.beginnerNameList[this.index] = { name: this.editName.value };
            this.selectedName.name = '';
            this.editName.setValue('');
        }
    }

    updateExpertName() {
        if (this.index <= 2) {
            return;
        }

        if (this.confirm(this.expertNameList, this.editName.value)) {
            this.updateExpert().subscribe(() => (''));
            this.expertNameList[this.index] = { name: this.editName.value };
            this.selectedName.name = '';
            this.editName.setValue('');
        }
    }

    confirm(tab: VirtualPlayerName[], nameToCompare: string): boolean {
        this.nameAlreadyExist = false;
        if (nameToCompare === '') {
            return false;
        }
        for (const name of tab) {
            if (name.name === nameToCompare) {
                this.nameAlreadyExist = true;
                return false;
            }
        }
        return true;
    }

    onSelect(name: VirtualPlayerName) {
        this.selectedName = name;
        this.isBeginnerTab();
        if (this.index > 2) {
            this.editName.setValue(this.selectedName.name);
        }
    }
}
