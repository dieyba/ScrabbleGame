import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryInterface } from '@app/classes/dictionary';
import { BASE_URL, DictionaryService } from '@app/services/dictionary.service';
// import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-dictionary-transfer',
    templateUrl: './dictionary-transfer.component.html',
    styleUrls: ['./dictionary-transfer.component.scss'],
})
export class DictionaryTransferComponent implements AfterViewInit {
    @ViewChild('inputFile', { static: false }) private inputFile!: ElementRef<HTMLInputElement>;
    selectedDictionary: string;
    dictionaryList: string[];
    lastUploadedDictionary: DictionaryInterface;

    constructor(private dictionaryService: DictionaryService, private snack: MatSnackBar) {
        this.selectedDictionary = '';
        this.dictionaryList = [];
        // this.editTitle = new FormControl('', [Validators.pattern('[a-zA-ZÉé ]*'), Validators.maxLength(20), Validators.minLength(3)]);
        // this.editDescription = new FormControl('', [Validators.maxLength(50), Validators.minLength(10)]);
    }

    ngAfterViewInit(): void {
        this.dictionaryService.getDictionaries(BASE_URL).subscribe(
            (dictionaries: DictionaryInterface[]) => {
                this.updateDictionariesTitle(dictionaries);
            },
            (error: HttpErrorResponse) => {
                this.dictionaryService.handleErrorSnackBar(error);
            },
        );
    }

    onUpload() {
        if (!this.inputFileExist(this.inputFile)) {
            return;
        }

        if (!this.fileIsJSON((this.inputFile.nativeElement.files as FileList)[0].name)) {
            return;
        }

        // Updloading after reading
        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.upload(fileReader.result?.toString() as string);
        };
        fileReader.readAsText((this.inputFile.nativeElement.files as FileList)[0]);
    }

    upload(dictionary: string) {
        this.dictionaryService.uploadFromString(dictionary).subscribe(
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
        // this.editTitle.setValue(this.selectedDictionary.title);
        // this.editDescription.setValue(this.selectedDictionary.description);
    }

    onDownload() {
        this.dictionaryService.getDictionary(BASE_URL, this.selectedDictionary).subscribe(this.download, (error: HttpErrorResponse) => {
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
            // let tempDictionary = { _id: '', title: '', description: '', words: ['']} as DictionaryInterface;
            // tempDictionary._id = dictionary._id;
            // tempDictionary.title = dictionary.title;
            // tempDictionary.description = dictionary.description;
            // this.dictionaryList.push(tempDictionary);
            this.dictionaryList.push(dictionary.title);
        }
        this.selectedDictionary = this.dictionaryList[0];
    }

    // updateTitleAndDescription(title: string, description: string) {
    //     if (!this.editTitle.valid || !this.editDescription) {
    //         // snack bar
    //         return;
    //     }

    //     this.dictionaryService.update(BASE_URL, this.selectedDictionary.title, this.selectedDictionary._id, title, description).subscribe(
    //         (dictionary) => {
    //             const index = this.dictionaryList.indexOf(this.selectedDictionary);
    //             this.dictionaryList[index] = dictionary;
    //         },
    //         (error: HttpErrorResponse) => {
    //             // snack bar
    //         }
    //     );
    // }

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
            this.snack.open('Le fichier doit être un «.json»', 'fermer');
        }
        return isJSON;
    }
}
