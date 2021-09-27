import { Vec2 } from './vec2';

// TODO: Add way to know who sent the command? To add when multiplayer

export interface PlaceParams {
    position: Vec2;
    orientation: string;
    letters:string;
}

export class GameService {
    passTurn(): Boolean {
        console.log('Passing turn');
        return true;
    }

    place(position:Vec2, orientation:string, letters:string): Boolean {
        // calling necessary receivers
        console.log('Position x: ' + position.x);
        console.log('Position y: ' + position.y);
        console.log('Orientation:' + orientation);
        console.log('Letters to place: ' + letters);
        return true;
    }

    debug(): Boolean {
        // calling necessary receivers
        console.log('Changing debug state');
        return true;
    }

    exchangeLetters(letters: string): Boolean {
        // calling necessary receivers
        console.log('Exchanging these letters:' + letters);
        return true;
    }
}



export abstract class Command {
    gameService: GameService;

    constructor(gameService: GameService) {
        this.gameService = gameService;
    }

    abstract execute(): Boolean;
}

export class PassTurnCmd extends Command {
    execute(): Boolean {
        return this.gameService.passTurn();
    }
}

export class PlaceCmd extends Command {
    private position: Vec2;
    private orientation: string;
    private letters: string;

    constructor(gameService: GameService, params:PlaceParams) {
        super(gameService);
        this.position = params.position;
        this.orientation = params.orientation;
        this.letters = params.letters;
    }

    execute(): Boolean {
        return this.gameService.place(this.position, this.orientation, this.letters);
    }
}

export class DebugCmd extends Command {
    constructor(gameService: GameService) {
        super(gameService);
    }

    execute(): Boolean {
        return this.gameService.debug();
    }
}

export class ExchangeCmd extends Command {
    private letters: string;

    constructor(gameService: GameService, letters: string) {
        super(gameService);
        this.letters = letters;
    }

    execute(): Boolean {
        return this.gameService.exchangeLetters(this.letters);
    }
}
