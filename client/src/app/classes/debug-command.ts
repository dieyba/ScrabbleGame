import { ChatDisplayService } from '@app/services/chat-display.service';
import { Command, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class DebugCmd extends Command {
    chatDisplayService: ChatDisplayService;

    constructor(defaultParams: DefaultCommandParams) {
        super(defaultParams.player);
        this.chatDisplayService = defaultParams.serviceCalled as ChatDisplayService;
    }

    execute(): ErrorType {
        return this.chatDisplayService.invertDebugState();
    }
}

export const createDebugCmd = (defaultParams: DefaultCommandParams): DebugCmd => {
    return new DebugCmd(defaultParams);
};
