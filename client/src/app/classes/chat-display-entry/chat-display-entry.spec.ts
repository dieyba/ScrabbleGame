import { ErrorType, ERROR_MESSAGES } from '../errors';
import * as ChatEntryClass from './chat-display-entry';

const IS_LOCAL_PLAYER = true;
const SYSTEM_NAME = 'Système';
const DEBUG_PRE_MESSAGE = '[Debug] ';

describe('ChatDisplayEntry', () => {
    it('should create local player entry', () => {
        const messageInput = 'some local player message';
        const name = 'Local Player';
        const expectMessage = name + ' >> ' + messageInput;
        const expectedResult = { color: ChatEntryClass.ChatEntryColor.LocalPlayer, message: expectMessage };
        expect(ChatEntryClass.createPlayerEntry(IS_LOCAL_PLAYER, name, messageInput)).toEqual(expectedResult);
    });
    it('should create remote player entry', () => {
        const messageInput = 'some opponent player message';
        const name = 'Opponent Player';
        const expectMessage = name + ' >> ' + messageInput;
        const expectedResult = { color: ChatEntryClass.ChatEntryColor.RemotePlayer, message: expectMessage };
        expect(ChatEntryClass.createPlayerEntry(!IS_LOCAL_PLAYER, name, messageInput)).toEqual(expectedResult);
    });
    it('should create system entry', () => {
        const messageInput = 'some system message';
        const expectMessage = SYSTEM_NAME + ' >> ' + messageInput;
        const expectedResult = { color: ChatEntryClass.ChatEntryColor.SystemColor, message: expectMessage };
        expect(ChatEntryClass.createSystemEntry(messageInput)).toEqual(expectedResult);
    });
    it('should create debug entry', () => {
        const messageInput = 'some debug message';
        const expectMessage = DEBUG_PRE_MESSAGE + messageInput;
        const expectedResult = { color: ChatEntryClass.ChatEntryColor.SystemColor, message: expectMessage };
        expect(ChatEntryClass.createDebugEntry(messageInput)).toEqual(expectedResult);
    });
    it('should create error message entry', () => {
        const errorType = ErrorType.InvalidCommand;
        const commandInput = '!not a command';
        const expectMessage = SYSTEM_NAME + ' >> ' + ERROR_MESSAGES.get(errorType) + ': ' + commandInput;
        const expectedResult = { color: ChatEntryClass.ChatEntryColor.SystemColor, message: expectMessage };
        expect(ChatEntryClass.createErrorEntry(errorType, commandInput)).toEqual(expectedResult);
    });
});
