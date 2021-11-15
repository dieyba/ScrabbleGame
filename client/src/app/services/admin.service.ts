import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ERROR_NUMBER } from '@app/classes/utilities';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    beginnerNameList: string[];
    expertNameList: string[];
    newName: FormControl;
    selectedName: string;
    private index: number;

    constructor() {
        this.beginnerNameList = ['Érika', 'Étienne', 'Sara'];
        this.expertNameList = ['Dieyba', 'Kevin', 'Ariane'];
        this.newName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(12),
        Validators.minLength(3),]);
        this.selectedName = '';
        this.index = ERROR_NUMBER;
    }

    untouchable(): boolean {
        if (this.beginnerNameList.indexOf(this.selectedName) <= 2 && this.beginnerNameList.indexOf(this.selectedName) <= 2) {
            return true;
        }
        return false;
    }

    addBeginnerName() {
        if (this.confirmName(true)) {
            this.beginnerNameList.push(this.newName.value);
        }
    }

    addExpertName() {
        if (this.confirmName(false)) {
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
        }
    }

    deleteExpertName() {
        if (this.index > 2) {
            this.expertNameList.splice(this.index, 1);
        }
    }

    updateBeginnerName() {
        if (this.index > 2) {
            this.beginnerNameList[this.index] = this.newName.value;
        }
    }

    updateExpertName() {
        if (this.index > 2) {
            this.beginnerNameList[this.index] = this.newName.value;
        }
    }

    confirmName(isBeginner: boolean): boolean {
        if (this.newName.value === '') {
            return false;
        }
        if (isBeginner) {
            for (const name of this.beginnerNameList) {
                if (name === this.newName.value) {
                    return false;
                }
            }
            return true;
        } else {
            for (const name of this.expertNameList) {
                if (name === this.newName.value) {
                    return false;
                }
            }
            return true;
        }
    }

    onSelect(name: string) {
        this.selectedName = name;
    }
}
