import { Injectable } from '@angular/core';
import { ErrorType } from '@app/classes/chat-display-entry';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Square } from '@app/classes/square';
import { Vec2 } from '@app/classes/vec2';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { DebugCmd, PassTurnCmd, PlaceCmd, SwitchLettersCmd} from '@app/classes/commands';


const COMMAND_LIST = ['placer', 'échanger', 'passer', 'debug', 'réserve', 'aide'] as const;

@Injectable({
    providedIn: 'root',
})
export class TextEntryService {
    constructor(private chatDisplayService: ChatDisplayService, private gridService: GridService) {}

    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(text: string) {
        if (text.charAt(0) === '!') {
            if (this.isValidCommandTest(text)) {
                // Send to command handler
                // TODO send to command handler function
                this.handleCommand(text);
            } else if (this.isValidCommand(text)) {
                // Test, erase
            } else {
                // TODO invalid command message
                this.chatDisplayService.addErrorMessage(ErrorType.InvalidCommand);
            }
        } else {
            // Send to other player
            if (text !== '') {
                this.chatDisplayService.addPlayerEntry(false, text);
            }

            // TODO: test command to remove when handler works
            new DebugCmd().execute();
            new PassTurnCmd().execute();
            new PlaceCmd({x:50, y:100}, text).execute();
            new SwitchLettersCmd(text).execute();

        }
    }

    isValidCommandTest(text: string) {
        // Extracting the command name
        let commandTemp = text.substr(1);
        commandTemp = commandTemp.split(' ')[0];

        // Checking if the command exist
        // for (const COMMAND of COMMAND_LIST) {
        //     if (commandTemp === COMMAND) {
        //         return true;
        //     }
        // }
        if (commandTemp === COMMAND_LIST[0]) {
            return true;
        }

        return false;
    }

    isValidCommand(text: string) {
        // Extracting the command name
        let commandTemp = text.substr(1);
        commandTemp = commandTemp.split(' ')[0];

        // Checking if the command exist
        for (const COMMAND of COMMAND_LIST) {
            if (commandTemp === COMMAND) {
                return true;
            }
        }

        return false;
    }

    handleCommand(command: string) {
        let coord: Vec2;

        const row = command[8];
        console.log(command.substring(9, 11));
        const column = parseInt(command.substring(9, 11));
        coord = this.getCoordinates(row, column);

        const word: string = command.substring(13);
        if (command[11] === 'v') {
            for (let i = 0; i < word.length; i++) {
                const scrabbleLetter = new ScrabbleLetter();
                scrabbleLetter.character = word[i];
                scrabbleLetter.value = 42;
                scrabbleLetter.square = new Square(coord.x - 1, coord.y + i);
                this.gridService.drawLetter(scrabbleLetter);
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                const scrabbleLetter = new ScrabbleLetter();
                scrabbleLetter.character = word[i];
                scrabbleLetter.value = 42;
                scrabbleLetter.square = new Square(coord.x - 1 + i, coord.y);
                this.gridService.drawLetter(scrabbleLetter);
            }
        }
    }

    getCoordinates(row: string, column: number) {
        const resultingCoord = new Vec2();

        resultingCoord.x = column;
        resultingCoord.y = row.charCodeAt(0) - 97;
        console.log(resultingCoord);
        return resultingCoord;
    }
}
