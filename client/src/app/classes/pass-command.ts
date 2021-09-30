import { Command, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class PassTurnCmd extends Command {
    execute(): ErrorType {
        return this.gameService.passTurn();
    }
}

export const createPassCmd = (defaultParams: DefaultCommandParams): PassTurnCmd => {
    return new PassTurnCmd(defaultParams);
};
