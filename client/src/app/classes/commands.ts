import { Vec2 } from './vec2';

// TODO: return when command failed, send error msg to chat

// TODO: Add the player name who sent the command or not?
export interface PlaceParams {
    position: Vec2;
    orientation: string;
    letters:string;
}

export class GameService {
    passTurn(): void {
        console.log('Passing turn');
    }

    place(position:Vec2, orientation:string, letters:string): void {
        // calling necessary receivers
        console.log('Position x: ' + position.x);
        console.log('Position y: ' + position.y);
        console.log('Orientation:' + orientation);
        console.log('Letters to place: ' + letters);
    }

    debug(): void {
        // calling necessary receivers
        console.log('Changing debug state');
    }

    exchangeLetters(letters: string): void {
        // calling necessary receivers
        console.log('Exchanging these letters:' + letters);
    }
}



export abstract class Command {
    gameService: GameService;

    constructor(gameService: GameService) {
        this.gameService = gameService;
    }

    abstract execute(): void;
}

export class PassTurnCmd extends Command {
    execute(): void {
        this.gameService.passTurn();
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

    execute(): void {
        this.gameService.place(this.position, this.orientation, this.letters);
    }
}

export class DebugCmd extends Command {
    constructor(gameService: GameService) {
        super(gameService);
    }

    execute(): void {
        this.gameService.debug();
    }
}

export class ExchangeCmd extends Command {
    private letters: string;

    constructor(gameService: GameService, letters: string) {
        super(gameService);
        this.letters = letters;
    }

    execute(): void {
        this.gameService.exchangeLetters(this.letters);
    }
}
