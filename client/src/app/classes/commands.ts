import { ChatDisplayService } from '@app/services/chat-display.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { Player } from '@app/classes/player';
import { ErrorType } from './errors';
import { Vec2 } from './vec2';

export interface DefaultCommandParams {
    player: Player;
    serviceCalled: SoloGameService | ChatDisplayService;
}

export type ExchangeParams = string;

export interface PlaceParams {
    position: Vec2;
    orientation: string;
    word: string;
}

export type CommandParams =
    | { defaultParams: DefaultCommandParams; specificParams: PlaceParams }
    | { defaultParams: DefaultCommandParams; specificParams: ExchangeParams }
    | DefaultCommandParams
    | undefined;

export abstract class Command {
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    abstract execute(): ErrorType;
}