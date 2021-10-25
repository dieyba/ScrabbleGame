import { ChatDisplayService } from '@app/services/chat-display.service';
import { ChatDisplayEntry, createPlayerEntry, createSystemEntry } from './chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams } from './commands';

const IS_LOCAL_PLAYER = true; // debug is always only displayed locally

export class DebugCmd extends Command {
    chatDisplayService: ChatDisplayService;

    constructor(defaultParams: DefaultCommandParams) {
        super(defaultParams.player);
        this.chatDisplayService = defaultParams.serviceCalled as ChatDisplayService;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.DebugCmd;

        const debugActivationMessage = this.chatDisplayService.invertDebugState();
        this.isExecuted = true;
        executionMessages.push(createPlayerEntry(IS_LOCAL_PLAYER, this.player.name, commandMessage));
        executionMessages.push(createSystemEntry(debugActivationMessage));

        return { isExecuted: this.isExecuted, executionMessages };
    }
}

export const createDebugCmd = (defaultParams: DefaultCommandParams): DebugCmd => {
    return new DebugCmd(defaultParams);
};
