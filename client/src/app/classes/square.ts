import { Vec2 } from "./vec2";

export enum SquareColor {
    DarkBlue = 0,
    PaleBlue = 1,
    Pink = 2,
    Red = 3,
    None = 4
}

export interface Square {
    position : Vec2; //Where the square is on the board
    color: SquareColor; // TO DO - replace string for Color enum
    occupied : boolean; //0 if not occupied, 1 if it is
    coordinates: String;
}
