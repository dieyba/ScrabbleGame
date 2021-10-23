import { ErrorType, ERROR_MESSAGES } from '@app/classes/errors';
const SYSTEM_NAME = 'Système';
const DEBUG_PRE_MESSAGE = '[Debug] ';

export interface ChatDisplayEntry {
    color: ChatEntryColor;
    message: string;
}

export enum ChatEntryColor {
    SystemColor = 'black',
    LocalPlayer = 'blue',
    RemotePlayer = 'red',
}

export const createPlayerEntry = ( isFromLocalPlayer: boolean, playerName: string, message: string): ChatDisplayEntry => {
    const playerMessage = playerName + ' >> ' + message;
    const playerEntry = {
        color: isFromLocalPlayer ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer,
        message: playerMessage,
    };
    return playerEntry;
}

export const createSystemEntry = (message: string): ChatDisplayEntry => {
    const systemMessage = SYSTEM_NAME + ' >> ' + message;
    const systemEntry = {
        color: ChatEntryColor.SystemColor,
        message: systemMessage,
    };
    return systemEntry;
}

export const createErrorEntry = (errorType: ErrorType, commandInput: string): ChatDisplayEntry => {
    const error = ERROR_MESSAGES.get(errorType) as string;
    const errorAndInput = error + ': ' + commandInput;
    return createSystemEntry(errorAndInput);
}

export const createDebugEntry = (message: string): ChatDisplayEntry => {
    const debugMessage = DEBUG_PRE_MESSAGE + message;
    const debugEntry = {
        color: ChatEntryColor.SystemColor,
        message: debugMessage,
    };
    return debugEntry;
}