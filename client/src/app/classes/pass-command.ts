import { GameService } from '@app/services/game.service';
import { Command, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class PassTurnCmd extends Command {
    private gameService: GameService;

    constructor(defaultParams: DefaultCommandParams) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as GameService;
    }

    execute(): ErrorType {
        return this.gameService.currentGameService.passTurn(this.gameService.currentGameService.game.creatorPlayer);
    }
}

export const createPassCmd = (defaultParams: DefaultCommandParams): PassTurnCmd => {
    return new PassTurnCmd(defaultParams);
};
