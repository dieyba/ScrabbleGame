import { Command , DefaultCommandParams } from "./commands";
import { ErrorType } from "./errors";

export class DebugCmd extends Command {
    constructor(defaultParams:DefaultCommandParams) {
        super(defaultParams);
    }
    
    execute(): ErrorType {
        return this.gameService.debug();
    }
}

export const createDebugCmd = function (defaultParams:DefaultCommandParams){
    if(defaultParams){
        return new DebugCmd(defaultParams);
    }
    return undefined;
};