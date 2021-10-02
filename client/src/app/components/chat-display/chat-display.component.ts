import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatDisplayEntry } from '@app/classes/chat-display-entry';
import { ChatDisplayService } from '@app/services/chat-display.service';

@Component({
    selector: 'app-chat-display',
    templateUrl: './chat-display.component.html',
    styleUrls: ['./chat-display.component.scss'],
})
export class ChatDisplayComponent {
    @ViewChild('chatDisplayBox') chatDisplayBox!: ElementRef;
    entries: ChatDisplayEntry[] = [];
    lastEntry: ChatDisplayEntry;

    constructor(private chatDisplayService: ChatDisplayService) {
        this.entries = this.chatDisplayService.entries;
    }

    updateScroll(entry: ChatDisplayEntry) {
        if (this.isNewEntry(entry)) {
            this.lastEntry = entry;
            this.scrollDown();
        }
    }

    scrollDown() {
        this.chatDisplayBox.nativeElement.scrollTop = this.chatDisplayBox.nativeElement.scrollHeight;
    }

    isNewEntry(entry: ChatDisplayEntry) {
        if (!this.lastEntry || entry !== this.lastEntry) {
            return true;
        }
        return false;
    }
}
