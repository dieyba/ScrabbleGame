import { Square, SquareColor } from './square';

export const DARK_BLUE_FACTOR = 3;
export const PALE_BLUE_FACTOR = 2;

export const UNPLACED = -1;

export class ScrabbleLetter {
    character: string; // One word string, depending on which letter it is
    value: number; // How many points the letter is worth before blue bonuses
    color: SquareColor;
    tile: Square;

    constructor(letter: string, value?: number) {
        this.color = SquareColor.None;
        this.tile = new Square(UNPLACED, UNPLACED); // -1, -1 means it is not placed yet
        this.setLetter(letter);
        this.setDefaultValue(letter);
        // TODO: this overrides default value, is there a situation where we do that?
        if (value !== undefined) {
            this.value = value;
        }
    }

    setLetter(character: string): void {
        this.character = character.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    setDefaultValue(character: string) {
        // set the letter's default value
        if (character === '*') {
            this.value = 0;
        } else if ('aeilnorstu'.includes(character)) {
            this.value = 1;
        } else if ('dgm'.includes(character)) {
            this.value = 2;
        } else if ('bcp'.includes(character)) {
            this.value = 3;
        } else if ('fhv'.includes(character)) {
            this.value = 4;
        } else if ('jq'.includes(character)) {
            this.value = 8;
        } else if ('kwxyz'.includes(character)) {
            this.value = 10;
        }
    }
}
