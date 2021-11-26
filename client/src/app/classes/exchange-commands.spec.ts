import { TestBed } from '@angular/core/testing';
import { ExchangeCmd } from '@app/classes/exchange-command';
import { GameService } from '@app/services/game.service';
import { DefaultCommandParams } from './commands';
import { Player } from './player';

const PLAYER_NAME = 'Sara';
// const OPPONENT_NAME = 'Not Sara';
const LETTERS = 'abcd';

describe('ExchangeCmd', () => {
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    // let soloGameServiceSpy: jasmine.SpyObj<GameService>;
    const localPlayer = new Player(PLAYER_NAME);
    // const opponentPlayer = new Player(OPPONENT_NAME);

    beforeEach(() => {
        // soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['exchangeLetters']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['exchangeLetters']);

        TestBed.configureTestingModule({
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
            ],
        });
    });

    it('should create an instance', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
        const exchange = new ExchangeCmd(defaultParams, LETTERS);
        expect(exchange).toBeTruthy();
    });


    // it('createExchangeCmd should create an instance', () => {
    //     const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
    //     expect(createExchangeCmd({ defaultParams, specificParams: LETTERS })).toBeTruthy();
    // });
});
