import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DictionaryInterface } from '@app/services/virtual-player-name.service';
import { BASE_URL, DictionaryService } from '@app/services/dictionary.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-dictionary-transfer',
    templateUrl: './dictionary-transfer.component.html',
    styleUrls: ['./dictionary-transfer.component.scss'],
})
export class DictionaryTransferComponent implements AfterViewInit {
    @ViewChild('inputFile', { static: false }) private inputFile!: ElementRef<HTMLInputElement>;
    selectedDictionary: DictionaryInterface;
    dictionaryList: DictionaryInterface[];

    editTitle: FormControl;
    editDescription: FormControl;

    constructor(private dictionaryService: DictionaryService) {
        this.selectedDictionary = { _id: '', title: 'aucun dictionnaire sélectionné', description: '', words: ['']};
        this.dictionaryList = [];
        this.editTitle = new FormControl('', [Validators.pattern('[a-zA-ZÉé ]*'), Validators.maxLength(20), Validators.minLength(3)]);
        this.editDescription = new FormControl('', [Validators.maxLength(50), Validators.minLength(10)]);
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
        if (this.inputFile !== undefined && this.inputFile.nativeElement.files !== null) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.upload(fileReader.result?.toString() as string);
            };
            fileReader.readAsText(this.inputFile.nativeElement.files[0]);
        }
    }

    upload(dictionary: string) {
        this.dictionaryService.uploadFromString(dictionary).subscribe(
            () => {
                // TODO tell user the dictionary is successfully uploaded (snackbar?)
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
        this.dictionaryService.getDictionary(BASE_URL, this.selectedDictionary.title).subscribe(this.download, (error: HttpErrorResponse) => {
            this.dictionaryService.handleErrorSnackBar(error);
        });
    }

    download(dictionary: DictionaryInterface) {
        const file = new Blob([JSON.stringify(dictionary, ['idDict', 'title', 'description', 'words'], '\t')], { type: '.json' });
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
            let tempDictionary = { _id: '', title: '', description: '', words: ['']} as DictionaryInterface;
            tempDictionary._id = dictionary._id;
            tempDictionary.title = dictionary.title;
            tempDictionary.description = dictionary.description;
            this.dictionaryList.push(tempDictionary);
        }
        this.selectedDictionary = this.dictionaryList[0];
    }

    updateTitleAndDescription(title: string, description: string) {
        if (!this.editTitle.valid || !this.editDescription) {
            // snack bar
            return;
        }
        
        this.dictionaryService.update(BASE_URL, this.selectedDictionary.title, this.selectedDictionary._id, title, description).subscribe(
            (dictionary) => {
                const index = this.dictionaryList.indexOf(this.selectedDictionary);
                this.dictionaryList[index] = dictionary;
            },
            (error: HttpErrorResponse) => {
                // snack bar
            }
        );
    }
}
