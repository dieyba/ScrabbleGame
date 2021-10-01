import { TestBed } from '@angular/core/testing';
import { DefaultCommandParams } from '@app/classes/commands';
import { ExchangeCmd } from '@app/classes/exchangeCommand';
import { SoloGameService } from '@app/services/solo-game.service';
//import SpyObj = jasmine.SpyObj;
class DefaultCommandParamsTest implements DefaultCommandParams {
    gameService: SoloGameService;
    isFromLocalPlayer: boolean;
}
describe('ExchangeCmd', () => {
    //let service= new SoloGameService();

    const defaultCommandParams: DefaultCommandParamsTest = new DefaultCommandParamsTest();
    let soloGameSpy: jasmine.SpyObj<SoloGameService>;
    let exchange = new ExchangeCmd(defaultCommandParams, 'amd');
    //soloGameSpy = jasmine.createSpyObj('SoloGameService', ['exchangeLetters']);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ExchangeCmd, useValue: exchange }, { provide: SoloGameService, useValue: soloGameSpy }],
        });
        exchange = TestBed.inject(ExchangeCmd);
        // soloGameSpy = TestBed.inject(SoloGameService) as jasmine.SpyObj<SoloGameService>;
    });

    it('should create an instance', () => {
        expect(exchange).toBeTruthy();
    });

    // it('should call exchange letters from soloGameService', () => {
    //     // spyOn('soloGameSpy', 'exchangeLetters');
    //     // soloGameSpy = spyOn<any>(exchange, 'exchangeLetters');
    //     //spyOn(soloGameSpy, 'exchangeLetters').and.callThrough();
    //     // exchange.gameService = spy;
    //     exchange.execute();
    //     expect(exchange.gameService.exchangeLetters).toHaveBeenCalled();
    // });
});
