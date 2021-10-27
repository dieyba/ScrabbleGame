import { Injectable } from '@angular/core';
import { Command } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchange-command';
import { PassTurnCmd } from '@app/classes/pass-command';
import { PlaceCmd } from '@app/classes/place-command';
import { ChatDisplayService } from './chat-display.service';

@Injectable({
    providedIn: 'root',
})
export class CommandInvokerService {
    constructor(private chatDisplayService: ChatDisplayService) {}

    // if problem with order of commands executed or commands overlapping when executed, modify invoker so only one command can be called at a time
    // create a command waiting queue and call each one after the other

    executeCommand(command: Command): void {
        const commandResult = command.execute();
        const isSendToServer =
            isToDisplayRemotely(command) &&
            commandResult.isExecuted; /* && this.gameService.isMultiplayer (add bool as parameter of executeCommand?)*/
        if (isSendToServer) {
            commandResult.executionMessages.forEach((chatEntry) => {
                // TODO : implement server to chat box
                // create a serverChatEntry (aka with player name instead of color?)
                // send msg to server, server will then call both chatdisplay.addEntry() with proper message color per entry;
                console.log('to server: ' + chatEntry.message);
            });
        } else {
            commandResult.executionMessages.forEach((chatEntry) => {
                this.chatDisplayService.addEntry(chatEntry);
            });
        }
    }
}

const isToDisplayRemotely = (command: Command): boolean => {
    return command instanceof PassTurnCmd || command instanceof ExchangeCmd || command instanceof PlaceCmd;
};
