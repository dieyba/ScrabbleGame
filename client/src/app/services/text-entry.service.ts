import { Injectable } from '@angular/core';
import { ChatDisplayService } from './chat-display.service';
import { Vec2 } from '../classes/vec2';
// import { GameService, Command } from '../classes/commands';

const COMMAND_LIST = ['placer', 'échanger', 'passer', 'debug', 'réserve', 'aide'] as const;
const EMPTY_STRING = "";
const SPACE_CHAR = ' ';

@Injectable({
    providedIn: 'root',
})
export class TextEntryService {
    commandNames : Set<string>;

    constructor(private chatDisplayService: ChatDisplayService) {
        this.commandNames = new Set;
        
    }

    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(text: string) {   

        // if they dont wont us to trim the start, just use it trimStart for if condition without changing text value     
        text = this.trimStart(text); 
        if(text!==EMPTY_STRING){
            
            if(text.startsWith("!")) {
                // TODO: check if the command name entered is valid. Send error message if not.
                this.isValidCmd(text);
                
                //TODO:create new command if its valid.           


            } else {
                // TODO: decide how to check which player sent the message
                this.chatDisplayService.addPlayerEntry(false, text);
            }
        }
    }

    isValidCmd(enteredCommand:string): Boolean{
        enteredCommand = this.removeFirstChar(enteredCommand);
        let commandName = enteredCommand.split(SPACE_CHAR,1)[0];
        console.log("commandName:"+ commandName);
        console.log("command is valid:"+ commandName in COMMAND_LIST);
        return ;
    } 

    isValidSyntax(enteredCommand:string):Boolean{
        return true;
    }


    /**
     * Removes white spaces at the beginning of a string.
     * @param text Text input from user
     * @returns String without spaces at the beginning. Returns empty string if it only had white spaces
     */
    trimStart(text: string): string {
        while(text.startsWith(SPACE_CHAR)){
            text = this.removeFirstChar(text);
        }
        return text;
    }

    removeFirstChar(text:string):string{
        return text.substring(1);
    }


    getCoordinates(row: string, column: number) {
        const resultingCoord = new Vec2();

        resultingCoord.x = column;
        resultingCoord.y = row.charCodeAt(0) - 97;
        console.log("resulting coord:" + resultingCoord);
        return resultingCoord;
    }


  // isValidCommandTest(text: string) {
    //     // Extracting the command name
    //     let commandTemp = text.substr(1);
    //     commandTemp = commandTemp.split(' ')[0];

    //     // Checking if the command exist
    //     // for (const COMMAND of COMMAND_LIST) {
    //     //     if (commandTemp === COMMAND) {
    //     //         return true;
    //     //     }
    //     // }
    //     if (commandTemp === COMMAND_LIST[0]) {
    //         return true;
    //     }
    //     return false;
    // }

    // isValidCommand(text: string) {
    //     // Extracting the command name
    //     let commandTemp = text.substr(1);
    //     commandTemp = commandTemp.split(' ')[0];

    //     // Checking if the command exist
    //     for (const COMMAND of COMMAND_LIST) {
    //         if (commandTemp === COMMAND) {
    //             return true;
    //         }
    //     }

    //     return false;
    // }

    // handleCommand(command: string) {
    //     let coord: Vec2;

    //     const row = command[8];
    //     console.log(command.substring(9, 11));
    //     const column = parseInt(command.substring(9, 11));
    //     coord = this.getCoordinates(row, column);

    //     const word: string = command.substring(13);
    //     if (command[11] === 'v') {
    //         for (let i = 0; i < word.length; i++) {
    //             const scrabbleLetter = new ScrabbleLetter();
    //             scrabbleLetter.character = word[i];
    //             scrabbleLetter.value = 42;
    //             scrabbleLetter.square = new Square(coord.x - 1, coord.y + i);
    //             this.gridService.drawLetter(scrabbleLetter);
    //         }
    //     } else {
    //         for (let i = 0; i < word.length; i++) {
    //             const scrabbleLetter = new ScrabbleLetter();
    //             scrabbleLetter.character = word[i];
    //             scrabbleLetter.value = 42;
    //             scrabbleLetter.square = new Square(coord.x - 1 + i, coord.y);
    //             this.gridService.drawLetter(scrabbleLetter);
    //         }
    //     }
    // }


}
