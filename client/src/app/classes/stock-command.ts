import { ChatDisplayService } from '@app/services/chat-display.service';
import { Command, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class StockCmd extends Command {
    chatDisplayService: ChatDisplayService;
    stockLetters: string;

    constructor(defaultParams: DefaultCommandParams, stockLetters: string) {
        super(defaultParams.player);
        this.chatDisplayService = defaultParams.serviceCalled as ChatDisplayService;
        this.stockLetters = stockLetters;
    }

    execute(): ErrorType {
        return this.chatDisplayService.addStockMessage(this.stockLetters);
    }
}

export const createStockCmd = (params: { defaultParams: DefaultCommandParams; specificParams: string }): StockCmd => {
    return new StockCmd(params.defaultParams, params.specificParams);
};
