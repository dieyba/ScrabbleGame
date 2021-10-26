import { Square, SquareColor } from './square';

export const DARK_BLUE_FACTOR = 3;
export const PALE_BLUE_FACTOR = 2;
export const UNPLACED = -1;

export class ScrabbleLetter {
    character: string; // One word string, depending on which letter it is
    value: number; // How many points the letter is worth before blue bonuses
    color: SquareColor;
    tile: Square;

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
}
