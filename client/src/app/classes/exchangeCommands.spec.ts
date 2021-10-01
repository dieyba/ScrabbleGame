import { TestBed } from '@angular/core/testing';
import { DefaultCommandParams } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchangeCommand';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { LocalPlayer } from './local-player';
//import SpyObj = jasmine.SpyObj;
class DefaultCommandParamsTest implements DefaultCommandParams {
    gameService: SoloGameService;
    isFromLocalPlayer: boolean;
}
describe('ExchangeCmd', () => {
    let rack = new RackService();
    let grid = new GridService();
    let service = new SoloGameService(grid, rack);
    const defaultCommandParams: DefaultCommandParamsTest = new DefaultCommandParamsTest();
    let exchange = new ExchangeCmd(defaultCommandParams, 'amd');
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ExchangeCmd, useValue: exchange }],
        });
    });

    it('should create an instance', () => {
        expect(exchange).toBeTruthy();
    });

    it('should call exchange letters from soloGameService', () => {
        let player = new LocalPlayer('dieyna');
        player.isActive = true;
        service.localPlayer = player;
        exchange.gameService = service;
        const spy = spyOn(service, 'exchangeLetters').and.callThrough();
        exchange.execute();
        expect(spy).toHaveBeenCalled();
    });
});
