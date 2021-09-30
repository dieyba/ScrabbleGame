import { Command, DefaultCommandParams, PlaceParams } from './commands';
import { ErrorType } from './errors';
import { ExchangeCmd } from './exchange-command';
import { Vec2 } from './vec2';

export class PlaceCmd extends Command {
    private position: Vec2;
    private orientation: string;
    private letters: string;

    constructor(defaultParams: DefaultCommandParams, params: PlaceParams) {
        super(defaultParams);
        this.position = new Vec2();
        this.position.x = params.position.x;
        this.position.y = params.position.y;
        this.orientation = params.orientation;
        this.letters = params.word;
    }

    execute(): ErrorType {
        return this.gameService.place(this.position, this.orientation, this.letters);
    }
}

export const createPlaceCmd = function (params: { defaultParams: DefaultCommandParams; specificParams: PlaceParams }):PlaceCmd|undefined {
    if (params) {
        return new PlaceCmd(params.defaultParams, params.specificParams);
    }
    return undefined;
};
