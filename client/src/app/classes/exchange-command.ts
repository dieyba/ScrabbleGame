import { MultiPlayerGameService } from '@app/services/multi-player-game.service';
import { ChatDisplayEntry, createErrorEntry, createPlayerEntry } from './chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class ExchangeCmd extends Command {
    private gameService: MultiPlayerGameService;
    private letters: string;

    constructor(defaultParams: DefaultCommandParams, letters: string) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as MultiPlayerGameService;
        this.letters = letters;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.ExchangeCmd;
        const executionResult = this.gameService.exchangeLetters(this.player, this.letters);

        if (executionResult === ErrorType.ImpossibleCommand) {
            const commandAndLetters = commandMessage + ' ' + this.letters;
            executionMessages.push(createErrorEntry(executionResult, commandAndLetters));
        } else {
            this.isExecuted = true;
            const localPlayerName = this.gameService.game.creatorPlayer.name;
            const isFromLocalPLayer = this.player.name === localPlayerName;
            const exchangeMessage = this.createExchangeMessage(isFromLocalPLayer, this.letters);
            const commandAndLetters = commandMessage + ' ' + exchangeMessage;
            executionMessages.push(createPlayerEntry(isFromLocalPLayer, this.player.name, commandAndLetters));
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
