import { Injectable } from '@angular/core';
import { ChatEntryColor } from '@app/classes/chat-display-entry';
import { Command, CommandResult } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchange-command';
import { GameType } from '@app/classes/game-parameters';
import { PassTurnCmd } from '@app/classes/pass-command';
import { PlaceCmd } from '@app/classes/place-command';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { ChatDisplayService } from './chat-display.service';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class CommandInvokerService {
    constructor(private chatDisplayService: ChatDisplayService, private gameService: GameService) {}

    async executeCommand(command: Command) {
        const commandResult = await command.execute();
        const isExchangeCmd = command instanceof ExchangeCmd;
        const isToDisplayRemotely = isExchangeCmd || command instanceof PassTurnCmd || command instanceof PlaceCmd;
        const isSendToServer = this.gameService.game.gameMode === GameType.MultiPlayer && isToDisplayRemotely && commandResult.isExecuted;
        const isFromVirtualPlayer =
            this.gameService.game.gameMode === GameType.Solo &&
            this.gameService.game.getOpponent() instanceof VirtualPlayer &&
            commandResult.executionMessages[0]?.color === ChatEntryColor.RemotePlayer;
        if (isSendToServer) {
            this.displayExecutionWithServer(isExchangeCmd, commandResult);
        } else {
            this.displayExecutionLocally(isFromVirtualPlayer, isExchangeCmd, commandResult);
        }
        // TODO: To be careful when merging with vp branch, we need to keep this version of the code for the command invokers
        // and only add the debug message handling part from vp branch
    }
    displayExecutionWithServer(isExchangeCmd: boolean, commandResult: CommandResult) {
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
    }
    displayExecutionLocally(isFromVirtualPlayer: boolean, isExchangeCmd: boolean, commandResult: CommandResult) {
        if (isFromVirtualPlayer) {
            // TODO: see how exactly debug messages will be added in command invoker
            const commandMessage = commandResult.executionMessages[0].message;
            const debugMessages = ['some debug message', 'some other debug message'];
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
