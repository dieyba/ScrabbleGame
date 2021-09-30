import { Command, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class PassTurnCmd extends Command {
    constructor(defaultParams: DefaultCommandParams) {
        super(defaultParams);
    }
    execute(): ErrorType {
        return this.gameService.passTurn();
    }
}

export const createPassCmd = function (defaultParams: DefaultCommandParams):PassTurnCmd|undefined {
    if (defaultParams) {
        return new PassTurnCmd(defaultParams);
    }
    return undefined;
};
