
import { Command , DefaultCommandParams, ExchangeParams } from "./commands";

export class ExchangeCmd extends Command {
    private letters: string;

    constructor(defaultParams:DefaultCommandParams, letters:ExchangeParams) {
        super(defaultParams);
        this.letters = letters;
    }

    execute(): boolean {
        return this.gameService.exchangeLetters(this.letters);
    }
}


export const createExchangeCmd = function(params:{defaultParams:DefaultCommandParams,specificParams:ExchangeParams}){
    if(params){
        return new ExchangeCmd(params.defaultParams,params.specificParams);
    }
    return undefined;
}
