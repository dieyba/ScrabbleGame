import { Vec2 } from './vec2';

export interface DefaultCommandParams {
    gameService: GameService;
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




export class GameService {
    passTurn(): boolean {
        console.log('Passing turn...');
        return true;
    }

    place(position:Vec2, orientation:string, letters:string): boolean {
        // calling necessary receivers
        console.log("Placing letters...");
        console.log('Position x: ' + position.x);
        console.log('Position y: ' + position.y);
        console.log('Orientation:' + orientation);
        console.log('Letters to place: ' + letters);
        return true;
    }

    debug(): boolean {
        // calling necessary receivers
        console.log('Changing debug state...');
        return true;
    }

    exchangeLetters(letters: string): boolean {
        // calling necessary receivers
        console.log('Exchanging these letters:' + letters + " ...");
        return true;
    }
}



export abstract class Command {
    gameService: GameService;
    isFromLocalPlayer:boolean;
    
    constructor(defaultCommandParams: DefaultCommandParams) {
        this.gameService = defaultCommandParams.gameService;
        this.isFromLocalPlayer = defaultCommandParams.isFromLocalPlayer;
    }
    
    abstract execute(): boolean;
}



