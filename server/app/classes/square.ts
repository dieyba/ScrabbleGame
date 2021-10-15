import { ScrabbleLetter } from './scrabble-letter';
import { Vec2 } from './vec2';

export enum SquareColor {
    None = 0,
    Teal = 1,
    DarkBlue = 2,
    Pink = 3,
    Red = 4,
}

export class Square {
    position: Vec2 = new Vec2(0, 0); // Where the square is on the board
    color: SquareColor;
    occupied: boolean; // 0 if not occupied, 1 if it is
    isValidated: boolean;
    isBonusUsed: boolean;
    letter: ScrabbleLetter;
}
