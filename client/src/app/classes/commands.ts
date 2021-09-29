import { Vec2 } from './vec2';
import {ErrorType} from './errors'
import { SoloGameService } from '../services/solo-game.service';

export interface DefaultCommandParams {
    gameService: SoloGameService;
    isFromLocalPlayer:boolean;
}

export type ExchangeParams = string;

export interface PlaceParams {
    position: Vec2;
    orientation: string;
    word:string;
}

export type CommandParams = 
    {defaultParams:DefaultCommandParams,specificParams:PlaceParams}|
    {defaultParams:DefaultCommandParams,specificParams:ExchangeParams}|
    DefaultCommandParams|
    undefined;


export abstract class Command {
    gameService: SoloGameService;
    isFromLocalPlayer:boolean;
    
    constructor(defaultCommandParams: DefaultCommandParams) {
        this.gameService = defaultCommandParams.gameService;
        this.isFromLocalPlayer = defaultCommandParams.isFromLocalPlayer;
    }
    
    abstract execute(): ErrorType;
}



