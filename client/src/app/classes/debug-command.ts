import { ChatDisplayService } from '@app/services/chat-display.service';
import { Command, DebugParams, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class DebugCmd extends Command {
    chatDisplayService: ChatDisplayService;
    constructor(defaultParams: DefaultCommandParams, chatDisplayService: ChatDisplayService) {
        super(defaultParams);
        this.chatDisplayService = chatDisplayService;
    }

    execute(): ErrorType {
        return this.chatDisplayService.invertDebugState();
    }
}

export const createDebugCmd = (params: { defaultParams: DefaultCommandParams; specificParams: DebugParams }): DebugCmd => {
    return new DebugCmd(params.defaultParams, params.specificParams);
};
