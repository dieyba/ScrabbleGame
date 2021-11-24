/* eslint no-underscore-dangle: 0 */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { VirtualPlayerName, VirtualPlayerNameManager } from '@app/services/virtual-player-name-manager';

const maxLength = 12;
// export const BEGINNER_VIRTUAL_PLAYER_NAMES_URL = 'http://localhost:3000/api/VirtualPlayerName/beginners';
// export const EXPERT_VIRTUAL_PLAYER_NAMES_URL = 'http://localhost:3000/api/VirtualPlayerName/experts';

enum ErrorCase {
    InvalidName = 'Ce nom est invalide',
    AlreadyThere = 'Ce nom existe déjà dans la base de données, actualisez votre page.',
    DeleteAfterDeleteOrUpdate = 'Le nom que vous essayiez de supprimer a déjà été modifié ou supprimé, actualisez votre page.',
    UpdateAfterDelete = 'Le nom que vous essayiez de modifié a été supprimé, actualisez votre page.',
    DatabaseServerCrash = 'La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard.',
}

@Component({
    selector: 'app-virtual-player-name-manager',
    templateUrl: './virtual-player-name-manager.component.html',
    styleUrls: ['./virtual-player-name-manager.component.scss'],
})
export class VirtualPlayerNameManagerComponent implements OnInit {
    beginnerNameUrl = 'http://localhost:3000/api/VirtualPlayerName/beginners';
    expertNameUrl = 'http://localhost:3000/api/VirtualPlayerName/experts';
    beginnerNameList: VirtualPlayerName[];
    expertNameList: VirtualPlayerName[];

    selectedName: VirtualPlayerName;
    newName: FormControl;
    editName: FormControl;
    private index: number;

    constructor(private virtualPlayerNameManagerService: VirtualPlayerNameManager, private snack: MatSnackBar) {
        this.beginnerNameList = [];
        this.expertNameList = [];
        this.selectedName = { _id: '', name: '' };
        this.newName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(maxLength), Validators.minLength(3)]);
        this.editName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(maxLength), Validators.minLength(3)]);
        this.index = ERROR_NUMBER;
    }

    ngOnInit(): void {
        this.virtualPlayerNameManagerService
            .getVirtualPlayerNames(this.beginnerNameUrl)
            .subscribe((beginnerList) => (this.beginnerNameList = beginnerList));
        this.virtualPlayerNameManagerService.getVirtualPlayerNames(this.expertNameUrl).subscribe((expertList) => (this.expertNameList = expertList));
    }

    isUntouchable(): boolean {
        return this.beginnerNameList.indexOf(this.selectedName) <= 2 && this.expertNameList.indexOf(this.selectedName) <= 2;
    }

    addName(collection: VirtualPlayerName[], url: string) {
        if (!this.newName.valid) {
            this.snack.open(ErrorCase.InvalidName, 'close');
            return;
        }

        this.virtualPlayerNameManagerService.postVirtualPlayerNames(url, this.newName.value).subscribe(
            (added) => {
                collection.push(added);
            },
            (error: HttpErrorResponse) => {
                if (error.statusText === 'Unknown Error') {
                    this.snack.open(ErrorCase.DatabaseServerCrash, 'close');
                    return;
                }
                this.snack.open(ErrorCase.AlreadyThere, 'close');
            },
        );
    }

    isBeginnerTab() {
        this.index = this.beginnerNameList.indexOf(this.selectedName);
        if (this.index === ERROR_NUMBER) {
            this.index = this.expertNameList.indexOf(this.selectedName);
            return false;
        }
        return true;
    }

    deleteName() {
        if (this.isBeginnerTab()) {
            this.delete(this.beginnerNameList, this.beginnerNameUrl);
        } else {
            this.delete(this.expertNameList, this.expertNameUrl);
        }
    }

    updateName() {
        if (this.editName.value === '') {
            return;
        }
        if (this.isBeginnerTab()) {
            this.update(this.beginnerNameList, this.beginnerNameUrl);
        } else {
            this.update(this.expertNameList, this.expertNameUrl);
        }
    }

    onSelect(name: VirtualPlayerName) {
        this.selectedName = name;
        this.isBeginnerTab();
        if (this.index > 2) {
            this.editName.setValue(this.selectedName.name);
        }
    }

    private delete(collection: VirtualPlayerName[], url: string) {
        if (this.index <= 2) {
            return;
        }

        this.virtualPlayerNameManagerService.delete(url, this.selectedName.name).subscribe(
            (deleted) => {
                if (!deleted) {
                    collection.splice(this.index, 1);
                    this.selectedName.name = '';
                }
            },
            (error: HttpErrorResponse) => {
                if (error.statusText === 'Unknown Error') {
                    this.snack.open(ErrorCase.DatabaseServerCrash, 'close');
                    return;
                }
                this.snack.open(ErrorCase.DeleteAfterDeleteOrUpdate, 'close');
            },
        );
    }

    private update(collection: VirtualPlayerName[], url: string) {
        if (this.index <= 2) {
            return;
        }

        if (!this.editName.valid) {
            this.snack.open(ErrorCase.InvalidName, 'close');
            return;
        }

        this.virtualPlayerNameManagerService.update(url, this.selectedName._id, this.editName.value).subscribe(
            () => {
                collection[this.index] = { _id: this.selectedName._id, name: this.editName.value };
                this.selectedName.name = '';
                this.editName.setValue('');
            },
            (error: HttpErrorResponse) => {
                if (error.statusText === 'Unknown Error') {
                    this.snack.open(ErrorCase.DatabaseServerCrash, 'close');
                    return;
                }

                if (error.error === 'Ce nom existe déjà') {
                    this.snack.open(ErrorCase.AlreadyThere, 'close');
                    return;
                }
                this.snack.open(ErrorCase.UpdateAfterDelete, 'close');
            },
        );
    }

    // confirmName(tab: VirtualPlayerName[], nameToCompare: string): boolean {
    //     this.nameAlreadyExist = false;
    //     if (nameToCompare === '') {
    //         return false;
    //     }
    //     for (const name of tab) {
    //         if (name.name === nameToCompare) {
    //             this.nameAlreadyExist = true;
    //             return false;
    //         }
    //     }
    //     return true;
    // }
}
