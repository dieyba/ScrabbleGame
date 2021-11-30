import { ChatDisplayService } from '@app/services/chat-display.service';
import { ChatDisplayEntry, ChatEntryColor, createErrorEntry, createPlayerEntry } from '../chat-display-entry/chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams } from '../commands/commands';
import { ErrorType } from '../errors';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const IS_LOCAL_PLAYER = true; // debug is always only displayed locally

export class StockCmd extends Command {
    chatDisplayService: ChatDisplayService;
    stockLetters: string;

    constructor(defaultParams: DefaultCommandParams, stockLetters: string) {
        super(defaultParams.player);
        this.chatDisplayService = defaultParams.serviceCalled as ChatDisplayService;
        this.stockLetters = stockLetters;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.StockCmd;
        const executionResult = this.createStockMessage(this.stockLetters);

        if (executionResult === ErrorType.ImpossibleCommand) {
            executionMessages.push(createErrorEntry(executionResult, commandMessage));
        } else {
            this.isExecuted = true;
            executionMessages.push(createPlayerEntry(IS_LOCAL_PLAYER, this.player.name, commandMessage));
            for (const message of executionResult) {
                executionMessages.push({ color: ChatEntryColor.SystemColor, message });
            }
        }
        return { isExecuted: this.isExecuted, executionMessages };
    }

    createStockMessage(stockLetters: string): ErrorType.ImpossibleCommand | string[] {
        if (this.chatDisplayService.isActiveDebug) {
            const letterCountMessages: string[] = [];
            for (const letter of ALPHABET) {
                const regExp = new RegExp(letter, 'g');
                const letterQuantity = (stockLetters.match(regExp) || []).length;
                letterCountMessages.push(letter + ' : ' + letterQuantity);
            }
            const asterisksQuantity = (stockLetters.match(/\*/g) || []).length;
            letterCountMessages.push('* : ' + asterisksQuantity);

            return letterCountMessages;
        }
        return ErrorType.ImpossibleCommand;
    }
}

export const createStockCmd = (params: { defaultParams: DefaultCommandParams; specificParams: string }): StockCmd => {
    return new StockCmd(params.defaultParams, params.specificParams);
};
