// import { TestBed } from '@angular/core/testing';
// import { createExchangeCmd, ExchangeCmd } from '@app/classes/exchange-command';
// import { GameService } from '@app/services/game.service';
// import { ChatEntryColor, createErrorEntry } from './chat-display-entry';
// import { DefaultCommandParams } from './commands';
// import { ErrorType } from './errors';
// import { GameParameters, GameType } from './game-parameters';
// import { Player } from './player';

// const PLAYER_NAME = 'Sara';
// const OPPONENT_NAME = 'Not Sara';
// const LETTERS = 'abcd';

// describe('ExchangeCmd', () => {
//     let gameServiceSpy: jasmine.SpyObj<GameService>;
//     let soloGameServiceSpy: jasmine.SpyObj<GameService>;
//     const localPlayer = new Player(PLAYER_NAME);
//     const opponentPlayer = new Player(OPPONENT_NAME);

//     beforeEach(() => {
//         soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['exchangeLetters']);
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['initializeGameType']);

//         TestBed.configureTestingModule({
//             providers: [
//                 { provide: GameService, useValue: gameServiceSpy },
//                 { provide: SoloGameService, useValue: soloGameServiceSpy },
//             ],
//         });
//         gameServiceSpy = soloGameServiceSpy;
//         gameServiceSpy.exchangeLetters = soloGameServiceSpy.exchangeLetters;
//         gameServiceSpy.game = new GameParameters();
//         gameServiceSpy.game.localPlayer = localPlayer;
//         gameServiceSpy.game.opponentPlayer = opponentPlayer;
//     });

//     it('should create an instance', () => {
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const exchange = new ExchangeCmd(defaultParams, LETTERS);
//         expect(exchange).toBeTruthy();
//     });

//     it('should call exchangeLetters from solo game service', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const exchange = new ExchangeCmd(defaultParams, LETTERS);
//         exchange.execute();
//         expect(gameServiceSpy.currentGameService.exchangeLetters).toHaveBeenCalled();
//     });

//     it('should create local exchange message', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const exchange = new ExchangeCmd(defaultParams, LETTERS);
//         expect(exchange.createExchangeMessage(true, LETTERS)).toEqual(LETTERS);
//     });

//     it('should create opponent exchange message', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const exchange = new ExchangeCmd(defaultParams, LETTERS);
//         expect(exchange.createExchangeMessage(false, LETTERS)).toEqual(LETTERS.length + ' lettre(s)');
//     });

//     it('should execute and return successful command message from local player', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         soloGameServiceSpy.exchangeLetters.and.returnValue(ErrorType.NoError);
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const localPlayerEntry = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !échanger ' + LETTERS };
//         const opponentPlayerEntry = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !échanger ' + LETTERS.length + ' lettre(s)' };
//         const exchange = new ExchangeCmd(defaultParams, LETTERS);
//         exchange.player.isActive = true;
//         expect(exchange.execute()).toEqual({ isExecuted: true, executionMessages: [localPlayerEntry, opponentPlayerEntry] });
//     });

//     it('should execute and return successful command message from opponent player', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         soloGameServiceSpy.exchangeLetters.and.returnValue(ErrorType.NoError);
//         const defaultParams: DefaultCommandParams = { player: opponentPlayer, serviceCalled: gameServiceSpy };
//         const localPlayerEntry = { color: ChatEntryColor.RemotePlayer, message: OPPONENT_NAME + ' >> !échanger ' + LETTERS };
//         const opponentPlayerEntry = {
// color: ChatEntryColor.RemotePlayer,
// message: OPPONENT_NAME + ' >> !échanger ' + LETTERS.length + ' lettre(s)' };
//         const exchange = new ExchangeCmd(defaultParams, LETTERS);
//         exchange.player.isActive = true;
//         expect(exchange.execute()).toEqual({ isExecuted: true, executionMessages: [opponentPlayerEntry, localPlayerEntry] });
//     });

//     it('should execute and return impossible command error', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         soloGameServiceSpy.exchangeLetters.and.returnValue(ErrorType.ImpossibleCommand);
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const errorMessage = createErrorEntry(ErrorType.ImpossibleCommand, '!échanger AAAAAAAA');
//         const exchange = new ExchangeCmd(defaultParams, 'AAAAAAAA');
//         exchange.player.isActive = false;
//         expect(exchange.execute()).toEqual({ isExecuted: false, executionMessages: [errorMessage] });
//     });

//     it('createExchangeCmd should create an instance', () => {
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         expect(createExchangeCmd({ defaultParams, specificParams: LETTERS })).toBeTruthy();
//     });
// });
