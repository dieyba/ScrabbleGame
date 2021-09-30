import { Injectable } from '@angular/core';
import { ChatDisplayEntry, ChatEntryColor } from '../classes/chat-display-entry';
import { ErrorType, ERROR_MESSAGES } from '../classes/errors';

const ACTIVE_DEBUG_MESSAGE = "Affichages de débogage activés"
const INACTIVE_DEBUG_MESSAGE = "Affichages de débogage désactivés"
const SYSTEM_NAME = "System";

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    entries: ChatDisplayEntry[] = [];
    isActiveDebug: boolean;

    constructor(){
        this.isActiveDebug = false;
    }
    

    /**
     * @description Add normal text and validated commands.
     *
     * @param isAdversary Bool that indicates if the message comes from adversary
     * @param playerMessage Text or executed command
     */
    addPlayerEntry(isLocalPlayer: boolean, playerName:string, playerMessage: string): void {
        playerMessage = playerName.concat(" >> ").concat(playerMessage);
        this.entries.push({
            color: isLocalPlayer ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer,
            message: playerMessage,
        });
    }

    addSystemEntry(message:string){
        message = SYSTEM_NAME.concat(" >> ").concat(message);
        this.entries.push({
            color:ChatEntryColor.SystemColor,
            message:message,
        });
    }

    // TODO:change string for some fixed specific messages?
    addVirtalPlayerEntry(playername:string,commandInput:string, debugMessage:string){
        this.addPlayerEntry(false, playername,commandInput);
        this.addSystemEntry(debugMessage);
    }

    /**
     * @description Error message to be sent by "system". Follow this format:
     * error_type: ErrorType, commandInput: !placerr
     *
     * @param errorMessage Error message to be sent by "system"
     */
    addErrorMessage(errorType: ErrorType, commandInput:string): void {
        this.addSystemEntry(this.createErrorMessage(errorType, commandInput));
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
            const splitCommand = userInput.split(" ");
            const commandName = splitCommand[0];
            const letters = splitCommand[1];
            const lettersNum = letters.length.toString();
            exchangeMessage = commandName.concat(" ");
            exchangeMessage = exchangeMessage.concat(lettersNum);
            exchangeMessage = exchangeMessage.concat(" letter(s)");
        }
        return exchangeMessage;
    }

    
    invertDebugState():ErrorType{
        this.isActiveDebug != this.isActiveDebug;
        const activationMessage = this.isActiveDebug? ACTIVE_DEBUG_MESSAGE : INACTIVE_DEBUG_MESSAGE;
        this.addSystemEntry(activationMessage);
        return ErrorType.NoError;
    }

}
