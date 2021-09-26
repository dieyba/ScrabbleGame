import { Injectable } from '@angular/core';
import { ChatDisplayService } from './chat-display.service';
import { ErrorType } from '@app/classes/errors';
import { GameService } from '../classes/commands';
// import { Vec2 } from '../classes/vec2';

// TODO: voir leurs consignes pour les constantes
const COMMAND_LIST = ['placer', 'échanger', 'passer', 'debug', 'réserve', 'aide'] as const;
const SPACE_CHAR = ' ';

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

        // TODO: trim start spaces?
        // if they dont wont us to trim the start, just use it trimStart for if condition without changing text value     
        userInput = this.trimStartSpaces(userInput); 
        
        if(!this.isEmpty(userInput)){
            if(userInput.startsWith("!")) {
                userInput = userInput.substring(1);
                const commandInput: CommandInput = this.splitInput(userInput);  
                
                if(this.isValidCmd(commandInput.name)){
                    if(this.isValidSyntax(commandInput.params)){
                        
                        // TODO: check if the player who sent the input can pass that command
                        // create a map with a command to create each cmd?
                        // how do i pass params to the function?
                        
                    }else{
                        this.chatDisplayService.addErrorMessage(ErrorType.SyntaxError)
                    }
                }else{
                    this.chatDisplayService.addErrorMessage(ErrorType.InvalidCommand);
                }

            } else {
                // TODO: decide how to check which player sent the message
                let isAdversaryMessage = false;
                this.chatDisplayService.addPlayerEntry(isAdversaryMessage, userInput);
            }
        }
    }

    
    isValidSyntax(enteredParams:string[]):Boolean{
        // TODO: check params syntax
        // check if it only has the proper params after cmd name. Nothing more after either
        // create map with command name and function to call to check the params syntax?
        // return result of that function execution
        return true;
    }
    
    isValidCmd(enteredCmd:string): Boolean{
        return this.commandNames.has(enteredCmd);;
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
