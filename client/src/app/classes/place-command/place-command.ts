import { ChatDisplayEntry, ChatEntryColor, createErrorEntry } from '@app/classes/chat-display-entry/chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams, PlaceParams } from '@app/classes/commands/commands';
import { ErrorType } from '@app/classes/errors';
import { Axis, convertCoordToString } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { GameService } from '@app/services/game.service/game.service';

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
        const executionResult = await this.gameService.place(this.player, placeParams);
        if (executionResult !== ErrorType.NoError) {
            executionMessages.push(createErrorEntry(executionResult, commandMessage));
            return { isExecuted: this.isExecuted, executionMessages };
        }
        this.isExecuted = true;
        const localPlayerName = this.gameService.game.getLocalPlayer().name;
        const opponentPlayerName = this.gameService.game.getOpponent().name;
        const playerName = this.player.name === localPlayerName ? localPlayerName : opponentPlayerName;
        const color = this.player.name === localPlayerName ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer;
        executionMessages.push({ color, message: playerName + ' >> ' + commandMessage });
        return { isExecuted: this.isExecuted, executionMessages };
    }
}

export const createPlaceCmd = (params: { defaultParams: DefaultCommandParams; specificParams: PlaceParams }): PlaceCmd => {
    return new PlaceCmd(params.defaultParams, params.specificParams);
};
