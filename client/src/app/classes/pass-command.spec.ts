// import { TestBed } from '@angular/core/testing';
// import { createPassCmd, PassTurnCmd } from '@app/classes/pass-command';
// import { GameService } from '@app/services/game.service';
// import { SoloGameService } from '@app/services/solo-game.service';
// import { ChatEntryColor, createErrorEntry } from './chat-display-entry';
// import { DefaultCommandParams } from './commands';
// import { ErrorType } from './errors';
// import { GameParameters, GameType } from './game-parameters';

// const PLAYER_NAME = 'Sara';
// const OPPONENT_NAME = 'Not Sara';

// describe('PassTurnCmd', () => {
//     let gameServiceSpy: jasmine.SpyObj<GameService>;
//     let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;
//     const localPlayer = new LocalPlayer(PLAYER_NAME);
//     const opponentPlayer = new LocalPlayer(OPPONENT_NAME);

//     beforeEach(() => {
//         soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['passTurn']);
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['initializeGameType']);

//         TestBed.configureTestingModule({
//             providers: [
//                 { provide: GameService, useValue: gameServiceSpy },
//                 { provide: SoloGameService, useValue: soloGameServiceSpy },
//             ],
//         });
//         gameServiceSpy.currentGameService = soloGameServiceSpy;
//         gameServiceSpy.currentGameService.passTurn = soloGameServiceSpy.passTurn;
//         gameServiceSpy.currentGameService.game = new GameParameters(LocalPlayer.name, 0, false);
//         gameServiceSpy.currentGameService.game.localPlayer = localPlayer;
//         gameServiceSpy.currentGameService.game.opponentPlayer = opponentPlayer;
//     });

//     it('should create an instance', () => {
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const pass = new PassTurnCmd(defaultParams);
//         expect(pass).toBeTruthy();
//     });

//     it('should call passTurn from solo game service', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const pass = new PassTurnCmd(defaultParams);
//         pass.execute();
//         expect(gameServiceSpy.currentGameService.passTurn).toHaveBeenCalled();
//     });

//     it('should execute and return successful command message from local player', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         soloGameServiceSpy.passTurn.and.returnValue(ErrorType.NoError);
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const commandEntry = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !passer' };
//         const pass = new PassTurnCmd(defaultParams);
//         pass.player.isActive = true;
//         expect(pass.execute()).toEqual({ isExecuted: true, executionMessages: [commandEntry] });
//     });

//     it('should execute and return impossible command error from local player', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         soloGameServiceSpy.passTurn.and.returnValue(ErrorType.ImpossibleCommand);
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         const errorMessage = createErrorEntry(ErrorType.ImpossibleCommand, '!passer');
//         const pass = new PassTurnCmd(defaultParams);
//         pass.player.isActive = false;
//         expect(pass.execute()).toEqual({ isExecuted: false, executionMessages: [errorMessage] });
//     });
//     it('should execute and return successful command message from opponent player', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         soloGameServiceSpy.passTurn.and.returnValue(ErrorType.NoError);
//         const defaultParams: DefaultCommandParams = { player: opponentPlayer, serviceCalled: gameServiceSpy };
//         const commandEntry = { color: ChatEntryColor.RemotePlayer, message: OPPONENT_NAME + ' >> !passer' };
//         const pass = new PassTurnCmd(defaultParams);
//         pass.player.isActive = true;
//         expect(pass.execute()).toEqual({ isExecuted: true, executionMessages: [commandEntry] });
//     });

//     it('should execute and return impossible command error from opponent player', () => {
//         gameServiceSpy.initializeGameType(GameType.Solo);
//         soloGameServiceSpy.passTurn.and.returnValue(ErrorType.ImpossibleCommand);
//         const defaultParams: DefaultCommandParams = { player: opponentPlayer, serviceCalled: gameServiceSpy };
//         const errorMessage = createErrorEntry(ErrorType.ImpossibleCommand, '!passer');
//         const pass = new PassTurnCmd(defaultParams);
//         pass.player.isActive = false;
//         expect(pass.execute()).toEqual({ isExecuted: false, executionMessages: [errorMessage] });
//     });

//     it('createDebugCmd should create an instance', () => {
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
//         expect(createPassCmd(defaultParams)).toBeTruthy();
//     });
// });
