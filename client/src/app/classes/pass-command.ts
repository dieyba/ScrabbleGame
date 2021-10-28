import { MultiPlayerGameService } from '@app/services/multi-player-game.service';
import { ChatDisplayEntry, createErrorEntry, createPlayerEntry } from './chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';
// import { ErrorType } from './errors';

export class PassTurnCmd extends Command {
    private gameService: MultiPlayerGameService;

    constructor(defaultParams: DefaultCommandParams) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as MultiPlayerGameService;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.PassCmd;
        const executionResult = this.gameService.passTurn(this.player);

        if (executionResult === ErrorType.ImpossibleCommand) {
            executionMessages.push(createErrorEntry(executionResult, commandMessage));
        } else if (executionResult === ErrorType.NoError) {
            this.isExecuted = true;
            const localPlayerName = this.gameService.game.creatorPlayer.name;
            const isFromLocalPlayer = this.player.name === localPlayerName;
            executionMessages.push(createPlayerEntry(isFromLocalPlayer, this.player.name, commandMessage));
        }
        return { isExecuted: this.isExecuted, executionMessages };
    }
}

export const createPassCmd = (defaultParams: DefaultCommandParams): PassTurnCmd => {
    return new PassTurnCmd(defaultParams);
};
