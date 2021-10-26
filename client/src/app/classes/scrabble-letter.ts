import { Square, SquareColor } from './square';

export const DARK_BLUE_FACTOR = 3;
export const PALE_BLUE_FACTOR = 2;

export enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
}

export const UNPLACED = -1;

export class ScrabbleLetter {
    character: string; // One word string, depending on which letter it is
    value: number; // How many points the letter is worth before blue bonuses
    color: SquareColor;
    tile: Square;

    constructor(letter: string, value?: number) {
        const unplaced = -1;
        this.setLetter(letter);
        this.color = SquareColor.None;
        this.tile = new Square(unplaced, unplaced); // -1, -1 means it is not placed yet

        if (letter === '*') {
            this.value = 0;
        } else if ('aeilnorstu'.includes(letter)) {
            this.value = 1;
        } else if ('dgm'.includes(letter)) {
            this.value = 2;
        } else if ('bcp'.includes(letter)) {
            this.value = 3;
        } else if ('fhv'.includes(letter)) {
            this.value = 4;
        } else if ('jq'.includes(letter)) {
            this.value = 8;
        } else if ('kwxyz'.includes(letter)) {
            this.value = 10;
        }

        if (value !== undefined) {
            this.value = value;
        }
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
        this.character = character.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}
