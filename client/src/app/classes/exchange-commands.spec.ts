import { DefaultCommandParams, ExchangeParams } from '@app/classes/commands';
import { createExchangeCmd, ExchangeCmd } from '@app/classes/exchange-command';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { LocalPlayer } from './local-player';

describe('ExchangeCmd', () => {
    const playerchoice = new LocalPlayer('dieyna');
    const rack = new RackService();
    const grid = new GridService();
    const service = new SoloGameService(grid, rack);
    const defaultParams: DefaultCommandParams = { player: playerchoice, serviceCalled: service };
    const specificParams: ExchangeParams = 'test';
    const exchange = new ExchangeCmd(defaultParams, 'amd');

    it('should create an instance', () => {
        expect(exchange).toBeTruthy();
    });

    it('should call exchange letters from soloGameService', () => {
        const spy = spyOn(service, 'exchangeLetters');
        exchange.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('createExchangeCmd should create an instance', () => {
        expect(createExchangeCmd({ defaultParams, specificParams })).toBeTruthy();
    });
});
