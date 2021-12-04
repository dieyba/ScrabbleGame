import { Square, SquareColor } from '@app/classes/square/square';
import { isAllLowerLetters, isValidLetter, removeAccents } from '@app/classes/utilities/utilities';

export const DARK_BLUE_FACTOR = 3;
export const PALE_BLUE_FACTOR = 2;

export const UNPLACED = -1;

export class ScrabbleLetter {
    character: string; // One word string, depending on which letter it is
    whiteLetterCharacter: string; // the desired letter value if the character is an asterisk
    value: number; // How many points the letter is worth before blue bonuses
    color: SquareColor;
    tile: Square;

    constructor(letter: string, value?: number) {
        this.color = SquareColor.None;
        this.tile = new Square(UNPLACED, UNPLACED); // -1, -1 means it is not placed yet
        this.character = letter;
        if (this.character === '*') {
            this.whiteLetterCharacter = this.character;
        }
        this.setDefaultValue(this.character);
        if (value !== undefined) {
            this.value = value;
        }
    }

    private setDefaultValue(character: string) {
        // set the letter's default value
        if (character === '') {
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
        } else {
            this.value = 0; // default value for *
        }
    }
}

export const setLetter = (character: string, scrabbleLetter: ScrabbleLetter): ScrabbleLetter => {
    const result = scrabbleLetter;
    if (character === '') {
        result.character = '';
        result.value = 0;
        return result;
    }
    // if a capital letter is passed in, it represents a blank piece, meaning an asterisk
    result.character = isAllLowerLetters(character) && isValidLetter(removeAccents(character)) ? removeAccents(character) : '*';
    if (result.character === '*') {
        result.whiteLetterCharacter = character;
        result.value = 0;
    }
    return scrabbleLetter;
};
