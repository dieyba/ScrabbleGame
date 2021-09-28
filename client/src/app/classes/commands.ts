import { Vec2 } from './vec2';

// TODO: Add way to know who sent the command? To add when multiplayer

export interface PlaceParams {
    position: Vec2;
    orientation: string;
    letters:string;
}
export type ExchangeParams = string;
export type ExtractedParams = PlaceParams|ExchangeParams|undefined;

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
    
    constructor(gameService: GameService, isFromLocalPlayer:boolean) {
        this.gameService = gameService;
        this.isFromLocalPlayer = isFromLocalPlayer;
    }
    
    abstract execute(): boolean;
}

export class DebugCmd extends Command {
    constructor(gameService: GameService, isFromLocalPlayer:boolean) {
        super(gameService,isFromLocalPlayer);
    }
    
    execute(): boolean {
        return this.gameService.debug();
    }
}

export class ExchangeCmd extends Command {
    private letters: string;

    constructor(gameService: GameService,isFromLocalPlayer:boolean, letters: string) {
        super(gameService,isFromLocalPlayer);
        this.letters = letters;
    }

    execute(): boolean {
        return this.gameService.exchangeLetters(this.letters);
    }
}

export class PassTurnCmd extends Command {
    constructor(gameService:GameService,isFromLocalPlayer:boolean){
        super(gameService,isFromLocalPlayer)
    }
    execute(): boolean {
        return this.gameService.passTurn();
    }
}

export class PlaceCmd extends Command {
    private position: Vec2;
    private orientation: string;
    private letters: string;

    constructor(gameService: GameService,isFromLocalPlayer:boolean, params:PlaceParams) {
        super(gameService,isFromLocalPlayer);
        this.position = new Vec2;
        this.position.x = params.position.x;
        this.position.y = params.position.y;
        this.orientation = params.orientation;
        this.letters = params.letters;
    }
    
    execute(): boolean {
        return this.gameService.place(this.position, this.orientation, this.letters);
    }
}


// TODO: move extractParams methods too
export const createDebugCmd = function (gameService : GameService,isFromLocalPlayer:boolean,paramsInput:string[]){
    if(paramsInput.length==0){
        return new DebugCmd(gameService,isFromLocalPlayer);
    }
    return undefined;
};

export const createExchangeCmd = function(gameService : GameService,isFromLocalPlayer:boolean,paramsInput:string[]){
    // const extractedParams = this.extractExchangeParams(paramsInput);
    const extractedParams = paramsInput[0];
    if(extractedParams){
        return new ExchangeCmd(gameService,isFromLocalPlayer,extractedParams);
    }
    return undefined;
}

export const createPassCmd = function(gameService : GameService,isFromLocalPlayer:boolean,paramsInput:string[]){
    if(paramsInput.length==0){
        return new PassTurnCmd(gameService,isFromLocalPlayer);
    }
    return undefined;
}

export const createPlaceCmd = function(gameService : GameService,isFromLocalPlayer:boolean,paramsInput:string[]){
    // const extractedParams = this.extractPlaceParams(paramsInput);
    const extractedParams = {position:{x:100,y:100},orientation:"h",letters:paramsInput[1]};
    if(extractedParams){
        return new PlaceCmd(gameService,isFromLocalPlayer,extractedParams);
    }
    return undefined;
}
