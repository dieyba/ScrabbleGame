// import { TestBed } from '@angular/core/testing';
// import { ErrorType } from '@app/classes/errors';
// import { GameParameters } from '@app/classes/game-parameters';
// import { LocalPlayer } from '@app/classes/local-player';
// import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
// import { ChatDisplayService } from './chat-display.service';
// import { SoloGameService } from './solo-game.service';
// import { TextEntryService } from './text-entry.service';
// import { Vec2 } from '@app/classes/vec2';

// const LOCAL_PLAYER_NAME = 'Local Player';
// const VIRTUAL_PLAYER_NAME = 'Virtual Player';
// const IS_LOCAL_PLAYER = true;

// /* eslint-disable  @typescript-eslint/no-magic-numbers */
// describe('TextEntryService', () => {
//     let service: TextEntryService;
//     let chatDisplayServiceSpy: jasmine.SpyObj<ChatDisplayService>;
//     let gameServiceSpy: jasmine.SpyObj<SoloGameService>;

//     beforeEach(() => {
//         chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', [
//             'addPlayerEntry',
//             'addErrorMessage',
//             'createExchangeMessage',
//             'invertDebugState',
//         ]);
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['exchangeLetters', 'place', 'passTurn']);
//         TestBed.configureTestingModule({
//             providers: [
//                 { provide: SoloGameService, useValue: gameServiceSpy },
//                 { provide: ChatDisplayService, useValue: chatDisplayServiceSpy },
//             ],
//         });
//         service = TestBed.inject(TextEntryService);
//         gameServiceSpy.game = new GameParameters(LOCAL_PLAYER_NAME, 60);
//         gameServiceSpy.game.creatorPlayer = new LocalPlayer(LOCAL_PLAYER_NAME);
//         gameServiceSpy.game.opponentPlayer = new VirtualPlayer(VIRTUAL_PLAYER_NAME, Difficulty.Easy);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('should send ! starting input to createCommand', () => {
//         const spy = spyOn(service, 'createCommand').and.callThrough();
//         const fakeCommand = '!fake command name';
//         service.handleInput(fakeCommand, IS_LOCAL_PLAYER);
//         expect(spy).toHaveBeenCalledWith(fakeCommand, gameServiceSpy.game.creatorPlayer);
//     });

//     it('should send input as normal chat message', () => {
//         const chatMessage = 'not a command';
//         service.handleInput(chatMessage, IS_LOCAL_PLAYER);
//         expect(chatDisplayServiceSpy.addEntry).toHaveBeenCalled();
//     });

//     it('should display successful command message', () => {
//         const validCmd = '!debug';
//         chatDisplayServiceSpy.invertDebugState.and.callThrough();
//         service.handleInput(validCmd, IS_LOCAL_PLAYER);
//         expect(chatDisplayServiceSpy.addEntry).toHaveBeenCalled();
//     });

//     it('should create and display local exchange command message', () => {
//         const validExchangeCmd = '!échanger lettres';

//         gameServiceSpy.exchangeLetters.and.returnValue(ErrorType.NoError);
//         chatDisplayServiceSpy.createExchangeMessage.and.returnValue(validExchangeCmd);

//         service.handleInput(validExchangeCmd, IS_LOCAL_PLAYER);
//         expect(chatDisplayServiceSpy.createExchangeMessage).toHaveBeenCalledWith(IS_LOCAL_PLAYER, validExchangeCmd);
//         expect(chatDisplayServiceSpy.addPlayerEntry).toHaveBeenCalledWith(IS_LOCAL_PLAYER, LOCAL_PLAYER_NAME, validExchangeCmd);
//     });

//     it('should create and display remote exchange command message', () => {
//         const validExchangeCmd = '!échanger lettres';
//         const exchangeMessage = '!échanger 7 lettre(s)';

//         gameServiceSpy.exchangeLetters.and.returnValue(ErrorType.NoError);
//         chatDisplayServiceSpy.createExchangeMessage.and.returnValue(exchangeMessage);

//         service.handleInput(validExchangeCmd, !IS_LOCAL_PLAYER);
//         expect(chatDisplayServiceSpy.createExchangeMessage).toHaveBeenCalledWith(!IS_LOCAL_PLAYER, validExchangeCmd);
//         expect(chatDisplayServiceSpy.addPlayerEntry).toHaveBeenCalledWith(!IS_LOCAL_PLAYER, VIRTUAL_PLAYER_NAME, exchangeMessage);
//     });

//     it('should send invalid command error message when needed', () => {
//         chatDisplayServiceSpy.invertDebugState.and.returnValue(ErrorType.NoError);
//         gameServiceSpy.exchangeLetters.and.returnValue(ErrorType.NoError);
//         gameServiceSpy.place.and.returnValue(ErrorType.NoError);
//         gameServiceSpy.passTurn.and.returnValue(ErrorType.NoError);

//         // Having spaces before the ! or after the command input should not be an error of any type
//         const validNameCmds = [' !debug ', '!debug', '!passer', '!échanger z', '!placer b5v mot'];
//         // empty string is already prevented by checking if the string is empty beforehand
//         const invalidCmds = ['!', '! debug', '!random name', '!echanger', '!123'];

//         for (const input of validNameCmds) {
//             service.handleInput(input, IS_LOCAL_PLAYER);
//             expect(chatDisplayServiceSpy.addPlayerEntry).toHaveBeenCalled();
//         }

//         for (const input of invalidCmds) {
//             service.handleInput(input, IS_LOCAL_PLAYER);
//             expect(chatDisplayServiceSpy.addErrorMessage).toHaveBeenCalledWith(ErrorType.InvalidCommand, input);
//         }
//     });

//     it('should send invalid syntax error message when needed', () => {
//         chatDisplayServiceSpy.invertDebugState.and.returnValue(ErrorType.NoError);
//         gameServiceSpy.exchangeLetters.and.returnValue(ErrorType.NoError);
//         gameServiceSpy.place.and.returnValue(ErrorType.NoError);
//         gameServiceSpy.passTurn.and.returnValue(ErrorType.NoError);

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
//             service.handleInput(input, IS_LOCAL_PLAYER);
//             expect(chatDisplayServiceSpy.addPlayerEntry).toHaveBeenCalled();
//         }

//         for (const input of syntaxErrorCmds) {
//             service.handleInput(input, IS_LOCAL_PLAYER);
//             expect(chatDisplayServiceSpy.addErrorMessage).toHaveBeenCalledWith(ErrorType.SyntaxError, input);
//         }
//     });

//     it('should send impossible command error message when execution returns it', () => {
//         gameServiceSpy.exchangeLetters.and.returnValue(ErrorType.ImpossibleCommand);
//         const cmd = '!échanger aaa';
//         service.handleInput(cmd, IS_LOCAL_PLAYER);
//         expect(chatDisplayServiceSpy.addErrorMessage).toHaveBeenCalledWith(ErrorType.ImpossibleCommand, cmd);
//     });

//     it('should return false when it is not a valid letter', () => {
//         // this method isValidLetter does not return true for accents or asterisks
//         const validLetters = ['A', 'a', 'Z', 'z'];
//         const invalidLetters = ['       ', '', 'é', 'あ', 'ç', 'œ'];
//         for (const input of validLetters) {
//             const isValid = service.isValidWordInput(input);
//             expect(isValid).toEqual(true);
//         }
//         for (const input of invalidLetters) {
//             const isValid = service.isValidWordInput(input);
//             expect(isValid).toEqual(false);
//         }
//         const isValidLetter = service.isValidLetter('');
//         expect(isValidLetter).toEqual(false);
//     });

//     // // the rest of the this method is tested when being called in createCommand method
//     it('should split an input only if it starts with !', () => {
//         const emptyString = service.splitCommandInput('');
//         expect(emptyString).toEqual([]);
//         const notACommand = service.splitCommandInput('not a command');
//         expect(notACommand).toEqual([]);
//     });

//     it('should return coordinates from 0 to 14 for valid row and column', () => {
//         const invalidRows = ['A', 'P', '', '01', '0000001'];
//         const invalidCols = ['0', '16', '0x01']; // columns on the board from 1 to 15
//         const validRow = 'a';
//         const validCol = '1';
//         for (const invalidRow of invalidRows) {
//             const coordinates = service.convertToCoordinates(invalidRow, validCol);
//             expect(coordinates).toEqual(undefined);
//         }
//         for (const invalidCol of invalidCols) {
//             const coordinates = service.convertToCoordinates(validRow, invalidCol);
//             expect(coordinates).toEqual(undefined);
//         }
//         const validCoordinates = service.convertToCoordinates(validRow, validCol) as Vec2;
//         expect(validCoordinates.x).toEqual(0);
//         expect(validCoordinates.y).toEqual(0);
//     });
// });
