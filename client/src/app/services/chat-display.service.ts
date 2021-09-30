import { Injectable } from '@angular/core';
import { ChatDisplayEntry, ChatEntryColor } from '../classes/chat-display-entry';
import { ErrorType, ERROR_MESSAGES } from '../classes/errors';

const ACTIVE_DEBUG_MESSAGE = "Affichages de débogage activés"
const INACTIVE_DEBUG_MESSAGE = "Affichages de débogage désactivés"
const SYSTEM_NAME = "Système";
const DEBUG_PRE_MESSAGE = "[Debug] ";

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
    addPlayerEntry(isLocalPlayer: boolean, playerName:string, message: string): void {
        const playerMessage = playerName.concat(" >> ").concat(message);
        this.entries.push({
            color: isLocalPlayer ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer,
            message: playerMessage,
        });
    }

    addSystemEntry(message:string){
        const systemMessage = SYSTEM_NAME.concat(" >> ").concat(message);
        this.entries.push({
            color:ChatEntryColor.SystemColor,
            message:systemMessage,
        });
    }

    addVirtalPlayerEntry(playername:string,commandInput:string, debugMessages:string[]){
        this.addPlayerEntry(false, playername,commandInput); //display command entered
        this.addDebugMessages(debugMessages);
    }

    private addDebugMessages(debugMessages:string[]){
        if(this.isActiveDebug){
            for(const i in debugMessages){
                const debugMessage = DEBUG_PRE_MESSAGE.concat(debugMessages[i]);
                this.entries.push({
                    color:ChatEntryColor.SystemColor,
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
    addErrorMessage(errorType: ErrorType, commandInput:string): void {
        const error = ERROR_MESSAGES.get(errorType) as string;
        const errorAndInput = error.concat(": ").concat(commandInput);
        this.addSystemEntry(errorAndInput);
    }

    createExchangeMessage(isFromLocalPLayer:boolean, userInput:string): string{
        let exchangeMessage:string = "";
        if(isFromLocalPLayer) {
            exchangeMessage = userInput;
        }
        else {
            const splitCommand = userInput.split(" ");
            const commandName = splitCommand[0];
            const letters = splitCommand[1];
            const lettersNum = letters.length.toString();
            exchangeMessage = commandName.concat(" ");
            exchangeMessage = exchangeMessage.concat(lettersNum);
            exchangeMessage = exchangeMessage.concat(" lettre(s)");
        }
        return exchangeMessage;
    }

    
    invertDebugState():ErrorType{
        this.isActiveDebug = !this.isActiveDebug;
        const activationMessage = this.isActiveDebug? ACTIVE_DEBUG_MESSAGE : INACTIVE_DEBUG_MESSAGE;
        this.addSystemEntry(activationMessage);
        return ErrorType.NoError;
    }

}
