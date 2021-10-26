import { GameService } from '@app/services/game.service';
import { Command, DefaultCommandParams, PlaceParams } from './commands';
import { ErrorType } from './errors';
import { Vec2 } from './vec2';

export class PlaceCmd extends Command {
    private gameService: GameService;
    private position: Vec2;
    private orientation: string;
    private word: string;

    constructor(defaultParams: DefaultCommandParams, params: PlaceParams) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as GameService;
        this.position = new Vec2();
        this.position.x = params.position.x;
        this.position.y = params.position.y;
        this.orientation = params.orientation;
        this.word = params.word;
    }

    execute(): ErrorType {
        const placeParams = { position: this.position, orientation: this.orientation, word: this.word };
        return this.gameService.currentGameService.place(this.player, placeParams);
    }
}

export const createPlaceCmd = (params: { defaultParams: DefaultCommandParams; specificParams: PlaceParams }): PlaceCmd => {
    return new PlaceCmd(params.defaultParams, params.specificParams);
};
