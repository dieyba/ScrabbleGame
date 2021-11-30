import { Player } from '@app/classes/player/player';
import { ChatDisplayService } from '@app/services/chat-display.service';
import { GameService } from '@app/services/game.service';
import { ChatDisplayEntry } from '../chat-display-entry/chat-display-entry';
import { Axis } from '../utilities/utilities';
import { Vec2 } from '../vec2/vec2';

export enum CommandName {
    DebugCmd = 'debug',
    ExchangeCmd = 'échanger',
    PassCmd = 'passer',
    PlaceCmd = 'placer',
    StockCmd = 'réserve',
    HelpCmd = 'aide',
}
export interface DefaultCommandParams {
    player: Player;
    serviceCalled: GameService | ChatDisplayService;
}

export interface PlaceParams {
    position: Vec2;
    orientation: Axis;
    word: string;
}

export type CommandParams =
    | { defaultParams: DefaultCommandParams; specificParams: PlaceParams } // place command
    | { defaultParams: DefaultCommandParams; specificParams: string } // extract and stock command
    | DefaultCommandParams // debug and pass commands
    | undefined;

export type CommandResult = { isExecuted: boolean; executionMessages: ChatDisplayEntry[] };

export abstract class Command {
    player: Player;
    isExecuted: boolean;

    constructor(player: Player) {
        this.player = player;
        this.isExecuted = false;
    }

    abstract execute(): CommandResult | Promise<CommandResult>;
}
