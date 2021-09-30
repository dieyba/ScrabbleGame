import { ScrabbleLetter } from './scrabble-letter';
import { SquareColor } from './square';

const PINK_FACTOR = 2;
const RED_FACTOR = 3;

export class ScrabbleWord {
    content: ScrabbleLetter[]; // Array of ScrabbleLetters continually growing to represent the word
    constructor() {
        this.content = [];
    }
    totalValue(): number {
        let total = 0;
        let pinkBonusCount = 0;
        let redBonusCount = 0;
        for (const i of this.content) {
            // Account for letter pale/dark blue bonuses
            const color = i.color;
            switch (color) {
                case SquareColor.Teal:
                    i.tealBonus();
                    break;
                case SquareColor.DarkBlue:
                    i.darkBlueBonus();
                    break;
                case SquareColor.Pink:
                    pinkBonusCount++;
                    break;
                case SquareColor.Red:
                    redBonusCount++;
                    break;
            }
            total += i.value;
        }
        // Word pink/red bonuses
        if (pinkBonusCount !== 0) {
            total = total * PINK_FACTOR * pinkBonusCount;
        }
        if (redBonusCount !== 0) {
            total = total * RED_FACTOR * redBonusCount;
        }
        return total;
    }
}
