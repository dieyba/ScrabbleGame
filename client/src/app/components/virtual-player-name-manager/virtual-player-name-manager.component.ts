import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ERROR_NUMBER } from '@app/classes/utilities';
import { AdminService, VirtualPlayerName } from '@app/services/admin.service';

const maxLength = 12;

enum ErrorCase {
    ALREADY_THERE = 'Le nom que vous essayez d ajouter est déjà dans la base de données',
    DELETED = 'Le nom que vous essayer de supprimer a déjà été supprimé'
}

@Component({
    selector: 'app-virtual-player-name-manager',
    templateUrl: './virtual-player-name-manager.component.html',
    styleUrls: ['./virtual-player-name-manager.component.scss']
})

export class VirtualPlayerNameManagerComponent implements OnInit {
    beginnerNameList: VirtualPlayerName[];
    expertNameList: VirtualPlayerName[];

    selectedName: VirtualPlayerName;
    newName: FormControl;
    editName: FormControl;
    nameAlreadyExist: boolean;
    private index: number;

    constructor(private virtualPlayerNameManagerService: AdminService, private snack: MatSnackBar) {
        this.beginnerNameList = [];
        this.expertNameList = [];
        this.selectedName = { name: "" };
        this.newName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(maxLength), Validators.minLength(3)]);
        this.editName = new FormControl('', [Validators.pattern('[a-zA-ZÉé]*'), Validators.maxLength(maxLength), Validators.minLength(3)]);
        this.nameAlreadyExist = false;
        this.index = ERROR_NUMBER;
    }

    ngOnInit(): void {
        this.virtualPlayerNameManagerService.getBeginnersVirtualPlayerNames().subscribe(beginnerList => (this.beginnerNameList = beginnerList));;
        this.virtualPlayerNameManagerService.getExpertsVirtualPlayerNames().subscribe(expertList => (this.expertNameList = expertList));
    }

    isUntouchable(): boolean {
        return (this.beginnerNameList.indexOf(this.selectedName) <= 2) && (this.expertNameList.indexOf(this.selectedName) <= 2);
    }

    addBeginnerName() {
        if (this.confirm(this.beginnerNameList, this.newName.value)) {
            this.virtualPlayerNameManagerService.postBeginnersVirtualPlayerNames(this.newName.value).subscribe(
                (added) => {
                    console.log('subscribe');
                    console.log('added : ', added);
                    this.beginnerNameList.push(added);
                },
                (error: HttpErrorResponse) => {
                    console.log('VA DANS LA PREMIERE PARTIE ORHH');
                    console.log('ERREUR : ', error);
                }
            );
        }
    }

    addExpertName() {
        if (this.confirm(this.expertNameList, this.newName.value)) {
            this.virtualPlayerNameManagerService.postExpertsVirtualPlayerNames(this.newName.value).subscribe(added => (this.expertNameList.push(added)));
        }
    }

    // getIndex(tab: string[]) {
    //     this.index = tab.indexOf(this.selectedName);
    // }

    isBeginnerTab() {
        /* this.getIndex(this.beginnerNameList); */ this.index = this.beginnerNameList.indexOf(this.selectedName);
        if (this.index === ERROR_NUMBER) {
            /* this.getIndex(this.expertNameList)*/ this.index = this.expertNameList.indexOf(this.selectedName);
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

    private deleteBeginnerName() {
        if (this.index > 2) {
            this.virtualPlayerNameManagerService.deleteBeginner(this.selectedName.name).subscribe(
                (deleted) => {
                    // console.log('deleted : ', deleted);
                    if (!deleted) {
                        // console.log('sand le if');
                        this.beginnerNameList.splice(this.index, 1);
                        this.selectedName.name = '';
                        // console.log('splice effectué');
                    };
                },
                (error: HttpErrorResponse) => {
                    this.snack.open(ErrorCase.DELETED, 'close');
                }
            );
            console.log(this.beginnerNameList);
        }
    }

    private deleteExpertName() {
        if (this.index > 2) {
            this.virtualPlayerNameManagerService.deleteExpert(this.selectedName.name).subscribe(
                (deleted) => {
                    if (!deleted) {
                        (this.expertNameList.splice(this.index, 1));
                    }
                }
            );
            this.selectedName.name = '';
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

    private updateBeginnerName() {
        if (this.index <= 2) {
            return;
        }

        if (this.confirm(this.beginnerNameList, this.editName.value)) {
            this.virtualPlayerNameManagerService.updateBeginner().subscribe(() => (''));
            this.beginnerNameList[this.index] = { name: this.editName.value };
            this.selectedName.name = '';
            this.editName.setValue('');
        }
    }

    private updateExpertName() {
        if (this.index <= 2) {
            return;
        }

        if (this.confirm(this.expertNameList, this.editName.value)) {
            this.virtualPlayerNameManagerService.updateExpert().subscribe(() => (''));
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