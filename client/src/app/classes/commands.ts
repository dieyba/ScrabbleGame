import { ChatDisplayService } from '@app/services/chat-display.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { ErrorType } from './errors';
import { Vec2 } from './vec2';

export interface DefaultCommandParams {
    gameService: SoloGameService;
    isFromLocalPlayer: boolean;
}

export type ExchangeParams = string;

export interface PlaceParams {
    position: Vec2;
    orientation: string;
    word: string;
}

export type DebugParams = ChatDisplayService;

export type CommandParams =
    | { defaultParams: DefaultCommandParams; specificParams: PlaceParams }
    | { defaultParams: DefaultCommandParams; specificParams: ExchangeParams }
    | { defaultParams: DefaultCommandParams; specificParams: DebugParams }
    | DefaultCommandParams
    | undefined;

export abstract class Command {
    gameService: SoloGameService;
    isFromLocalPlayer: boolean;

    constructor(defaultCommandParams: DefaultCommandParams) {
        this.gameService = defaultCommandParams.gameService;
        this.isFromLocalPlayer = defaultCommandParams.isFromLocalPlayer;
    }

    abstract execute(): ErrorType;
}
