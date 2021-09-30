import { Command, DefaultCommandParams, ExchangeParams } from './commands';
import { ErrorType } from './errors';

export class ExchangeCmd extends Command {
    private letters: string;

    constructor(defaultParams: DefaultCommandParams, letters: ExchangeParams) {
        super(defaultParams);
        this.letters = letters;
    }

    execute(): ErrorType {
        return this.gameService.exchangeLetters(this.letters);
    }
}

export const createExchangeCmd = (params: { defaultParams: DefaultCommandParams; specificParams: ExchangeParams }): ExchangeCmd => {
    return new ExchangeCmd(params.defaultParams, params.specificParams);
};
