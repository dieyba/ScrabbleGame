import { Injectable } from '@angular/core';
import { Command, CommandResult } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchange-command';
import { PassTurnCmd } from '@app/classes/pass-command';
import { PlaceCmd } from '@app/classes/place-command';
import { ChatDisplayService } from './chat-display.service';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class CommandInvokerService {
    constructor(private chatDisplayService: ChatDisplayService, private gameService: GameService) {}

    async executeCommand(command: Command): Promise<void> {
        const commandResult = command.execute();
        const isExchangeCmd = command instanceof ExchangeCmd;
        const isToDisplayRemotely = isExchangeCmd || command instanceof PassTurnCmd || command instanceof PlaceCmd;
        if (commandResult instanceof Promise) {
            await commandResult.then((executionResult: CommandResult) => {
                console.log("await place result and then display");
                this.displayExecutionResultMessages(executionResult, isExchangeCmd, isToDisplayRemotely);
            });
        } else {
            this.displayExecutionResultMessages(commandResult, isExchangeCmd, isToDisplayRemotely);
        }
    }

    displayExecutionResultMessages(commandResult: CommandResult, isExchangeCmd: boolean, isToDisplayRemotely: boolean) {
        const isSendToServer = this.gameService.isMultiplayerGame && isToDisplayRemotely && commandResult.isExecuted;
        if (isSendToServer) {
            // extract command is the only situation where the message is different for the local/remove player
            if (isExchangeCmd) {
                const messageLocalPlayer = commandResult.executionMessages[0].message;
                const messageRemotePlayer = commandResult.executionMessages[1].message;
                this.chatDisplayService.sendMessageToServer(messageLocalPlayer, messageRemotePlayer);
            } else {
                commandResult.executionMessages.forEach((chatEntry) => {
                    this.chatDisplayService.sendMessageToServer(chatEntry.message);
                });
            }
        } else {
            // extract command returns both players message, but solo game only displays the local message
            if (isExchangeCmd) {
                this.chatDisplayService.addEntry(commandResult.executionMessages[0]);
            } else {
                commandResult.executionMessages.forEach((chatEntry) => {
                    this.chatDisplayService.addEntry(chatEntry);
                });
            }
        }
    }
}
