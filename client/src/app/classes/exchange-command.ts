import { GameService } from '@app/services/game.service';
import { ChatDisplayEntry, createErrorEntry, createPlayerEntry } from './chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class ExchangeCmd extends Command {
    private gameService: GameService;
    private letters: string;

    constructor(defaultParams: DefaultCommandParams, letters: string) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as GameService;
        this.letters = letters;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.ExchangeCmd;
        const executionResult = this.gameService.currentGameService.exchangeLetters(this.player, this.letters);

        if (executionResult === ErrorType.ImpossibleCommand) {
            const commandAndLetters = commandMessage + ' ' + this.letters;
            executionMessages.push(createErrorEntry(executionResult, commandAndLetters));
        } else {
            this.isExecuted = true;
            const localPlayerName = this.gameService.currentGameService.game.creatorPlayer.name;
            const isFromLocalPLayer = this.player.name === localPlayerName;
            const lettersMessageLocal = this.createExchangeMessage(isFromLocalPLayer, this.letters);
            const lettersMessageRemote = this.createExchangeMessage(!isFromLocalPLayer, this.letters);
            const executionMessageLocal = commandMessage + ' ' + lettersMessageLocal;
            const executionMessageRemote = commandMessage + ' ' + lettersMessageRemote;
            executionMessages.push(createPlayerEntry(isFromLocalPLayer, this.player.name, executionMessageLocal));
            executionMessages.push(createPlayerEntry(!isFromLocalPLayer, this.player.name, executionMessageRemote));
        }
        return { isExecuted: this.isExecuted, executionMessages };
    }

    createExchangeMessage(isFromLocalPLayer: boolean, letters: string): string {
        if (isFromLocalPLayer) {
            return letters;
        } else {
            const lettersNum = letters.length.toString();
            return lettersNum + ' lettre(s)';
        }
    }
}

export const createExchangeCmd = (params: { defaultParams: DefaultCommandParams; specificParams: string }): ExchangeCmd => {
    return new ExchangeCmd(params.defaultParams, params.specificParams);
};
