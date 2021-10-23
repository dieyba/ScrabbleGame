import { Injectable } from '@angular/core';
import { ChatDisplayEntry, ChatEntryColor, createPlayerEntry, createDebugEntry } from '@app/classes/chat-display-entry';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { scrabbleLetterstoString } from '@app/classes/utilities';

const ACTIVE_DEBUG_MESSAGE = 'Affichages de débogage activés';
const INACTIVE_DEBUG_MESSAGE = 'Affichages de débogage désactivés';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    entries: ChatDisplayEntry[];
    isActiveDebug: boolean;
    private localPlayerName: string;

    constructor() {
        this.entries = [];
        this.isActiveDebug = false;
        this.localPlayerName = '';
    }

    addEntry(entry:ChatDisplayEntry):void{
        this.entries.push(entry);
    }

    addVirtalPlayerEntry(playername: string, commandInput: string, debugMessages?: string[]) {
        const isFromLocalPlayer = playername === this.localPlayerName;
        this.addEntry( createPlayerEntry(isFromLocalPlayer, playername, commandInput) ); // display command entered
        if (this.isActiveDebug && debugMessages) {
            for (const message of debugMessages) {
                this.addEntry( createDebugEntry(message) );
            }
        }
    }

    addEndGameMessage(remainingLetters: ScrabbleLetter[], firstPlayer: Player, secondPlayer: Player) {
        const remainingLettersMessage = 'Fin de partie - ' + scrabbleLetterstoString(remainingLetters);
        const firstPlayerMessage = firstPlayer.name + ' : ' + scrabbleLetterstoString(firstPlayer.letters);
        const secondPlayerMessage = secondPlayer.name + ' : ' + scrabbleLetterstoString(secondPlayer.letters);

        this.addEntry({
            color: ChatEntryColor.SystemColor,
            message: remainingLettersMessage,
        });
        this.addEntry({
            color: ChatEntryColor.SystemColor,
            message: firstPlayerMessage,
        });
        this.addEntry({
            color: ChatEntryColor.SystemColor,
            message: secondPlayerMessage,
        });
    }

    invertDebugState(): string {
        this.isActiveDebug = !this.isActiveDebug;
        return this.isActiveDebug ? ACTIVE_DEBUG_MESSAGE : INACTIVE_DEBUG_MESSAGE;
    }

    initialize(localPlayerName:string): void {
        this.entries = [];
        this.isActiveDebug = false;
        this.localPlayerName = localPlayerName;
    }
}
