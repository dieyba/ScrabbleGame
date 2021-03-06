/* eslint-disable dot-notation */
import { ChatEntryColor, createErrorEntry } from '@app/classes/chat-display-entry/chat-display-entry';
import { DefaultCommandParams } from '@app/classes/commands/commands';
import { ErrorType } from '@app/classes/errors';
import { createExchangeCmd, ExchangeCmd } from '@app/classes/exchange-command/exchange-command';
import { GameParameters } from '@app/classes/game-parameters/game-parameters';
import { Player } from '@app/classes/player/player';
import { GameService } from '@app/services/game.service/game.service';

const PLAYER_NAME = 'Sara';
const OPPONENT_NAME = 'Not Sara';
const LETTERS = 'abcd';
/* eslint-disable dot-notation */
describe('ExchangeCmd', () => {
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let exchange: ExchangeCmd;
    const localPlayer = new Player(PLAYER_NAME);
    const opponentPlayer = new Player(OPPONENT_NAME);

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['exchangeLetters']);
        gameServiceSpy.game = new GameParameters();
        gameServiceSpy.game.players = [localPlayer, opponentPlayer];
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
        exchange = new ExchangeCmd(defaultParams, LETTERS);
    });

    it('should create an instance', () => {
        expect(exchange).toBeTruthy();
    });

    it('should call exchangeLetters from game service', () => {
        exchange.execute();
        expect(gameServiceSpy.exchangeLetters).toHaveBeenCalled();
    });

    it('should create local exchange message', () => {
        expect(exchange.createExchangeMessage(true, LETTERS)).toEqual(LETTERS);
    });

    it('should create opponent exchange message', () => {
        expect(exchange.createExchangeMessage(false, LETTERS)).toEqual(LETTERS.length + ' lettre(s)');
    });

    it('should execute and return successful command message from local player', () => {
        gameServiceSpy.exchangeLetters.and.returnValue(ErrorType.NoError);
        const localPlayerEntry = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !??changer ' + LETTERS };
        const opponentPlayerEntry = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !??changer ' + LETTERS.length + ' lettre(s)' };
        exchange.player.isActive = true;
        expect(exchange.execute()).toEqual({ isExecuted: true, executionMessages: [localPlayerEntry, opponentPlayerEntry] });
    });

    it('should execute and return successful command message from opponent player', () => {
        gameServiceSpy.exchangeLetters.and.returnValue(ErrorType.NoError);
        const localPlayerEntry = { color: ChatEntryColor.RemotePlayer, message: OPPONENT_NAME + ' >> !??changer ' + LETTERS };
        const opponentPlayerEntry = {
            color: ChatEntryColor.RemotePlayer,
            message: OPPONENT_NAME + ' >> !??changer ' + LETTERS.length + ' lettre(s)',
        };
        exchange.player = opponentPlayer;
        exchange.player.isActive = true;
        expect(exchange.execute()).toEqual({ isExecuted: true, executionMessages: [opponentPlayerEntry, localPlayerEntry] });
    });

    it('should execute and return impossible command error', () => {
        gameServiceSpy.exchangeLetters.and.returnValue(ErrorType.ImpossibleCommand);
        const errorLetters = 'AAAAAAAA';
        const errorMessage = createErrorEntry(ErrorType.ImpossibleCommand, '!??changer ' + errorLetters);
        // eslint-disable-next-line dot-notation
        exchange['letters'] = errorLetters;
        exchange.player.isActive = false;
        expect(exchange.execute()).toEqual({ isExecuted: false, executionMessages: [errorMessage] });
    });

    it('createExchangeCmd should create an instance', () => {
        expect(
            createExchangeCmd({
                defaultParams: { player: localPlayer, serviceCalled: gameServiceSpy },
                specificParams: LETTERS,
            }),
        ).toBeTruthy();
    });
});
