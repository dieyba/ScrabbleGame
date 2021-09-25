import { Injectable } from '@angular/core';
import { CommandHandler } from '@app/classes/command-handler';
import { ChatDisplayService } from './chat-display.service';

// const COMMAND_LIST = ['placer', 'échanger', 'passer', 'debug', 'réserve', 'aide'] as const;

@Injectable({
    providedIn: 'root',
})
export class TextEntryService {
    constructor(private chatDisplayService: ChatDisplayService) {}

    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(text: string) {   
        this.trimStartSpace(text);     
        if (text.charAt(0) === '!') {
    
            //TODO : to remove or to add command handler as attribute actually
            let tempCmdHandler: CommandHandler = new CommandHandler();
            tempCmdHandler.handleCommand(text);
            
            // get command's result and if its invalid send invalid commmand error msg to chat display
            // (impossible command error is sent from receiver to game service to chat display ig?)
            // this.chatDisplayService.addErrorMessage(ErrorType.InvalidCommand);
            
        } else {
            // Display text entered as regular chat message
            if (text !== '') {
                // TODO: define how to check which player sent the message
                this.chatDisplayService.addPlayerEntry(false, text);
            }
            
        }
    }

    // add validation for empty text entered
    // finish validation for empty white space at the beginning (to trim it)s
    trimStartSpace(text: string): void{
        let startIndex = 0;
        if(text.length!=0 && text.includes(' ', startIndex)){
            
        }
        text.substring(startIndex);
        console.log(text);
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

    // getCoordinates(row: string, column: number) {
    //     const resultingCoord = new Vec2();

    //     resultingCoord.x = column;
    //     resultingCoord.y = row.charCodeAt(0) - 97;
    //     console.log(resultingCoord);
    //     return resultingCoord;
    // }
}
