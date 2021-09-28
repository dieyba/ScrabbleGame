import { Vec2 } from './vec2';

// TODO: Add way to know who sent the command? To add when multiplayer

export interface PlaceParams {
    position: Vec2;
    orientation: string;
    letters:string;
}

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

    constructor(gameService: GameService) {
        this.gameService = gameService;
    }

    abstract execute(): boolean;
}

export class PassTurnCmd extends Command {
    execute(): boolean {
        return this.gameService.passTurn();
    }
}

export class PlaceCmd extends Command {
    private position: Vec2;
    private orientation: string;
    private letters: string;

    constructor(gameService: GameService, params:PlaceParams) {
        super(gameService);
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

export class DebugCmd extends Command {
    constructor(gameService: GameService) {
        super(gameService);
    }

    execute(): boolean {
        return this.gameService.debug();
    }
}

export class ExchangeCmd extends Command {
    private letters: string;

    constructor(gameService: GameService, letters: string) {
        super(gameService);
        this.letters = letters;
    }

    execute(): boolean {
        return this.gameService.exchangeLetters(this.letters);
    }
}
