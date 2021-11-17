import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
export interface DictionaryInterface {
    idDict: number;
    title: string;
    description: string;
    words: string[];
}

export interface VirtualPlayerName {
    idName: string;
    virtualPlayerName: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    // dictionaries: Dictionary[];

    beginnerNameList: string[];
    expertNameList: string[];
    newName: FormControl;
    editName: FormControl;
    selectedName: string;
    nameAlreadyExist: boolean;
    private index: number;

    beginnerNameUrl = 'http://localhost:3000/api/VirtualPlayerName/beginners';
    expertNameUrl = 'http://localhost:3000/api/VirtualPlayerName/experts';
    dictionariesUrl = 'http://localhost:3000/api/Dictionary';

    constructor(private http: HttpClient) {
        this.beginnerNameList = ['Érika', 'Étienne', 'Sara'];
        this.expertNameList = ['Dieyba', 'Kevin', 'Ariane'];
        this.newName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(12),
        Validators.minLength(3),]);
        this.editName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(12),
        Validators.minLength(3),]);
        this.selectedName = '';
        this.nameAlreadyExist = false;
        this.index = ERROR_NUMBER;
        // console.log('get observable : ', this.getDictionaries());
        // this.getDictionaries()
        // this.getDictionaries().subscribe(res => (this.dictionaries = res));
        // console.log('try : ', this.dictionaries);
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        console.log('error');
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

    postBeginnersVirtualPlayerNames(name: string) {
        return this.http.post<VirtualPlayerName>(this.beginnerNameUrl, { name })
            .pipe(
                catchError(this.handleError('postBeginnersVirtualPlayerNames'))
            );
    }

    postExpertsVirtualPlayerNames(name: string) {
        return this.http.post<VirtualPlayerName>(this.expertNameUrl, { name })
            .pipe(
                catchError(this.handleError('postExpertsVirtualPlayerNames'))
            );
    }

    untouchable(): boolean {
        if (this.beginnerNameList.indexOf(this.selectedName) <= 2 && this.beginnerNameList.indexOf(this.selectedName) <= 2) {
            return true;
        }
        return false;
    }

    addBeginnerName() {
        if (this.confirmAddName(true)) {
            this.beginnerNameList.push(this.newName.value);
        }
    }

    addExpertName() {
        if (this.confirmAddName(false)) {
            this.expertNameList.push(this.newName.value);
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
            this.beginnerNameList.splice(this.index, 1);
            this.selectedName = '';
        }
    }

    deleteExpertName() {
        if (this.index > 2) {
            this.expertNameList.splice(this.index, 1);
            this.selectedName = '';
        }
    }

    updateBeginnerName() {
        if (this.index > 2) {
            if (this.confirmEditName(true)) {
                this.beginnerNameList[this.index] = this.editName.value;
                this.selectedName = '';
                this.editName.setValue('');
            }
        }
    }

    updateExpertName() {
        if (this.index > 2) {
            if (this.confirmEditName(false)) {
                this.beginnerNameList[this.index] = this.editName.value;
                this.selectedName = '';
                this.editName.setValue('');
            }
        }
    }

    confirmAddName(isBeginner: boolean): boolean {
        if (this.newName.value === '') {
            return false;
        }
        return this.confirmName(isBeginner);
    }

    confirmEditName(isBeginner: boolean): boolean {
        if (this.editName.value === '') {
            return false;
        }
        return this.confirmName(isBeginner);
    }

    confirmName(isBeginner: boolean): boolean {
        // if (this.newName.value === '') {
        //     return false;
        // }
        if (isBeginner) {
            for (const name of this.beginnerNameList) {
                if (name === this.newName.value) {
                    this.nameAlreadyExist = true;
                    return false;
                }
            }
            this.nameAlreadyExist = true;
            return true;
        } else {
            for (const name of this.expertNameList) {
                if (name === this.newName.value) {
                    this.nameAlreadyExist = true;
                    return false;
                }
            }
            this.nameAlreadyExist = true;
            return true;
        }
    }

    onSelect(name: string) {
        this.selectedName = name;
        this.isBeginnerTab();
        if (this.index > 2) {
            this.editName.setValue(this.selectedName);
        }
    }
}
