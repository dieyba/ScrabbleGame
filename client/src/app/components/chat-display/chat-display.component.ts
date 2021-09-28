import { Component } from '@angular/core';
import { ChatDisplayEntry } from '@app/classes/chat-display-entry';
import { ChatDisplayService } from '@app/services/chat-display.service';

@Component({
    selector: 'app-chat-display',
    templateUrl: './chat-display.component.html',
    styleUrls: ['./chat-display.component.scss'],
})
export class ChatDisplayComponent {
    entries: ChatDisplayEntry[] = [];

    constructor(private chatDisplayService: ChatDisplayService) {
        this.entries = this.chatDisplayService.entries;
        this.chatDisplayService.addNewEntryCallback(this.scrollDown);
    }

    scrollDown() {
        const chatBox: HTMLElement = document.getElementById('chat-display-box') as HTMLElement;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
