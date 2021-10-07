import { TestBed } from '@angular/core/testing';
import { ErrorType } from '@app/classes/errors';
import { LocalPlayer } from '@app/classes/local-player';
import { Vec2 } from '@app/classes/vec2';
import { PlayerType, VirtualPlayer } from '@app/classes/virtual-player';
import { BonusService } from './bonus.service';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';
import { TextEntryService } from './text-entry.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

const LOCAL_PLAYER_NAME = 'Local Player';
const VIRTUAL_PLAYER_NAME = 'Virtual Player';

/* eslint-disable  @typescript-eslint/no-explicit-any */
describe('TextEntryService', () => {
    let service: TextEntryService;
    const rack = new RackService();
    const grid = new GridService();
    const bonus = new BonusService(grid);
    const validation = new ValidationService(grid, bonus);
    const wordBuilder = new WordBuilderService();
    const chatDisplayService = new ChatDisplayService();
    const soloGameService = new SoloGameService(grid, rack, chatDisplayService, validation, wordBuilder);
    const IS_FROM_LOCAL_PLAYER = true;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SoloGameService, useValue: soloGameService },
                { provide: ChatDisplayService, useValue: chatDisplayService },
            ],
        });

        service = TestBed.inject(TextEntryService);
        soloGameService.localPlayer = new LocalPlayer(LOCAL_PLAYER_NAME);
        soloGameService.virtualPlayer = new VirtualPlayer(VIRTUAL_PLAYER_NAME, PlayerType.Easy);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send ! starting input to createCommand', () => {
        const spy = spyOn<any>(service, 'createCommand').and.callThrough();
        const fakeCommand = '!fake command name';

        service.handleInput(fakeCommand, IS_FROM_LOCAL_PLAYER);
        expect(spy).toHaveBeenCalledWith(fakeCommand, soloGameService.localPlayer);
    });

    it('should send input as normal chat message', () => {
        const spy = spyOn<any>(chatDisplayService, 'addPlayerEntry').and.callThrough();
        const chatMessage = 'not a command';

        service.handleInput(chatMessage, IS_FROM_LOCAL_PLAYER);
        expect(spy).toHaveBeenCalledWith(IS_FROM_LOCAL_PLAYER, LOCAL_PLAYER_NAME, chatMessage);
    });

    it('should call display success message method(s)', () => {
        const successMessageSpy = spyOn<any>(chatDisplayService, 'addPlayerEntry').and.callThrough();
        const exchangeMessageSpy = spyOn<any>(chatDisplayService, 'createExchangeMessage').and.callThrough();

        spyOn<any>(chatDisplayService, 'invertDebugState').and.returnValue(ErrorType.NoError);
        spyOn<any>(soloGameService, 'exchangeLetters').and.returnValue(ErrorType.NoError);

        const validCmd = '!debug';
        const validExchangeCmd = '!échanger lettres';

        service.handleInput(validCmd, IS_FROM_LOCAL_PLAYER);
        expect(successMessageSpy).toHaveBeenCalledWith(IS_FROM_LOCAL_PLAYER, LOCAL_PLAYER_NAME, validCmd);

        service.handleInput(validExchangeCmd, IS_FROM_LOCAL_PLAYER);
        expect(exchangeMessageSpy).toHaveBeenCalledWith(IS_FROM_LOCAL_PLAYER, validExchangeCmd);
        expect(successMessageSpy).toHaveBeenCalled();

        service.handleInput(validExchangeCmd, !IS_FROM_LOCAL_PLAYER);
        expect(exchangeMessageSpy).toHaveBeenCalledWith(!IS_FROM_LOCAL_PLAYER, validExchangeCmd);
        expect(successMessageSpy).toHaveBeenCalledWith(!IS_FROM_LOCAL_PLAYER, VIRTUAL_PLAYER_NAME, '!échanger 7 lettre(s)');
    });

    it('should send invalid command error message when needed', () => {
        const successMessageSpy = spyOn<any>(chatDisplayService, 'addPlayerEntry').and.callThrough();
        const errorSpy = spyOn<any>(chatDisplayService, 'addErrorMessage').and.callThrough();

        spyOn<any>(chatDisplayService, 'invertDebugState').and.returnValue(ErrorType.NoError);
        spyOn<any>(soloGameService, 'exchangeLetters').and.returnValue(ErrorType.NoError);
        spyOn<any>(soloGameService, 'place').and.returnValue(ErrorType.NoError);
        spyOn<any>(soloGameService, 'passTurn').and.returnValue(ErrorType.NoError);

        // Having spaces before the ! or after the command input should not be an error of any type
        const validNameCmds = [' !debug ', '!debug', '!passer', '!échanger z', '!placer b5v mot'];
        // empty string is already prevented by checking if the string is empty beforehand
        const invalidCmds = ['!', '! debug', '!random name', '!echanger', '!123'];

        for (const input of validNameCmds) {
            service.handleInput(input, IS_FROM_LOCAL_PLAYER);
            expect(successMessageSpy).toHaveBeenCalled();
        }

        for (const input of invalidCmds) {
            service.handleInput(input, IS_FROM_LOCAL_PLAYER);
            expect(errorSpy).toHaveBeenCalledWith(ErrorType.InvalidCommand, input);
        }
    });

    it('should send invalid syntax error message when needed', () => {
        const successMessageSpy = spyOn<any>(chatDisplayService, 'addPlayerEntry').and.callThrough();
        const errorSpy = spyOn<any>(chatDisplayService, 'addErrorMessage').and.callThrough();

        spyOn<any>(chatDisplayService, 'invertDebugState').and.returnValue(ErrorType.NoError);
        spyOn<any>(soloGameService, 'exchangeLetters').and.returnValue(ErrorType.NoError);
        spyOn<any>(soloGameService, 'place').and.returnValue(ErrorType.NoError);
        spyOn<any>(soloGameService, 'passTurn').and.returnValue(ErrorType.NoError);

        // '!debug' and '!passer' already checked
        const validSyntaxCmds = ['!échanger abcde*g', '!placer a1h garçon', '!placer o15v ÉLÉPHANT'];
        const syntaxErrorCmds = [
            '!debug bugs',
            '!passer tour',
            '!échanger',
            '!échanger abcdefgh',
            '!échanger ééé',
            '!échanger A',
            '!échanger 1',
            '!échanger ^',
            '!placer p5h mot',
            '!placer aah mot',
            '!placer à1h',
            '!placer A1h',
            '!placer a1H',
            '!placer a5a mot',
            '!placer a5h',
            '!placer a10v *',
            '!placer d5v mot mot',
            '!placer i10h 123',
            '!placer a31416h something',
            '!placer a5V nothing',
        ];

        for (const input of validSyntaxCmds) {
            service.handleInput(input, IS_FROM_LOCAL_PLAYER);
            expect(successMessageSpy).toHaveBeenCalled();
        }

        for (const input of syntaxErrorCmds) {
            service.handleInput(input, IS_FROM_LOCAL_PLAYER);
            expect(errorSpy).toHaveBeenCalledWith(ErrorType.SyntaxError, input);
        }
    });

    it('should send impossible command error message when execution returns it', () => {
        spyOn<any>(soloGameService, 'exchangeLetters').and.returnValue(ErrorType.ImpossibleCommand);
        const errorSpy = spyOn<any>(chatDisplayService, 'addErrorMessage').and.callThrough();
        const cmd = '!échanger aaa';

        service.handleInput(cmd, IS_FROM_LOCAL_PLAYER);
        expect(errorSpy).toHaveBeenCalledWith(ErrorType.ImpossibleCommand, cmd);
    });

    it('should return false when it is not a valid letter', () => {
        // this method isValidLetter does not return true for accents or asterisks
        const validLetters = ['A', 'a', 'Z', 'z'];
        const invalidLetters = ['       ', '', 'é', 'あ', 'ç', 'œ'];
        for (const input of validLetters) {
            const isValid = service.isValidWordInput(input);
            expect(isValid).toEqual(true);
        }
        for (const input of invalidLetters) {
            const isValid = service.isValidWordInput(input);
            expect(isValid).toEqual(false);
        }
        const isValidLetter = service.isValidLetter('');
        expect(isValidLetter).toEqual(false);
    });

    // the rest of the this method is tested when being called in createCommand method
    it('should split an input only if it starts with !', () => {
        const emptyString = service.splitCommandInput('');
        expect(emptyString).toEqual([]);
        const notACommand = service.splitCommandInput('not a command');
        expect(notACommand).toEqual([]);
    });

    it('should return coordinates from 0 to 14 for valid row and column', () => {
        const invalidRows = ['A', 'P', '', '01', '0000001'];
        const invalidCols = ['0', '16', '0x01']; // columns on the board from 1 to 15
        const validRow = 'a';
        const validCol = '1';
        for (const invalidRow of invalidRows) {
            const coordinates = service.convertToCoordinates(invalidRow, validCol);
            expect(coordinates).toEqual(undefined);
        }
        for (const invalidCol of invalidCols) {
            const coordinates = service.convertToCoordinates(validRow, invalidCol);
            expect(coordinates).toEqual(undefined);
        }
        const validCoordinates = service.convertToCoordinates(validRow, validCol) as Vec2;
        expect(validCoordinates.x).toEqual(0);
        expect(validCoordinates.y).toEqual(0);
    });
});
