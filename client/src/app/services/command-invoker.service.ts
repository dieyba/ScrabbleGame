import { Injectable } from '@angular/core';
import { ChatEntryColor } from '@app/classes/chat-display-entry';
import { Command, CommandResult } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchange-command';
import { GameType } from '@app/classes/game-parameters';
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
        if (commandResult instanceof Promise) {
            commandResult.then((executionResult: CommandResult) => {
                this.displayExecutionResultMessages(executionResult, command);
            });
        } else {
            this.displayExecutionResultMessages(commandResult, command);
        }
    }
    displayExecutionResultMessages(commandResult: CommandResult, command: Command) {
        const isExchangeCmd = command instanceof ExchangeCmd;
        const isToDisplayRemotely = isExchangeCmd || command instanceof PassTurnCmd || command instanceof PlaceCmd;
        const isSendToServer = this.gameService.game.gameMode === GameType.MultiPlayer && isToDisplayRemotely && commandResult.isExecuted;
        const debugMessages = command.debugMessages;
        if (isSendToServer) {
            this.displayExecutionWithServer(isExchangeCmd, commandResult);
        } else {
            this.displayExecutionLocally(isExchangeCmd, commandResult, debugMessages);
        }
    }
    displayExecutionWithServer(isExchangeCmd: boolean, commandResult: CommandResult) {
        // extract command is the only situation where the message is different for the local/remote player
        if (isExchangeCmd) {
            const messageLocalPlayer = commandResult.executionMessages[0].message;
            const messageRemotePlayer = commandResult.executionMessages[1].message;
            this.chatDisplayService.sendMessageToServer(messageLocalPlayer, messageRemotePlayer);
        } else {
            commandResult.executionMessages.forEach((chatEntry) => {
                this.chatDisplayService.sendMessageToServer(chatEntry.message);
            });
        }
    }
    displayExecutionLocally(isExchangeCmd: boolean, commandResult: CommandResult, debugMessages: string[]) {
        const isFromVirtualPlayer =
            this.gameService.game.gameMode === GameType.Solo &&
            commandResult.executionMessages[0].color === ChatEntryColor.RemotePlayer &&
            debugMessages.length !== 0;
        if (isFromVirtualPlayer) {
            // TODO: see how exactly debug messages will be added in command invoker
            const commandMessage = commandResult.executionMessages[0].message;
            this.chatDisplayService.addVirtalPlayerEntry(commandMessage, debugMessages);
        } else if (isExchangeCmd) {
            // extract command returns both players message, but solo game only displays the local message
            this.chatDisplayService.addEntry(commandResult.executionMessages[0]);
        } else {
            commandResult.executionMessages.forEach((chatEntry) => {
                this.chatDisplayService.addEntry(chatEntry);
            });
        }
    }
}
