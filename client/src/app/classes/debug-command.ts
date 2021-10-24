import { ChatDisplayService } from '@app/services/chat-display.service';
import { ChatDisplayEntry, createPlayerEntry, createSystemEntry } from './chat-display-entry';
import { Command, DefaultCommandParams, CommandName } from './commands';

const IS_LOCAL_PLAYER = true; // debug is always only displayed locally

export class DebugCmd extends Command {
    chatDisplayService: ChatDisplayService;

    constructor(defaultParams: DefaultCommandParams) {
        super(defaultParams.player);
        this.chatDisplayService = defaultParams.serviceCalled as ChatDisplayService;
    }

    execute(): ChatDisplayEntry[] {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.DEBUG_CMD;
        const debugActivationMessage = this.chatDisplayService.invertDebugState();
        executionMessages.push(createPlayerEntry(IS_LOCAL_PLAYER, this.player.name, commandMessage));
        executionMessages.push(createSystemEntry(debugActivationMessage));
        return executionMessages;
    }
}

export const createDebugCmd = (defaultParams: DefaultCommandParams): DebugCmd => {
    return new DebugCmd(defaultParams);
};
