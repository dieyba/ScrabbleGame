import { Injectable } from '@angular/core';
import { AuthorType, ChatDisplayEntry, ChatEntryColor } from '../classes/chat-display-entry';
import { ErrorType, ERROR_MESSAGES } from '../classes/errors';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    entries: ChatDisplayEntry[] = [];

    /**
     * @description Add normal text and validated commands.
     *
     * @param isAdversary Bool that indicates if the message comes from adversary
     * @param playerMessage Text or executed command
     */
    addPlayerEntry(isLocalPlayer: boolean, username:string, playerMessage: string): void {
        playerMessage = username.concat(" >> ").concat(playerMessage);
        this.entries.push({
            authorType: isLocalPlayer ? AuthorType.LocalPlayer : AuthorType.RemotePlayer,
            color: isLocalPlayer ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer,
            message: playerMessage,
        });
    }

    /**
     * @description Error message to be sent by "system". Follow this format:
     * ERROR_TYPE: INVALID_COMMAND
     * Example: Commande invalide: !placerr
     *
     * @param errorMessage Error message to be sent by "system"
     */
    addErrorMessage(errorType: ErrorType, commandInput:string): void {
        this.entries.push({
            authorType: AuthorType.System,
            color: ChatEntryColor.SystemColor,
            message: this.createErrorMessage(errorType, commandInput),
        });
    }

    createErrorMessage(errorType: ErrorType, commandInput:string): string{
        const error = ERROR_MESSAGES.get(errorType) as string;
        const inputAndError = commandInput.concat(" : ").concat(error);
        return inputAndError;
    }


    createExchangeMessage(isLocalPLayer:boolean, userInput:string): string{
        let exchangeMessage:string = "";
        if(isLocalPLayer) {
            exchangeMessage = userInput;
        }
        else {
            const letters = userInput.split(" ")[1];
            const lettersNum = letters.length.toString();
            exchangeMessage = lettersNum.concat(" letter(s) were exchanged");
        }
        return exchangeMessage;
    }
}
