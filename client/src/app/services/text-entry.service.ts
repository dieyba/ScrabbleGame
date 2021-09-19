import { Injectable } from '@angular/core';

const COMMAND_LIST = ['placer', 'échanger', 'passer', 'debug', 'réserve', 'aide'] as const;

@Injectable({
    providedIn: 'root',
})
export class TextEntryService {
    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(text: string) {
        if (text.charAt(0) === '!') {
            if (this.isValidCommand(text)) {
                // Send to command handler
                console.log(text); // TODO replace by the command handler function
            } else {
                // TODO invalid command message
            }
        } else {
            // Send to other player
            console.log(text);
        }
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
}
