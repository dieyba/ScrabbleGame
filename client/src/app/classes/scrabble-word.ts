import { ScrabbleLetter } from './scrabble-letter';
import { Vec2 } from './vec2';
import { SquareColor } from './square';

const PINK_FACTOR = 2;
const RED_FACTOR = 3;

export enum WordOrientation {
    Horizontal = 0,
    Vertical = 1,
}

export class ScrabbleWord {
    content: ScrabbleLetter[]; // Array of ScrabbleLetters continually growing to represent the word
    value: number;
    startPosition: Vec2;
    orientation: WordOrientation;

    constructor() {
        this.content = [];
    }
    stringify(): string {
        let string = '';
        for (const i of this.content) {
            string += i.character;
            // TODO: Modify for blank pieces
        }
        return string;
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
                    break;
                case SquareColor.DarkBlue:
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
        // TODO : Export the following into a new service.
        total = total * PINK_FACTOR * pinkBonusCount;
        total = total * RED_FACTOR * redBonusCount;
        return total;
    }
}
