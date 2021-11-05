import { Square, SquareColor } from './square';
import { removeAccents } from './utilities';

export const DARK_BLUE_FACTOR = 3;
export const PALE_BLUE_FACTOR = 2;

export const UNPLACED = -1;

export class ScrabbleLetter {
    character: string; // One word string, depending on which letter it is
    value: number; // How many points the letter is worth before blue bonuses
    color: SquareColor;
    tile: Square;

    constructor(letter: string, value?: number) {
        const unplaced = UNPLACED;
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
    setLetter(character: string): void {
        this.character = removeAccents(character);
    }
}
