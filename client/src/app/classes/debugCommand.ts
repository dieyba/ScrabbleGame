import { Command , DefaultCommandParams } from "./commands";


export class DebugCmd extends Command {
    constructor(defaultParams:DefaultCommandParams) {
        super(defaultParams);
    }
    
    execute(): boolean {
        return this.gameService.debug();
    }
}

export const createDebugCmd = function (defaultParams:DefaultCommandParams){
    if(defaultParams){
        return new DebugCmd(defaultParams);
    }
    return undefined;
};