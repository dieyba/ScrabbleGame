import { TestBed } from '@angular/core/testing';
import { ChatDisplayEntry, ChatEntryColor } from '@app/classes/chat-display-entry/chat-display-entry';
import { DefaultCommandParams } from '@app/classes/commands/commands';
import { ErrorType } from '@app/classes/errors';
import { ExchangeCmd } from '@app/classes/exchange-command/exchange-command';
import { GameParameters, GameType } from '@app/classes/game-parameters/game-parameters';
import { HelpCmd } from '@app/classes/help-command/help-command';
import { PassTurnCmd } from '@app/classes/pass-command/pass-command';
import { PlaceCmd } from '@app/classes/place-command/place-command';
import { Player } from '@app/classes/player/player';
import { StockCmd } from '@app/classes/stock-command/stock-command';
import { Axis } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { ChatDisplayService } from '@app/services/chat-display.service/chat-display.service';
import { GameService } from '@app/services/game.service/game.service';
import { CommandInvokerService } from './command-invoker.service';

describe('CommandInvokerService', () => {
    let service: CommandInvokerService;
    let chatDisplayServiceSpy: ChatDisplayService;
    let gameServiceSpy: GameService;
    let defaultParams: DefaultCommandParams;
    const localPlayer = new Player('Local Player Name');
    const opponentPlayer = new Player('Opponent Name');
    const virtualPlayer = new VirtualPlayer('Virtual Player Name');

    beforeEach(() => {
        chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', ['initialize']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['passTurn', 'exchangeLetters']);

        chatDisplayServiceSpy = new ChatDisplayService();
        TestBed.configureTestingModule({
            providers: [
                { provide: ChatDisplayService, useValue: chatDisplayServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
        });
        service = TestBed.inject(CommandInvokerService);
        gameServiceSpy.game = new GameParameters();
        gameServiceSpy.game.gameMode = GameType.Solo;
        gameServiceSpy.game.players = [localPlayer, opponentPlayer];
        gameServiceSpy.game.setLocalAndOpponentId(0, 1);
        defaultParams = { player: localPlayer, serviceCalled: gameServiceSpy };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('command should call displayExecutionLocally', async () => {
        const spy = spyOn(service, 'displayExecutionLocally');
        gameServiceSpy.passTurn = jasmine.createSpy('passTurnSpy').and.returnValue(ErrorType.NoError);
        const command = new PassTurnCmd(defaultParams);
        return service.executeCommand(command).then(() => {
            expect(spy).toHaveBeenCalledWith(false, command, { isExecuted: true, executionMessages: [] });
        });
    });

    it('exchangeCommand should call displayExecutionWithServer with the 2 different messages', async () => {
        const spy = spyOn(service, 'displayExecutionWithServer');
        gameServiceSpy.exchangeLetters = jasmine.createSpy('exchangeLettersSpy').and.returnValue(ErrorType.NoError);
        gameServiceSpy.game.gameMode = GameType.MultiPlayer;
        const command = new ExchangeCmd(defaultParams, 'letter');
        const expectedMessages = new Array<ChatDisplayEntry>();
        expectedMessages.push({ color: ChatEntryColor.LocalPlayer, message: 'Local Player Name >> !échanger letter' });
        expectedMessages.push({ color: ChatEntryColor.LocalPlayer, message: 'Local Player Name >> !échanger 6 lettre(s)' });
        return service.executeCommand(command).then(() => {
            expect(spy).toHaveBeenCalledWith(true, { isExecuted: true, executionMessages: expectedMessages });
        });
    });

    it('should not display message with server if solo game mode', async () => {
        const spyServerDisplayChat = spyOn(service, 'displayExecutionWithServer').and.callThrough();
        const spyLocalDisplayChat = spyOn(service, 'displayExecutionLocally').and.callThrough();
        gameServiceSpy.place = jasmine.createSpy('place').and.returnValue(ErrorType.NoError);
        const placeParams = { position: new Vec2(), orientation: Axis.H, word: '' };
        const placeCmd = new PlaceCmd(defaultParams, placeParams);
        await service.executeCommand(placeCmd);
        expect(spyServerDisplayChat).toHaveBeenCalledTimes(0);
        expect(spyLocalDisplayChat).toHaveBeenCalledTimes(1);
    });

    it('should not display message on both clients if the command execution failed', async () => {
        const spyServerDisplayChat = spyOn(service, 'displayExecutionWithServer').and.callThrough();
        const spyLocalDisplayChat = spyOn(service, 'displayExecutionLocally').and.callThrough();
        gameServiceSpy.place = jasmine.createSpy('place').and.returnValue(ErrorType.ImpossibleCommand);
        gameServiceSpy.game.gameMode = GameType.MultiPlayer;
        const placeParams = { position: new Vec2(), orientation: Axis.H, word: '' };
        const placeCmd = new PlaceCmd(defaultParams, placeParams);
        await service.executeCommand(placeCmd);
        expect(spyServerDisplayChat).toHaveBeenCalledTimes(0);
        expect(spyLocalDisplayChat).toHaveBeenCalledTimes(1);
    });

    it('should  only display message on both clients for place, pass and exchange commands', async () => {
        const spyServerDisplayChat = spyOn(service, 'displayExecutionWithServer').and.callThrough();
        const spyLocalDisplayChat = spyOn(service, 'displayExecutionLocally').and.callThrough();
        gameServiceSpy.place = jasmine.createSpy('place').and.returnValue(ErrorType.NoError);
        gameServiceSpy.exchangeLetters = jasmine.createSpy('place').and.returnValue(ErrorType.NoError);
        gameServiceSpy.passTurn = jasmine.createSpy('passTurnSpy').and.returnValue(ErrorType.NoError);
        gameServiceSpy.place = jasmine.createSpy('place').and.returnValue(ErrorType.NoError);
        chatDisplayServiceSpy.invertDebugState = jasmine.createSpy('debutSpy').and.returnValue(ErrorType.NoError);

        gameServiceSpy.game.gameMode = GameType.MultiPlayer;
        const placeParams = { position: new Vec2(), orientation: Axis.H, word: '' };
        const placeCommand = new PlaceCmd(defaultParams, placeParams);
        const passCommand = new PassTurnCmd(defaultParams);
        const exchangeCommand = new ExchangeCmd(defaultParams, 'letter');
        defaultParams.serviceCalled = chatDisplayServiceSpy;
        const debugCommand = new HelpCmd(defaultParams);
        const helpCommand = new HelpCmd(defaultParams);
        const stockCommand = new StockCmd(defaultParams, 'letters stock');

        await service.executeCommand(placeCommand);
        await service.executeCommand(passCommand);
        await service.executeCommand(exchangeCommand);
        await service.executeCommand(debugCommand);
        await service.executeCommand(helpCommand);
        await service.executeCommand(stockCommand);

        expect(spyServerDisplayChat).toHaveBeenCalledTimes(3);
        expect(spyLocalDisplayChat).toHaveBeenCalledTimes(3);
    });

    it('exchange command should only display the local message in solo game mode', async () => {
        const spy = spyOn(chatDisplayServiceSpy, 'addEntry');
        gameServiceSpy.exchangeLetters = jasmine.createSpy('exchangeLettersSpy').and.returnValue(ErrorType.NoError);
        const command = new ExchangeCmd(defaultParams, 'letter');
        const expectedMessage = { color: ChatEntryColor.LocalPlayer, message: 'Local Player Name >> !échanger letter' };
        return service.executeCommand(command).then(() => {
            expect(spy).toHaveBeenCalledWith(expectedMessage);
        });
    });

    it('virtual player exchange command should not display the letters exchanged', async () => {
        const spy = spyOn(chatDisplayServiceSpy, 'addEntry');
        gameServiceSpy.exchangeLetters = jasmine.createSpy('exchangeLettersSpy').and.returnValue(ErrorType.NoError);
        gameServiceSpy.game.setOpponent(virtualPlayer);
        defaultParams.player = virtualPlayer;
        const command = new ExchangeCmd(defaultParams, 'letter');
        const expectedMessage = { color: ChatEntryColor.RemotePlayer, message: 'Virtual Player Name >> !échanger 6 lettre(s)' };
        return service.executeCommand(command).then(() => {
            expect(spy).toHaveBeenCalledWith(expectedMessage);
        });
    });

    // TODO: add the vp debug message test after merge with vp branch
});
