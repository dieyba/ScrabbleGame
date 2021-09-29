import { Component } from '@angular/core';
import { TextEntryService } from '@app/services/text-entry.service';
@Component({
    selector: 'app-text-entry',
    templateUrl: './text-entry.component.html',
    styleUrls: ['./text-entry.component.scss'],
})
export class TextEntryComponent {
    inputText = 'Test';

    constructor(private textEntryService: TextEntryService) {}

    onKeyUpEnter() {
        //onKeyUp events are always from the local player.
        this.textEntryService.handleInput(this.inputText, true); 
        this.inputText = '';
    }
}
