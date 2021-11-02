import { ScrabbleLetter } from './scrabble-letter';
import { Vec2 } from './vec2';

export enum SquareColor {
    None = 0,
    Teal = 1,
    DarkBlue = 2,
    Pink = 3,
    Red = 4,
}

export enum ColorQuantity {
    Teal = 24,
    DarkBlue = 12,
    Pink = 17,
    Red = 8,
}

export class Square {
    position: Vec2; // Where the square is on the board
    color: SquareColor;
    occupied: boolean; // 0 if not occupied, 1 if it is
    isValidated: boolean;
    isBonusUsed: boolean;
    letter: ScrabbleLetter;
    // We should create an "id" to facilitate the *randomize bonuses* feature.

    constructor(horizontalPosition: number, verticalPosition: number) {
        this.position = new Vec2(0, 0);
        this.color = SquareColor.None;
        this.occupied = false;
        this.isValidated = false;
        this.isBonusUsed = false;
        this.position.x = horizontalPosition;
        this.position.y = verticalPosition;
    }
}
