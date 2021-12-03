import { Injectable } from '@angular/core';
import { ChatEntryColor } from '@app/classes/chat-display-entry/chat-display-entry';
import { Command, CommandResult } from '@app/classes/commands/commands';
import { ExchangeCmd } from '@app/classes/exchange-command/exchange-command';
import { GameType } from '@app/classes/game-parameters/game-parameters';
import { PassTurnCmd } from '@app/classes/pass-command/pass-command';
import { PlaceCmd } from '@app/classes/place-command/place-command';
import { VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { ChatDisplayService } from '@app/services/chat-display.service/chat-display.service';
import { GameService } from '@app/services/game.service/game.service';

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
            this.displayExecutionLocally(isFromVirtualPlayer, command, commandResult);
        }
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
    displayExecutionLocally(isFromVirtualPlayer: boolean, command: Command, commandResult: CommandResult) {
        if (isFromVirtualPlayer) {
            // TODO: see how exactly debug messages will be added in command invoker
            const commandMessage = commandResult.executionMessages[0].message;
            this.chatDisplayService.addVirtalPlayerEntry(commandMessage, command.debugMessages);
        } else if (command instanceof ExchangeCmd) {
            // extract command returns both players message, but solo game only displays the local message
            this.chatDisplayService.addEntry(commandResult.executionMessages[0]);
        } else {
            commandResult.executionMessages.forEach((chatEntry) => {
                this.chatDisplayService.addEntry(chatEntry);
            });
        }
    }
}
