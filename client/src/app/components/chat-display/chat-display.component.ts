<<<<<<< HEAD
import { Component } from '@angular/core';
import { ChatDisplayEntry, AuthorType, ChatEntryColor } from '@app/classes/chat-display-entry';
=======
import { Component, OnInit } from '@angular/core';

const SYSTEM = 'system';
const ADVERSARY = 'adversary';
const PLAYER = 'player';
>>>>>>> f1a67dc5fe8f74b76ab1cc968242d5c4c4713b78

interface ChatEntry {
    author: string;
    message: string;
}
@Component({
    selector: 'app-chat-display',
    templateUrl: './chat-display.component.html',
    styleUrls: ['./chat-display.component.scss'],
})
<<<<<<< HEAD

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
=======
export class ChatDisplayComponent implements OnInit {
    entries: ChatEntry[] = [];

    constructor() {}

    ngOnInit(): void {}

    addPlayerEntry(isAdversary: boolean, playerMessage: string): void {
        this.entries.push({ author: isAdversary ? ADVERSARY : PLAYER, message: 'player message' });
    }

    addError(errorMessage: string): void {
        this.entries.push({ author: SYSTEM, message: 'error message' });
>>>>>>> f1a67dc5fe8f74b76ab1cc968242d5c4c4713b78
    }
}
