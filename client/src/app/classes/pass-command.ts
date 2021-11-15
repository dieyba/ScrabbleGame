import { GameService } from '@app/services/game.service';
import { ChatDisplayEntry, ChatEntryColor, createErrorEntry } from './chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class PassTurnCmd extends Command {
    private gameService: GameService;

    constructor(defaultParams: DefaultCommandParams) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as GameService;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.PassCmd;
        const executionResult = this.gameService.passTurn(this.player);

        if (executionResult === ErrorType.ImpossibleCommand) {
            executionMessages.push(createErrorEntry(executionResult, commandMessage));
        } else if (executionResult === ErrorType.NoError) {
            this.isExecuted = true;
            const localPlayerName = this.gameService.game.getLocalPlayer().name;
            const color = this.player.name === localPlayerName ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer;
            executionMessages.push({ color, message: this.player.name + ' >> ' + commandMessage });
        }
        return { isExecuted: this.isExecuted, executionMessages };
    }
}

export const createPassCmd = (defaultParams: DefaultCommandParams): PassTurnCmd => {
    return new PassTurnCmd(defaultParams);
};
