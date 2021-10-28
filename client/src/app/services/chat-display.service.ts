import { Injectable } from '@angular/core';
import { ChatDisplayEntry, ChatEntryColor, createDebugEntry, createPlayerEntry, ServerChatEntry } from '@app/classes/chat-display-entry';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { scrabbleLetterstoString } from '@app/classes/utilities';
import { SocketHandler } from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
// import { GameService } from './game.service';
// import { MultiPlayerGameService } from './multi-player-game.service';

const ACTIVE_DEBUG_MESSAGE = 'Affichages de débogage activés';
const INACTIVE_DEBUG_MESSAGE = 'Affichages de débogage désactivés';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    isActiveDebug: boolean;
    entries: ChatDisplayEntry[];
    private readonly server = 'http://' + window.location.hostname + ':3000';
    private localPlayerName: string;
    private socket?: io.Socket;

    constructor(/* private gameService: GameService*/) {
        this.isActiveDebug = false;
        this.entries = [];
        this.localPlayerName = '';

        this.socket = SocketHandler.requestSocket(this.server);
        this.socket.on('addChatEntry', (chatEntry: ServerChatEntry) => {
            const isLocalPlayer = chatEntry.senderName === this.localPlayerName ? false : true;
            this.addEntry(createPlayerEntry(isLocalPlayer, chatEntry.senderName, chatEntry.message));
        });
        // TODO: get if the game is multiplayer and only initiate socket if it is
        // if(gameService.currentGameService instanceof MultiPlayerGameService){
        //     this.initializeSocket();
        // }
    }

    // initializeSocket(){
    //     this.socket = SocketHandler.requestSocket(this.server);
    //     this.socket.on('addChatEntry', (chatEntry: ServerChatEntry) => {
    //         const isLocalPlayer = chatEntry.senderName === this.localPlayerName ? false : true;
    //         this.addEntry(createPlayerEntry(isLocalPlayer, chatEntry.senderName, chatEntry.message));
    //     });
    // };

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

    addEntry(entry: ChatDisplayEntry): void {
        this.entries.push(entry);
    }

    addVirtalPlayerEntry(playername: string, commandInput: string, debugMessages?: string[]) {
        const isFromLocalPlayer = playername === this.localPlayerName;
        this.addEntry(createPlayerEntry(isFromLocalPlayer, playername, commandInput)); // display command entered
        if (this.isActiveDebug && debugMessages) {
            for (const message of debugMessages) {
                this.addEntry(createDebugEntry(message));
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
}
