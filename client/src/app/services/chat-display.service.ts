import { Injectable } from '@angular/core';
import { ChatDisplayEntry, ChatEntryColor, createDebugEntry, ServerChatEntry } from '@app/classes/chat-display-entry';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { scrabbleLetterstoString } from '@app/classes/utilities';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';

export const ACTIVE_DEBUG_MESSAGE = 'Affichages de débogage activés';
export const INACTIVE_DEBUG_MESSAGE = 'Affichages de débogage désactivés';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    isActiveDebug: boolean;
    entries: ChatDisplayEntry[];
    private readonly server: string;
    private localPlayerName: string;
    private socket?: io.Socket;

    constructor() {
        this.server = 'http://' + window.location.hostname + ':3000';
        this.isActiveDebug = false;
        this.entries = [];

        this.socket = SocketHandler.requestSocket(this.server);
        this.socket.on('addChatEntry', (chatEntry: ServerChatEntry) => {
            const chatEntryColor = chatEntry.senderName === this.localPlayerName ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer;
            this.addEntry({ color: chatEntryColor, message: chatEntry.message });
        });
        this.socket.on('addSystemChatEntry', (systemMessage: string) => {
            this.addEntry({ color: ChatEntryColor.SystemColor, message: systemMessage });
        });
    }

    initialize(localPlayerName: string): void {
        this.entries = [];
        this.isActiveDebug = false;
        this.localPlayerName = localPlayerName;
    }

    sendMessageToServer(messageFromLocalPlayer: string, messageToRemotePlayer?: string) {
        if (this.socket) {
            if (messageToRemotePlayer) {
                this.socket.emit('sendChatEntry', messageFromLocalPlayer, messageToRemotePlayer);
            } else {
                this.socket.emit('sendChatEntry', messageFromLocalPlayer);
            }
        }
    }
    sendSystemMessageToServer(message: string) {
        if (this.socket) {
            this.socket.emit('sendSystemChatEntry', message);
        }
    }

    addEntry(entry: ChatDisplayEntry): void {
        this.entries.push(entry);
    }

    addVirtalPlayerEntry(commandInput: string, debugMessages?: string[]) {
        this.addEntry({ color: ChatEntryColor.RemotePlayer, message: commandInput }); // display command entered
        if (this.isActiveDebug && debugMessages) {
            for (const message of debugMessages) {
                this.addEntry(createDebugEntry(message));
            }
        }
    }

    createEndGameMessages(remainingLetters: ScrabbleLetter[], firstPlayer: Player, secondPlayer: Player): ChatDisplayEntry[] {
        const remainingLettersMessage = 'Fin de partie - ' + scrabbleLetterstoString(remainingLetters);
        const firstPlayerMessage = firstPlayer.name + ' : ' + scrabbleLetterstoString(firstPlayer.letters);
        const secondPlayerMessage = secondPlayer.name + ' : ' + scrabbleLetterstoString(secondPlayer.letters);
        const endGameMessage: ChatDisplayEntry[] = [];
        endGameMessage.push({
            color: ChatEntryColor.SystemColor,
            message: remainingLettersMessage,
        });
        endGameMessage.push({
            color: ChatEntryColor.SystemColor,
            message: firstPlayerMessage,
        });
        endGameMessage.push({
            color: ChatEntryColor.SystemColor,
            message: secondPlayerMessage,
        });
        return endGameMessage;
    }

    invertDebugState(): string {
        this.isActiveDebug = !this.isActiveDebug;
        return this.isActiveDebug ? ACTIVE_DEBUG_MESSAGE : INACTIVE_DEBUG_MESSAGE;
    }
}
