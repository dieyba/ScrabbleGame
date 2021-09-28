import { Command , DefaultCommandParams } from "./commands";




export class PassTurnCmd extends Command {
    constructor(defaultParams:DefaultCommandParams){
        super(defaultParams)
    }
    execute(): boolean {
        return this.gameService.passTurn();
    }
}


export const createPassCmd = function(defaultParams:DefaultCommandParams){
    if(defaultParams){
        return new PassTurnCmd(defaultParams);
    }
    return undefined;
}
