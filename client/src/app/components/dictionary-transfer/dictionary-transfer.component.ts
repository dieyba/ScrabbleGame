/* eslint-disable no-underscore-dangle */
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { BASE_URL, DictionaryService } from '@app/services/dictionary.service/dictionary.service';
import { Subscription } from 'rxjs';

export enum ErrorCaseDictionaryTransfer {
    TitleAlreadyThere = 'Un dictionnaire de la base de donnée possède déjà ce titre.',
    TitleOrDescriptionInvalid = 'Le titre ou la description est invalide.',
    DictionaryDeleted = 'Ce dictionnaire a déjà été supprimé',
    DatabaseServerCrash = 'La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard.',
    Untouchable = 'Vous ne pouvez pas modifier ou supprimer ce dictionnaire',
}

const TITLE_MAX_LENGTH = 20;
const TITLE_MIN_LENGTH = 3;
const DESCRIPTION_MAX_LENGTH = 50;
const DESCRIPTION_MIN_LENGTH = 10;

@Component({
    selector: 'app-dictionary-transfer',
    templateUrl: './dictionary-transfer.component.html',
    styleUrls: ['./dictionary-transfer.component.scss'],
})
export class DictionaryTransferComponent implements AfterViewInit, OnDestroy {
    @ViewChild('inputFile', { static: false }) private inputFile!: ElementRef<HTMLInputElement>;
    selectedDictionary: DictionaryInterface;
    dictionaryList: DictionaryInterface[];
    lastUploadedDictionary: DictionaryInterface;
    editTitle: FormControl;
    editDescription: FormControl;
    dictionarySubscription: Subscription;

    constructor(private dictionaryService: DictionaryService, private snack: MatSnackBar) {
        this.selectedDictionary = { _id: '', title: '', description: '', words: [] };
        this.dictionaryList = [];
        this.editTitle = new FormControl('', [
            Validators.pattern('[a-zA-ZÉé ]*'),
            Validators.maxLength(TITLE_MAX_LENGTH),
            Validators.minLength(TITLE_MIN_LENGTH),
        ]);
        this.editDescription = new FormControl('', [Validators.maxLength(DESCRIPTION_MAX_LENGTH), Validators.minLength(DESCRIPTION_MIN_LENGTH)]);
    }

    ngAfterViewInit(): void {
        this.dictionarySubscription = this.dictionaryService.getDictionaries(BASE_URL).subscribe(
            (dictionaries: DictionaryInterface[]) => {
                this.updateDictionariesTitle(dictionaries);
            },
            (error: HttpErrorResponse) => {
                this.dictionaryService.handleErrorSnackBar(error);
            },
        );
    }
    ngOnDestroy() {
        this.dictionarySubscription.unsubscribe();
    }

    onUpload() {
        if (!this.inputFileExist(this.inputFile)) {
            return;
        }

        if (!this.fileIsJSON((this.inputFile.nativeElement.files as FileList)[0].name)) {
            return;
        }

        // Uploading after reading
        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.upload(fileReader.result?.toString() as string);
        };
        fileReader.readAsText((this.inputFile.nativeElement.files as FileList)[0]);
    }

    upload(dictionary: string) {
        this.dictionarySubscription = this.dictionaryService.uploadFromString(dictionary).subscribe(
            (dictionaryDescription) => {
                this.lastUploadedDictionary = dictionaryDescription;
                this.snack.open('Téléversement réussi!', 'Fermer');
            },
            (error: HttpErrorResponse) => {
                this.dictionaryService.handleErrorSnackBar(error);
            },
        );
    }

    onDictionarySelection(pos: number) {
        this.selectedDictionary = this.dictionaryList[pos];
        this.editTitle.setValue(this.selectedDictionary.title);
        this.editDescription.setValue(this.selectedDictionary.description);
    }

    onDownload() {
        this.dictionarySubscription = this.dictionaryService.getDictionary(BASE_URL, this.selectedDictionary.title).subscribe(this.download, (error: HttpErrorResponse) => {
            this.dictionaryService.handleErrorSnackBar(error);
        });
    }

    download(dictionary: DictionaryInterface) {
        const file = new Blob([JSON.stringify(dictionary, ['title', 'description', 'words'], '\t')], { type: '.json' });
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = dictionary.title + '.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    updateDictionariesTitle(dictionaries: DictionaryInterface[]) {
        this.dictionaryList = [];
        for (const dictionary of dictionaries) {
            const tempDictionary = { _id: '', title: '', description: '', words: [] } as DictionaryInterface;
            tempDictionary._id = dictionary._id;
            tempDictionary.title = dictionary.title;
            tempDictionary.description = dictionary.description;
            this.dictionaryList.push(tempDictionary);
        }
        this.selectedDictionary = this.dictionaryList[0];
    }

    updateTitleAndDescription(title: string, description: string) {
        const index = this.dictionaryList.indexOf(this.selectedDictionary);
        if (index < 1) {
            this.snack.open(ErrorCaseDictionaryTransfer.Untouchable, 'Fermer');
            return;
        }

        if (!this.editTitle.valid || !this.editDescription.valid) {
            this.snack.open(ErrorCaseDictionaryTransfer.TitleOrDescriptionInvalid, 'Fermer');
            return;
        }

        this.dictionarySubscription = this.dictionaryService.update(BASE_URL, this.selectedDictionary.title, this.selectedDictionary._id, title, description).subscribe(
            (dictionary) => {
                this.dictionaryList[index].title = dictionary.title;
                this.dictionaryList[index].description = dictionary.description;
            },
            (error: HttpErrorResponse) => {
                if (error.error === 'Ce titre existe déjà') {
                    this.snack.open(ErrorCaseDictionaryTransfer.TitleAlreadyThere, 'Fermer');
                }
            },
        );
    }

    deleteDictionary(dictionaryToDelete: DictionaryInterface) {
        const index = this.dictionaryList.indexOf(this.selectedDictionary);
        if (index < 1) {
            this.snack.open(ErrorCaseDictionaryTransfer.Untouchable, 'Fermer');
            return;
        }

        this.dictionarySubscription = this.dictionaryService.delete(dictionaryToDelete._id).subscribe(
            () => {
                this.dictionaryList.splice(index, 1);
            },
            (error: HttpErrorResponse) => {
                if (error.statusText === 'Unknown Error') {
                    this.snack.open(ErrorCaseDictionaryTransfer.DatabaseServerCrash, 'Fermer');
                    return;
                }
                this.snack.open(ErrorCaseDictionaryTransfer.DictionaryDeleted, 'Fermer');
            },
        );
    }

    inputFileExist(inputFile: ElementRef<HTMLInputElement>): boolean {
        const isElementDefined = inputFile !== undefined;
        const isFileListDefined = inputFile.nativeElement.files !== null;
        let isFileDefined = false;
        if (inputFile.nativeElement.files !== null) {
            isFileDefined = inputFile.nativeElement.files[0] !== undefined;
        }
        return isElementDefined && isFileListDefined && isFileDefined;
    }

    fileIsJSON(fileName: string): boolean {
        const fileNameExtension = fileName.split('.', 2)[1];
        let isJSON = false;

        if (fileNameExtension === 'json') {
            isJSON = true;
        } else {
            isJSON = false;
            this.snack.open('Le fichier doit être un «.json»', 'Fermer');
        }
        return isJSON;
    }
}
