import { Command, CommandName, DefaultCommandParams, PlaceParams } from './commands';
import { SoloGameService } from '@app/services/solo-game.service';
import { Vec2 } from './vec2';
import { ChatDisplayEntry, createErrorEntry, createPlayerEntry } from './chat-display-entry';
import { ErrorType } from './errors';

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

    execute(): ChatDisplayEntry[] {

        // TODO: wait after the 3 seconds before displaying the !placer h8h fdsfsdfds message in chat

        let executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.PLACE_CMD + ' ' + this.position.x + this.position.y + this.orientation + ' ' + this.word;
        const placeParams = { position: this.position, orientation: this.orientation, word: this.word };
        const executionResult = this.gameService.place(this.player, placeParams);
        
        if(executionResult !== ErrorType.NoError){
            executionMessages.push(createErrorEntry(executionResult,commandMessage));
        }else {
            const isFromLocalPlayer = this.player.name === this.gameService.localPlayer.name;
            executionMessages.push(createPlayerEntry(isFromLocalPlayer,this.player.name,commandMessage));
        }
        return executionMessages;
    }
}

export const createPlaceCmd = (params: { defaultParams: DefaultCommandParams; specificParams: PlaceParams }): PlaceCmd => {
    return new PlaceCmd(params.defaultParams, params.specificParams);
};
