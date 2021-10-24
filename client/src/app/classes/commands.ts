import { Player } from '@app/classes/player';
import { ChatDisplayService } from '@app/services/chat-display.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { Vec2 } from './vec2';
import { ChatDisplayEntry } from './chat-display-entry';

export enum CommandName {
    DEBUG_CMD = 'debug',
    EXCHANGE_CMD = 'échanger',
    PASS_CMD = 'passer',
    PLACE_CMD = 'placer',
    STOCK_CMD = 'réserve',
}
export interface DefaultCommandParams {
    player: Player;
    serviceCalled: SoloGameService | ChatDisplayService;
}

export interface PlaceParams {
    position: Vec2;
    orientation: string;
    word: string;
}

export type CommandParams =
    | { defaultParams: DefaultCommandParams; specificParams: PlaceParams } // place command
    | { defaultParams: DefaultCommandParams; specificParams: string } // extract and stock command
    | DefaultCommandParams // debug and pass commands
    | undefined;

export abstract class Command {
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    abstract execute(): ChatDisplayEntry[];

    createCommandInput(userInput?: string): string {
        const commandInput = '';
        if (userInput) {
            userInput = commandInput;
        }
        return commandInput;
    }
}
