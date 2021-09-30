import { Square, SquareColor } from './square';

export const DARK_BLUE_FACTOR = 3;
export const PALE_BLUE_FACTOR = 2;

export enum Axis {
    H = 'h',
    V = 'v',
}
// eslint-disable-next-line no-unused-vars
export const invertAxis = {
    [Axis.H]: Axis.V,
    [Axis.V]: Axis.H, // Vertical is the opposite of horizontal
};

export enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
}

export class ScrabbleLetter {
    character: string; // One word string, depending on which letter it is
    value: number; // How many points the letter is worth before blue bonuses
    nextLetters: ScrabbleLetter[]; // Neighbouring letters (0: N, 1: E, 2: S, 3: W) of the letter. WATCH OUT : don't go over four
    color: SquareColor;
    tile : Square;

    constructor(letter: string, value: number) {
        this.setLetter(letter);
        this.value = value;
        this.nextLetters = [];
        this.color = SquareColor.None;
        this.tile = new Square(-1,-1); //-1, -1 means it is not placed yet
    }
    tealBonus(): void {
        this.value = PALE_BLUE_FACTOR * this.value;
    }
    darkBlueBonus(): void {
        this.value = DARK_BLUE_FACTOR * this.value;
    }
    setLetter(character: string): void {
        this.character = character;
        this.character = this.character.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}
