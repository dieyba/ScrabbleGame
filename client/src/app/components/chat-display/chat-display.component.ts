import { Component } from '@angular/core';
import { ChatDisplayEntry, AuthorType, ChatEntryColor } from '@app/classes/chat-display-entry';


@Component({
    selector: 'app-chat-display',
    templateUrl: './chat-display.component.html',
    styleUrls: ['./chat-display.component.scss'],
})

export class ChatDisplayComponent {
    entries: ChatDisplayEntry[] = [];
    authorType = AuthorType;

    // constructor() {
    //     this.entries.push({ authorType: AuthorType.System, color: ChatEntryColor.SystemColor, message: "syst msg" });
    //     this.entries.push({ authorType: AuthorType.Player, color: ChatEntryColor.PlayerColor, message: "player msg" });
    //     this.entries.push({ authorType: AuthorType.Adversary, color: ChatEntryColor.AdversaryColor, message: "ennemy msg" });
    // }


    // TODO: calculer valeur de isAdversary selon l'identite de l'auteur du message
    addPlayerEntry(isAdversary: boolean, playerMessage: string): void {
        this.entries.push({ 
            authorType: isAdversary ? AuthorType.Adversary : AuthorType.Player,
            color: isAdversary ? ChatEntryColor.AdversaryColor: ChatEntryColor.PlayerColor,
            message: playerMessage});
    }

    addErrorMessage(errorMessage: string): void {
        this.entries.push({ authorType: AuthorType.System, color: ChatEntryColor.SystemColor, message: errorMessage });
    }
}
