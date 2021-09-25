import { Vec2 } from './vec2';

// TODO: return when command failed, send error msg to chat

export class GameService {
    passTurn(): void {
        console.log('Passing turn');
    }

    place(posititon: Vec2, letters: string, orientation: string): void {
        // calling necessary receivers
        console.log('Position x: ' + posititon.x);
        console.log('Position y: ' + posititon.y);
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
    private letters: string;
    private orientation: string;
    // TODO: add attribute to check if sender player can place?

    constructor(gameService: GameService, position: Vec2, letters: string, orientation: string) {
        super(gameService);
        this.position = position;
        this.letters = letters;
        this.orientation = orientation;
    }

    execute(): void {
        this.gameService.place(this.position, this.letters, this.orientation);
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
