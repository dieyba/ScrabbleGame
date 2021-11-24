/* eslint no-underscore-dangle: 0 */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { VirtualPlayerNameManager, VirtualPlayerName } from '@app/services/virtual-player-name-manager';

const maxLength = 12;

enum ErrorCase {
    InvalidName = 'Ce nom est invalide',
    AlreadyThere = 'Ce nom existe déjà dans la base de données, actualisez votre page.',
    DeleteAfterDeleteOrUpdate = 'Le nom que vous essayer de supprimer a déjà été modifié ou supprimé, actualisez votre page.',
    UpdateAfterDelete = 'Le nom que vous essayer de modifié a été supprimé, actualisez votre page.',
    DatabaseServerCrash = 'La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard.',
}

@Component({
    selector: 'app-virtual-player-name-manager',
    templateUrl: './virtual-player-name-manager.component.html',
    styleUrls: ['./virtual-player-name-manager.component.scss'],
})
export class VirtualPlayerNameManagerComponent implements OnInit {
    beginnerNameList: VirtualPlayerName[];
    expertNameList: VirtualPlayerName[];

    selectedName: VirtualPlayerName;
    newName: FormControl;
    editName: FormControl;
    nameAlreadyExist: boolean;
    private index: number;

    constructor(private virtualPlayerNameManagerService: VirtualPlayerNameManager, private snack: MatSnackBar) {
        this.beginnerNameList = [];
        this.expertNameList = [];
        this.selectedName = { _id: '', name: '' };
        this.newName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(maxLength), Validators.minLength(3)]);
        this.editName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(maxLength), Validators.minLength(3)]);
        this.nameAlreadyExist = false;
        this.index = ERROR_NUMBER;
    }

    ngOnInit(): void {
        this.virtualPlayerNameManagerService.getBeginnersVirtualPlayerNames().subscribe((beginnerList) => (this.beginnerNameList = beginnerList));
        this.virtualPlayerNameManagerService.getExpertsVirtualPlayerNames().subscribe((expertList) => (this.expertNameList = expertList));
    }

    isUntouchable(): boolean {
        return this.beginnerNameList.indexOf(this.selectedName) <= 2 && this.expertNameList.indexOf(this.selectedName) <= 2;
    }

    addBeginnerName() {
        if (!this.newName.valid) {
            this.snack.open(ErrorCase.InvalidName, 'close');
            return;
        }

        this.virtualPlayerNameManagerService.postBeginnersVirtualPlayerNames(this.newName.value).subscribe(
            (added) => {
                this.beginnerNameList.push(added);
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

    addExpertName() {
        if (!this.newName.valid) {
            this.snack.open(ErrorCase.InvalidName, 'close');
            return;
        }

        this.virtualPlayerNameManagerService.postExpertsVirtualPlayerNames(this.newName.value).subscribe(
            (added) => {
                this.expertNameList.push(added);
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
            this.deleteBeginnerName();
        } else {
            this.deleteExpertName();
        }
    }

    updateName() {
        if (this.editName.value === '') {
            return;
        }
        if (this.isBeginnerTab()) {
            this.updateBeginnerName();
        } else {
            this.updateExpertName();
        }
    }

    onSelect(name: VirtualPlayerName) {
        this.selectedName = name;
        this.isBeginnerTab();
        if (this.index > 2) {
            this.editName.setValue(this.selectedName.name);
        }
    }

    private deleteBeginnerName() {
        if (this.index > 2) {
            this.virtualPlayerNameManagerService.deleteBeginner(this.selectedName.name).subscribe(
                (deleted) => {
                    if (!deleted) {
                        this.beginnerNameList.splice(this.index, 1);
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
    }

    private deleteExpertName() {
        if (this.index > 2) {
            this.virtualPlayerNameManagerService.deleteExpert(this.selectedName.name).subscribe(
                (deleted) => {
                    if (!deleted) {
                        this.expertNameList.splice(this.index, 1);
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
    }

    private updateBeginnerName() {
        if (this.index <= 2) {
            return;
        }

        if (!this.editName.valid) {
            this.snack.open(ErrorCase.InvalidName, 'close');
            return;
        }

        this.virtualPlayerNameManagerService.updateBeginner(this.selectedName._id, this.editName.value).subscribe(
            () => {
                this.beginnerNameList[this.index] = { _id: this.selectedName._id, name: this.editName.value };
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

    private updateExpertName() {
        if (this.index <= 2) {
            return;
        }

        if (!this.editName.valid) {
            this.snack.open(ErrorCase.InvalidName, 'close');
            return;
        }

        this.virtualPlayerNameManagerService.updateExpert(this.selectedName._id, this.editName.value).subscribe(
            () => {
                this.expertNameList[this.index] = { _id: this.selectedName._id, name: this.editName.value };
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
