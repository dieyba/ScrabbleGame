import { Square } from './square';

export const DARK_BLUE_FACTOR = 2;
export const PALE_BLUE_FACTOR = 3;

export class ScrabbleLetter {
    character: string; //One word string, depending on which letter it is
    value: number; //How many points the letter is worth before blue bonuses
    nextLetters: ScrabbleLetter[]; //Neighbouring letters (0: N, 1: E, 2: S, 3: W) of the letter. WATCH OUT : don't go over four
    square: Square;
    paleBlueBonus(): void {
        this.value = PALE_BLUE_FACTOR * this.value;
    }
    darkBlueBonus(): void {
        this.value = DARK_BLUE_FACTOR * this.value;
    }
}
