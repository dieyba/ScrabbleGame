import { ChatDisplayService } from '@app/services/chat-display.service';
import { DefaultCommandParams } from './commands';
import { LocalPlayer } from './local-player';
import { createStockCmd, StockCmd } from './stock-command';

describe('StockCommand', () => {
    const playerchoice = new LocalPlayer('dieyna');
    const chat = new ChatDisplayService();
    const defaultParams: DefaultCommandParams = { player: playerchoice, serviceCalled: chat };
    const specificParams: string = 'test';
    const stockCommand = new StockCmd(defaultParams, specificParams);

    it('should create an instance', () => {
        expect(stockCommand).toBeTruthy();
    });

    it('execute should call addStockMessage from chatDisplayService', () => {
        const spy = spyOn(chat, 'addStockMessage');
        stockCommand.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('createStockCmd should create an instance', () => {
        expect(createStockCmd({ defaultParams, specificParams })).toBeTruthy();
    });
});
