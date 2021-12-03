import { GameService } from '@app/services/game.service';
import { ChatDisplayEntry, createErrorEntry } from './chat-display-entry';
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
            return { isExecuted: this.isExecuted, executionMessages };
        }
        this.isExecuted = true;
        return { isExecuted: this.isExecuted, executionMessages };
    }
}

export const createPassCmd = (defaultParams: DefaultCommandParams): PassTurnCmd => {
    return new PassTurnCmd(defaultParams);
};
