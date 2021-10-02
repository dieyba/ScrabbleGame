import { Injectable } from '@angular/core';
import { ChatDisplayEntry, ChatEntryColor } from '@app/classes/chat-display-entry';
import { ErrorType, ERROR_MESSAGES } from '@app/classes/errors';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';

const ACTIVE_DEBUG_MESSAGE = 'Affichages de débogage activés';
const INACTIVE_DEBUG_MESSAGE = 'Affichages de débogage désactivés';
const SYSTEM_NAME = 'Système';
const DEBUG_PRE_MESSAGE = '[Debug] ';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    entries: ChatDisplayEntry[] = [];
    isActiveDebug: boolean;

    constructor() {
        this.isActiveDebug = false;
    }

    /**
     * @description Add normal text and validated commands.
     *
     * @param isAdversary Bool that indicates if the message comes from adversary
     * @param playerMessage Text or executed command
     */
    addPlayerEntry(isLocalPlayer: boolean, playerName: string, message: string): void {
        const playerMessage = playerName + ' >> ' + message;
        this.entries.push({
            color: isLocalPlayer ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer,
            message: playerMessage,
        });
    }

    addSystemEntry(message: string) {
        const systemMessage = SYSTEM_NAME + ' >> ' + message;
        this.entries.push({
            color: ChatEntryColor.SystemColor,
            message: systemMessage,
        });
    }

    addVirtalPlayerEntry(playername: string, commandInput: string, debugMessages: string[]) {
        this.addPlayerEntry(false, playername, commandInput); // display command entered
        if (this.isActiveDebug) {
            for (const messages of debugMessages) {
                const debugMessage = DEBUG_PRE_MESSAGE + messages;
                this.entries.push({
                    color: ChatEntryColor.SystemColor,
                    message: debugMessage,
                });
            }
        }
    }

    /**
     * @description Error message to be sent by "system". Follow this format:
     * error_type: ErrorType, commandInput: !placerr
     *
     * @param errorMessage Error message to be sent by "system"
     */
    addErrorMessage(errorType: ErrorType, commandInput: string): void {
        const error = ERROR_MESSAGES.get(errorType) as string;
        const errorAndInput = error + ': ' + commandInput;
        this.addSystemEntry(errorAndInput);
    }

    addEndGameMessage(remainingLetters: ScrabbleLetter[], firstPlayer: Player, secondPlayer: Player) {
        const remainingLettersMessage = 'Fin de partie - ' + this.scrabbleLetterstoString(remainingLetters);
        const firstPlayerMessage = firstPlayer.name + ' : ' + this.scrabbleLetterstoString(remainingLetters);
        const secondPlayerMessage = secondPlayer.name + ' : ' + this.scrabbleLetterstoString(remainingLetters);

        this.entries.push({
            color: ChatEntryColor.SystemColor,
            message: remainingLettersMessage,
        });
        this.entries.push({
            color: ChatEntryColor.SystemColor,
            message: firstPlayerMessage,
        });
        this.entries.push({
            color: ChatEntryColor.SystemColor,
            message: secondPlayerMessage,
        });
    }

    createExchangeMessage(isFromLocalPLayer: boolean, userInput: string): string {
        let exchangeMessage = '';
        if (isFromLocalPLayer) {
            exchangeMessage = userInput;
        } else {
            const splitCommand = userInput.split(' ');
            const commandName = splitCommand[0];
            const letters = splitCommand[1];
            const lettersNum = letters.length.toString();
            exchangeMessage = commandName + ' ';
            exchangeMessage = exchangeMessage + lettersNum;
            exchangeMessage = exchangeMessage + ' lettre(s)';
        }
        return exchangeMessage;
    }

    invertDebugState(): ErrorType {
        this.isActiveDebug = !this.isActiveDebug;
        const activationMessage = this.isActiveDebug ? ACTIVE_DEBUG_MESSAGE : INACTIVE_DEBUG_MESSAGE;
        this.addSystemEntry(activationMessage);
        return ErrorType.NoError;
    }

    scrabbleLetterstoString(letters: ScrabbleLetter[]): string {
        let stringLetters: string = '';
        for (let letter of letters) {
            stringLetters += letter.character;
        }
        return stringLetters;
    }
}
