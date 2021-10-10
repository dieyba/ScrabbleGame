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
    color: SquareColor;
    tile: Square;

    constructor(letter: string, value: number) {
        const unplaced = -1;
        this.setLetter(letter);
        this.value = value;
        this.color = SquareColor.None;
        this.tile = new Square(unplaced, unplaced); // -1, -1 means it is not placed yet
    }
    getTealBonus(): number {
        return PALE_BLUE_FACTOR * this.value;
    }
    setTealBonus(): void {
        this.value = PALE_BLUE_FACTOR * this.value;
    }
    getDarkBlueBonus(): number {
        return DARK_BLUE_FACTOR * this.value;
    }
    setDarkBlueBonus(): void {
        this.value = DARK_BLUE_FACTOR * this.value;
    }
    setLetter(character: string): void {
        this.character = character;
        this.character = this.character.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}
