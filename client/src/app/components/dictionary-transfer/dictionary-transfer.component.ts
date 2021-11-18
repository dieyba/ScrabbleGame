import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-dictionary-transfer',
    templateUrl: './dictionary-transfer.component.html',
    styleUrls: ['./dictionary-transfer.component.scss'],
})
export class DictionaryTransferComponent implements OnInit {
    @ViewChild('inputFile', { static: false }) private inputFile!: ElementRef<HTMLInputElement>;
    defaultDictionary = 'test';
    dictionaryList = ['test1', 'test2'];
    constructor() {
        this.defaultDictionary = this.dictionaryList[0];
    }

    ngOnInit(): void {}

    onUpload() {
        console.log('Uploading');
        if (this.inputFile !== undefined && this.inputFile.nativeElement.files !== null) {
            console.log(this.inputFile.nativeElement.files[0]);
        }
    }
}
