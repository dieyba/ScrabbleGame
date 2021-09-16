import { Vec2 } from './vec2';

export enum SquareColor {
    None = 0,
    Teal = 1,
    DarkBlue = 2,
    Pink = 3,
    Red = 4,
}

export interface Square {
    position: Vec2; // Where the square is on the board
    color: SquareColor; // TO DO - replace string for Color enum
    occupied: boolean; // 0 if not occupied, 1 if it is
    // We should create an "id" to facilitate the *randomize bonuses* feature.
}
