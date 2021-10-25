import { SoloGameService } from '@app/services/solo-game.service';
import { ChatDisplayEntry, createErrorEntry, createPlayerEntry } from './chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams, PlaceParams } from './commands';
import { ErrorType } from './errors';
import { convertCoordToString } from './utilities';
import { Vec2 } from './vec2';

export class PlaceCmd extends Command {
    private gameService: SoloGameService;
    private position: Vec2;
    private orientation: string;
    private word: string;

    constructor(defaultParams: DefaultCommandParams, params: PlaceParams) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as SoloGameService;
        this.position = new Vec2();
        this.position.x = params.position.x;
        this.position.y = params.position.y;
        this.orientation = params.orientation;
        this.word = params.word;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const stringCoord = convertCoordToString(this.position);
        const commandMessage = '!' + CommandName.PlaceCmd + ' ' + stringCoord + this.orientation + ' ' + this.word;

        const placeParams = { position: this.position, orientation: this.orientation, word: this.word };
        const executionResult = this.gameService.place(this.player, placeParams);

        // TODO: wait after the 3 seconds before displaying the execution result message,
        // here also seems to cause bugs with waiting after the validation is done

        if (executionResult !== ErrorType.NoError) {
            executionMessages.push(createErrorEntry(executionResult, commandMessage));
        } else {
            this.isExecuted = true;
            const isFromLocalPlayer = this.player.name === this.gameService.localPlayer.name;
            executionMessages.push(createPlayerEntry(isFromLocalPlayer, this.player.name, commandMessage));
        }
        return { isExecuted: this.isExecuted, executionMessages };
    }
}

export const createPlaceCmd = (params: { defaultParams: DefaultCommandParams; specificParams: PlaceParams }): PlaceCmd => {
    return new PlaceCmd(params.defaultParams, params.specificParams);
};
