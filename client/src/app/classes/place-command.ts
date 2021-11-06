import { GameService } from '@app/services/game.service';
import { ChatDisplayEntry, ChatEntryColor, createErrorEntry } from './chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams, PlaceParams } from './commands';
import { ErrorType } from './errors';
import { Axis, convertCoordToString } from './utilities';
import { Vec2 } from './vec2';

export class PlaceCmd extends Command {
    private gameService: GameService;
    private position: Vec2;
    private orientation: Axis;
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

    async execute(): Promise<CommandResult> {
        const executionMessages: ChatDisplayEntry[] = [];
        const stringCoord = convertCoordToString(this.position);
        const commandMessage = '!' + CommandName.PlaceCmd + ' ' + stringCoord + this.orientation + ' ' + this.word;

        const placeParams = { position: this.position, orientation: this.orientation, word: this.word };

        return await this.gameService.currentGameService.place(this.player, placeParams).then((executionResult: ErrorType) => {
            if (executionResult !== ErrorType.NoError) {
                executionMessages.push(createErrorEntry(executionResult, commandMessage));
            } else {
                this.isExecuted = true;
                const localPlayerName = this.gameService.currentGameService.game.localPlayer.name;
                const playerName = this.player.name === localPlayerName ? localPlayerName : this.gameService.currentGameService.game.opponentPlayer.name;
                const color = this.player.name === localPlayerName ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer;
                executionMessages.push({ color, message: playerName + ' >> ' + commandMessage });
            }
            return { isExecuted: this.isExecuted, executionMessages };
        });
    }
}

export const createPlaceCmd = (params: { defaultParams: DefaultCommandParams; specificParams: PlaceParams }): PlaceCmd => {
    return new PlaceCmd(params.defaultParams, params.specificParams);
};
