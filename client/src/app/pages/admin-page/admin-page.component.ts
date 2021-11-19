import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '@app/services/admin.service';
import { BestScoresService } from '@app/services/best-scores.service';
import { of } from 'rxjs';

const errorIndex = -1;
export interface DictionaryInterface {
    idDict: number;
    title: string;
    description: string;
    words: string[];
}

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    privateName: boolean;
    dictionaries: DictionaryInterface[];
    constructor(public adminService: AdminService, private bestScoreService: BestScoresService, private snack: MatSnackBar) {
        this.privateName = false;
        this.dictionaries = [];
    }

    // ngOnInit(): void {
    //     this.getDictionaries();
    //     // console.log(this.dictionaries);
    // }

    // getDictionaries() {
    //     // this.dynamicDownloadJson();
    //     console.log(this.adminService.getDictionaries().subscribe((dictionary) => (this.dictionaries = dictionary)));
    // }

    fakeValidateUserData() {
        return of({
            userDate1: 1,
            userData2: 2,
        });
    }

    dynamicDownloadJson() {
        this.adminService.getDictionaries().subscribe((res) => {
            this.dyanmicDownloadByHtmlTag({
                fileName: 'Pitie Seigneur.json',
                text: JSON.stringify(res),
            });
        });
    }

    dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
        const element = document.createElement('a');
        const fileType = arg.fileName.indexOf('.json') > errorIndex ? 'text/json' : 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
        element.setAttribute('download', arg.fileName);

        const event = new MouseEvent('click');
        element.dispatchEvent(event);
    }

    isUntouchable(): boolean {
        return this.adminService.untouchable();
    }

    addBeginnerName() {
        this.adminService.addBeginnerName();
    }

    addExpertName() {
        this.adminService.addExpertName();
    }

    deleteName() {
        if (this.adminService.isBeginnerTab()) {
            this.adminService.deleteBeginnerName();
        } else {
            this.adminService.deleteExpertName();
        }
    }

    updateName() {
        if (this.adminService.editName.value === '') {
            return;
        }
        if (this.adminService.isBeginnerTab()) {
            this.adminService.updateBeginnerName();
        } else {
            this.adminService.updateExpertName();
        }
    }

    onSelect(name: string) {
        this.adminService.onSelect(name);
    }
    resetDataBase() {
        this.bestScoreService.resetDbBestScores().subscribe(
            () => {
                /* Do nothing */
            },
            (error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Ok) {
                    this.snack.open('La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!', 'close');
                } else {
                    this.snack.open(' La base de données a été réinitialisé avec succès!', 'close');
                }
            },
        );
    }
}
