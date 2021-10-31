import { DefaultCommandParams } from '@app/classes/commands';
import { createExchangeCmd, ExchangeCmd } from '@app/classes/exchange-command';
import { BonusService } from '@app/services/bonus.service';
import { ChatDisplayService } from '@app/services/chat-display.service';
import { GridService } from '@app/services/grid.service';
import { PlaceService } from '@app/services/place.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { ValidationService } from '@app/services/validation.service';
import { WordBuilderService } from '@app/services/word-builder.service';
import { LocalPlayer } from './local-player';

describe('ExchangeCmd', () => {
    const playerchoice = new LocalPlayer('dieyna');
    const chat = new ChatDisplayService();
    const rack = new RackService();
    const grid = new GridService();
    const bonus = new BonusService(grid);
    const validation = new ValidationService(grid, bonus);
    const wordBuilder = new WordBuilderService(grid);
    const place = new PlaceService(grid, rack);
    const service = new SoloGameService(grid, rack, chat, validation, wordBuilder, place);
    const defaultParams: DefaultCommandParams = { player: playerchoice, serviceCalled: service };
    const specificParams = 'test';
    const exchange = new ExchangeCmd(defaultParams, 'amd');

    it('should create an instance', () => {
        expect(exchange).toBeTruthy();
    });

    it('execute should call exchange letters from soloGameService', () => {
        const spy = spyOn(service, 'exchangeLetters');
        exchange.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('createExchangeCmd should create an instance', () => {
        expect(createExchangeCmd({ defaultParams, specificParams })).toBeTruthy();
    });
});
