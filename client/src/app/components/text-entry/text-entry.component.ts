import { Component } from '@angular/core';
import { TextEntryService } from '@app/services/text-entry.service/text-entry.service';
@Component({
    selector: 'app-text-entry',
    templateUrl: './text-entry.component.html',
    styleUrls: ['./text-entry.component.scss'],
})
export class TextEntryComponent {
    inputText: string;

    constructor(private textEntryService: TextEntryService) {
        this.inputText = '';
    }

    onKeyUpEnter() {
        this.textEntryService.handleInput(this.inputText);
        this.inputText = '';
    }
}
