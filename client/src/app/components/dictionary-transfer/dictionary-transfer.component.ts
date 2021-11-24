import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DictionaryInterface } from '@app/services/virtual-player-name-manager';
import { BASE_URL, DictionaryService } from '@app/services/dictionary.service';

@Component({
    selector: 'app-dictionary-transfer',
    templateUrl: './dictionary-transfer.component.html',
    styleUrls: ['./dictionary-transfer.component.scss'],
})
export class DictionaryTransferComponent implements AfterViewInit {
    @ViewChild('inputFile', { static: false }) private inputFile!: ElementRef<HTMLInputElement>;
    selectedDictionary: string;
    dictionaryList: string[] = [];

    constructor(private dictionaryService: DictionaryService) {}

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
    }

    onDownload() {
        this.dictionaryService.getDictionary(BASE_URL, this.selectedDictionary).subscribe(this.download, (error: HttpErrorResponse) => {
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
            this.dictionaryList.push(dictionary.title);
        }
        this.selectedDictionary = this.dictionaryList[0];
    }
}
