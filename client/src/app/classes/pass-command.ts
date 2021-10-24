import { SoloGameService } from '@app/services/solo-game.service';
import { ChatDisplayEntry, createErrorEntry, createPlayerEntry } from './chat-display-entry';
import { Command, CommandName, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';
// import { ErrorType } from './errors';

export class PassTurnCmd extends Command {
    private gameService: SoloGameService;
    // private commandInput: string;

    constructor(defaultParams: DefaultCommandParams, commandInput?: string) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as SoloGameService;
        // this.commandInput = (commandInput) ? commandInput : "!passer";
    }

    execute(): ChatDisplayEntry[] {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.PASS_CMD;
        const executionResult = this.gameService.passTurn(this.player);

        if (executionResult === ErrorType.ImpossibleCommand) {
            executionMessages.push(createErrorEntry(executionResult, commandMessage));
        } else if (executionResult === ErrorType.NoError) {
            const isFromLocalPlayer = this.player.name === this.gameService.localPlayer.name;
            executionMessages.push(createPlayerEntry(isFromLocalPlayer, this.player.name, commandMessage));
        }
        return executionMessages;
    }
}

export const createPassCmd = (defaultParams: DefaultCommandParams): PassTurnCmd => {
    return new PassTurnCmd(defaultParams);
};
