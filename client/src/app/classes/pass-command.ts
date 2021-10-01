import { Command, DefaultCommandParams } from './commands';
import { SoloGameService } from '@app/services/solo-game.service';
import { ErrorType } from './errors';

export class PassTurnCmd extends Command {
    private gameService: SoloGameService;

    constructor(defaultParams: DefaultCommandParams){
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as SoloGameService;
    }

    execute(): ErrorType {
        return this.gameService.passTurn();
    }
}

export const createPassCmd = (defaultParams: DefaultCommandParams): PassTurnCmd => {
    return new PassTurnCmd(defaultParams);
};
