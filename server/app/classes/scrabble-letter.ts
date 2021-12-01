import { Square, SquareColor } from './square';
import { ERROR_NUMBER, isAllLowerLetters, removeAccents } from './utilities';

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
        if (value !== undefined) {
            this.value = value;
        }
    }

    setLetter(character: string): void {
        // if a captial letter is passed in, represents a blank piece, meaning a '*'
        this.character = isAllLowerLetters(character) ? removeAccents(character) : '*';
    }
    setDefaultValue(character: string) {
        // set the letter's default value
        if ('aeilnorstu'.indexOf(character) !== ERROR_NUMBER) {
            this.value = 1;
        } else if ('dgm'.indexOf(character) !== ERROR_NUMBER) {
            this.value = 2;
        } else if ('bcp'.indexOf(character) !== ERROR_NUMBER) {
            this.value = 3;
        } else if ('fhv'.indexOf(character) !== ERROR_NUMBER) {
            this.value = 4;
        } else if ('jq'.indexOf(character) !== ERROR_NUMBER) {
            this.value = 8;
        } else if ('kwxyz'.indexOf(character) !== ERROR_NUMBER) {
            this.value = 10;
        } else {
            this.value = 0; // case where it is a * or capital letter
        }
    }
}
