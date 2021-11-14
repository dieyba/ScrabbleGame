// import { TestBed } from '@angular/core/testing';
// import { createErrorEntry } from '@app/classes/chat-display-entry';
// import { ErrorType } from '@app/classes/errors';
// import { GameParameters } from '@app/classes/game-parameters';
// import { Player } from "@app/classes/player";
// import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
// import { ChatDisplayService } from './chat-display.service';
// import { CommandInvokerService } from './command-invoker.service';
// import { GameService } from './game.service';
// import { SoloGameService } from './solo-game.service';
// import { TextEntryService } from './text-entry.service';

// const LOCAL_PLAYER_NAME = 'Local Player';
// const VIRTUAL_PLAYER_NAME = 'Virtual Player';

// TODO: finish text entry tests

// /* eslint-disable  @typescript-eslint/no-magic-numbers */
// describe('TextEntryService', () => {
//     let service: TextEntryService;
//     let chatDisplayServiceSpy: jasmine.SpyObj<ChatDisplayService>;
//     let commandInvokerServiceSpy: jasmine.SpyObj<CommandInvokerService>;
//     let gameServiceSpy: jasmine.SpyObj<GameService>;
//     let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;
//     const localPlayer = new LocalPlayer(LOCAL_PLAYER_NAME);

//     beforeEach(() => {
//         chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', [
//             'addPlayerEntry',
//             'addErrorMessage',
//             'createExchangeMessage',
//             'invertDebugState',
//         ]);
//         soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['place']);
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['passTurn']);
//         commandInvokerServiceSpy = jasmine.createSpyObj('GameService', ['executeCommand']);
//         TestBed.configureTestingModule({
//             providers: [
//                 { provide: CommandInvokerService, useValue: commandInvokerServiceSpy },
//                 { provide: ChatDisplayService, useValue: chatDisplayServiceSpy },
//                 { provide: SoloGameService, useValue: soloGameServiceSpy },
//                 { provide: GameService, useValue: gameServiceSpy },
//             ],
//         });
//         service = TestBed.inject(TextEntryService);
//         gameServiceSpy.currentGameService = soloGameServiceSpy;
//         gameServiceSpy.currentGameService.game = new GameParameters(LOCAL_PLAYER_NAME, 60, false);
//         gameServiceSpy.isMultiplayerGame = false;
//         gameServiceSpy.currentGameService.game.isEndGame = false;
//         gameServiceSpy.currentGameService.game.localPlayer = localPlayer;
//         gameServiceSpy.currentGameService.game.opponentPlayer = new VirtualPlayer(VIRTUAL_PLAYER_NAME, Difficulty.Easy);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('should send ! starting input to createCommand', () => {
//         const spy = spyOn(service, 'createCommand').and.callThrough();
//         const fakeCommand = '!fake command name';
//         service.handleInput(fakeCommand);
//         expect(spy).toHaveBeenCalledWith(fakeCommand, localPlayer);
//     });

//     it('should send input as normal chat message', () => {
//         const chatMessage = 'not a command';
//         service.handleInput(chatMessage);
//         expect(chatDisplayServiceSpy.addEntry).toHaveBeenCalled();
//     });

//     it('should display call command invoker with new command', () => {
//         const validCmd = '!debug';
//         service.handleInput(validCmd);
//         expect(commandInvokerServiceSpy.executeCommand).toHaveBeenCalled();
//     });

//     it('should send invalid command error message when needed', () => {
//         // Having spaces before the ! or after the command input should not be an error of any type
//         const validNameCmds = [' !debug ', '!debug', '!passer', '!échanger z', '!placer b5v mot'];
//         // empty string is already prevented by checking if the string is empty beforehand
//         const invalidCmds = ['!', '! debug', '!random name', '!echanger', '!123'];

//         for (const input of validNameCmds) {
//             service.handleInput(input);
//             expect(commandInvokerServiceSpy.executeCommand).toHaveBeenCalled();
//         }

//         for (const input of invalidCmds) {
//             service.handleInput(input);
//             expect(createErrorEntry).toHaveBeenCalledWith(ErrorType.InvalidCommand, input);
//         }
//     });

//     it('should send invalid syntax error message when needed', () => {
//         // '!debug' and '!passer' already checked
//         const validSyntaxCmds = ['!échanger abcde*g', '!placer a1h garçon', '!placer o15v ÉLÉPHANT'];
//         const syntaxErrorCmds = [
//             '!debug bugs',
//             '!passer tour',
//             '!échanger',
//             '!échanger abcdefgh',
//             '!échanger ééé',
//             '!échanger A',
//             '!échanger 1',
//             '!échanger ^',
//             '!placer p5h mot',
//             '!placer aah mot',
//             '!placer à1h',
//             '!placer A1h',
//             '!placer a1H',
//             '!placer a5a mot',
//             '!placer a5h',
//             '!placer a10v *',
//             '!placer d5v mot mot',
//             '!placer i10h 123',
//             '!placer a31416h something',
//             '!placer a5V nothing',
//         ];

//         for (const input of validSyntaxCmds) {
//             service.handleInput(input);
//             expect(commandInvokerServiceSpy.executeCommand).toHaveBeenCalled();
//         }

//         for (const input of syntaxErrorCmds) {
//             service.handleInput(input);
//             expect(createErrorEntry).toHaveBeenCalledWith(ErrorType.SyntaxError, input);
//         }
//     });

//     it('should send impossible command error message when execution returns it', () => {
//         const cmd = '!échanger aaa';
//         service.handleInput(cmd);
//         expect(createErrorEntry).toHaveBeenCalledWith(ErrorType.ImpossibleCommand, cmd);
//     });

//     // // the rest of the this method is tested when being called in createCommand method
//     it('should split an input only if it starts with !', () => {
//         const emptyString = service.splitCommandInput('');
//         expect(emptyString).toEqual([]);
//         const notACommand = service.splitCommandInput('not a command');
//         expect(notACommand).toEqual([]);
//     });
// });
