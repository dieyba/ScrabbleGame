import { Vec2 } from './vec2';

export enum SquareColor {
    None = 0,
    Teal = 1,
    DarkBlue = 2,
    Pink = 3,
    Red = 4,
}

export class Square {
    position: Vec2 = {x:0, y:0}; // Where the square is on the board
    color: SquareColor; 
    occupied: boolean; // 0 if not occupied, 1 if it is
    // We should create an "id" to facilitate the *randomize bonuses* feature.

    constructor(horizontalPosition: number, verticalPosition: number) {
        this.color = SquareColor.None;
        this.occupied = false;
        this.position.x = horizontalPosition;
        this.position.y = verticalPosition;
    }

    getColor(): SquareColor {
        return this.color;
    }
}
