import { DefaultCommandParams, ExchangeParams } from '@app/classes/commands';
import { createExchangeCmd, ExchangeCmd } from '@app/classes/exchange-command';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { LocalPlayer } from './local-player';

describe('ExchangeCmd', () => {
    let playerchoice = new LocalPlayer('dieyna');
    let rack = new RackService();
    let grid = new GridService();
    let service = new SoloGameService(grid, rack);
    let defaultParams: DefaultCommandParams = { player: playerchoice, serviceCalled: service };
    const specificParams: ExchangeParams = 'test';
    let exchange = new ExchangeCmd(defaultParams, 'amd');

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
