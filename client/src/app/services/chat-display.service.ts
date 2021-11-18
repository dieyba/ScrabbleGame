import { Injectable } from '@angular/core';
import { ChatDisplayEntry, ChatEntryColor, createDebugEntry, ServerChatEntry } from '@app/classes/chat-display-entry';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { scrabbleLettersToString } from '@app/classes/utilities';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

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
    private socket: io.Socket;

    constructor() {
        this.server = environment.socketUrl;
        this.isActiveDebug = false;
        this.entries = [];

        this.socket = SocketHandler.requestSocket(this.server);
        this.socketOnConnect();
    }
    socketOnConnect() {
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
        if (messageToRemotePlayer) {
            this.socket.emit('sendChatEntry', messageFromLocalPlayer, messageToRemotePlayer);
        } else {
            this.socket.emit('sendChatEntry', messageFromLocalPlayer);
        }
    }
    sendSystemMessageToServer(message: string) {
        this.socket.emit('sendSystemChatEntry', message);
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

    displayEndGameMessage(remainingLetters: ScrabbleLetter[], firstPlayer: Player, secondPlayer: Player) {
        const remainingLettersMessage = 'Fin de partie - ' + scrabbleLettersToString(remainingLetters);
        const firstPlayerMessage = firstPlayer.name + ' : ' + scrabbleLettersToString(firstPlayer.letters);
        const secondPlayerMessage = secondPlayer.name + ' : ' + scrabbleLettersToString(secondPlayer.letters);
        const endGameMessages: ChatDisplayEntry[] = [];
        endGameMessages.push({
            color: ChatEntryColor.SystemColor,
            message: remainingLettersMessage,
        });
        endGameMessages.push({
            color: ChatEntryColor.SystemColor,
            message: firstPlayerMessage,
        });
        endGameMessages.push({
            color: ChatEntryColor.SystemColor,
            message: secondPlayerMessage,
        });

        endGameMessages.forEach((message) => {
            this.addEntry(message);
        });
    }

    invertDebugState(): string {
        this.isActiveDebug = !this.isActiveDebug;
        return this.isActiveDebug ? ACTIVE_DEBUG_MESSAGE : INACTIVE_DEBUG_MESSAGE;
    }
}
