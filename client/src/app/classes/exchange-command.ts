import { GameService } from '@app/services/game.service';
import { Command, DefaultCommandParams, ExchangeParams } from './commands';
import { ErrorType } from './errors';

export class ExchangeCmd extends Command {
    private gameService: GameService;
    private letters: string;

    constructor(defaultParams: DefaultCommandParams, letters: ExchangeParams) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as GameService;
        this.letters = letters;
    }

    execute(): ErrorType {
        return this.gameService.currentGameService.exchangeLetters(this.player, this.letters);
    }
}

export const createExchangeCmd = (params: { defaultParams: DefaultCommandParams; specificParams: ExchangeParams }): ExchangeCmd => {
    return new ExchangeCmd(params.defaultParams, params.specificParams);
};
