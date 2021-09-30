import { SquareColor } from './square';

export const DARK_BLUE_FACTOR = 3;
export const PALE_BLUE_FACTOR = 2;

export class ScrabbleLetter {
    private character: string; // One word string, depending on which letter it is
    value: number; // How many points the letter is worth before blue bonuses
    nextLetters: ScrabbleLetter[]; // Neighbouring letters (0: N, 1: E, 2: S, 3: W) of the letter. WATCH OUT : don't go over four
    color: SquareColor;

    constructor(letter: string, value: number) {
        this.setLetter(letter);
        this.value = value;
        this.nextLetters = [];
        this.color = SquareColor.None;
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
    getLetter(): string {
        return this.character;
    }
}
