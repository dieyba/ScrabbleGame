import { Injectable } from '@angular/core';
import { ChatDisplayService } from './chat-display.service';
import { ErrorType } from '@app/classes/errors';
import { GameService, Command, DebugCmd } from '../classes/commands';
// import { Vec2 } from '../classes/vec2';

// TODO: voir leurs consignes pour les constantes
const DEBUG_CMD = 'debug';
const EXCHANGE_CMD = 'échanger';
const PASS_CMD = 'passer';
const PLACE_CMD = 'placer';
const COMMAND_LIST = [DEBUG_CMD,EXCHANGE_CMD,PASS_CMD,PLACE_CMD];

const SPACE_CHAR = ' ';
const A_CHAR = 'a'.charCodeAt(0);
const Z_CHAR = 'z'.charCodeAt(0);
// const HORIZONTAL = 'h';
// const VERTICAL = 'v';
// const ROW_INDEX = ;
// const COL_INDEX = ;
const ASTERISK_CHAR = '*'.charCodeAt(0);

interface CommandInput{
    name:string;
    params:string[];
};



@Injectable({
    providedIn: 'root',
})
export class TextEntryService {
    commandNames : Set<string>;
    fakeGameService : GameService; 

    constructor(private chatDisplayService: ChatDisplayService) {
        this.fakeGameService = new GameService;
        this.commandNames = new Set;
        for(let i in COMMAND_LIST){
            this.commandNames.add(COMMAND_LIST[i].toString());
        }
    }

    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(userInput: string) {   
        // TODO: game service is the one checking if the player can play the command. When multiplayer, check who sends message
        let isAdversaryMessage = false;
        // TODO: trim beginning and end?
        userInput = this.trimStartSpaces(userInput);       
        if(!this.isEmpty(userInput)){
            if(userInput.startsWith("!")) {
                let command = this.createCommande(this.splitInput(userInput.substring(1)));
                if(command){
                    command.execute()?
                    this.chatDisplayService.addPlayerEntry(isAdversaryMessage, userInput):
                    this.chatDisplayService.addErrorMessage(ErrorType.ImpossibleCommand);
                }
            } else {
                this.chatDisplayService.addPlayerEntry(isAdversaryMessage, userInput);
            }
        }
    }


    createCommande(commandInput:CommandInput):Command|undefined{
        if(this.isValidCommand(commandInput)){
            // TODO: Create the proper command base on command name
            return new DebugCmd(this.fakeGameService);
        }
        return undefined;
    }



    /**
     * Checks if the command entered has a valid name and syntax. Sends error message if not.
     * @param commandInput the command name and parameters entered by the player
     * @returns True if valid name and syntax
     */
    isValidCommand(commandInput:CommandInput):Boolean{
        if(this.commandNames.has(commandInput.name)){
            if(this.isValidSyntax(commandInput)){
                return true;
            }else{
                this.chatDisplayService.addErrorMessage(ErrorType.SyntaxError)
            }
        }else{
            this.chatDisplayService.addErrorMessage(ErrorType.InvalidCommand);
        }
        return false;
    }


    isValidSyntax(commandInput:CommandInput):Boolean|undefined{
        // TODO: transform in a map
        if(commandInput.name === EXCHANGE_CMD){
            return this.isValidExchangeParams(commandInput.params);
        }
        else if(commandInput.name === PLACE_CMD){
            return this.isValidPlaceParams(commandInput.params);
        }
        else if(commandInput.name === DEBUG_CMD||PASS_CMD){
            return (commandInput.params.length == 0);
        }
        return undefined;
    }

    isValidPlaceParams(enteredParams:string[]):Boolean{
        // TODO: place cmd validation
        return true;
    }


    isValidExchangeParams(enteredParams:string[]):Boolean{
        if(enteredParams.length === 1){
            let letters = enteredParams[0];
            if(!this.isEmpty(letters)){
                let isValidAmount = (letters.length > 0) && (letters.length < 8);
                if(isValidAmount){
                    for(let letter of letters){
                        if(!this.isValidLetter(letter)){
                            return false;
                        }
                    }
                    return true;
                }
            }
        }
        return false;
    }


    isValidLetter(letter:string):Boolean{
        if(!this.isEmpty(letter)){
            let charCode = letter.toLowerCase().charCodeAt(0);
            return  (charCode >= A_CHAR && charCode <= Z_CHAR)|| (charCode == ASTERISK_CHAR);
        }
        return false;
    }

    
    splitInput(enteredCommand:string):CommandInput{
        const result: CommandInput = {name:"", params:[]};
        if(!this.isEmpty(enteredCommand)){
            let splitInput = enteredCommand.split(SPACE_CHAR);
            result.name = splitInput.shift() as string;
            result.params = splitInput;
        }
        return result;
    }


    /**
     * Removes white spaces at the beginning of a string.
     * @param text Input from the user
     * @returns String without spaces at the beginning. Returns empty string if it only had white spaces
     */
     trimStartSpaces(text: string): string {
        while(text.startsWith(SPACE_CHAR)){
            text = text.substring(1);
        }
        return text;
    }

    /**
     * Checks if a string is empty.
     * @param text 
     * @returns True if empty string or white space only string
     */
    isEmpty(userInput:string){
        userInput = this.trimStartSpaces(userInput);
        return (userInput === "");
    }


    // convertToCoordinates(row: string, column: number) {
    //     const resultingCoord = new Vec2();

    //     resultingCoord.x = column;
    //     resultingCoord.y = row.charCodeAt(0) - 97;
    //     console.log("resulting coord:" + resultingCoord);
    //     return resultingCoord;
    // }

}
