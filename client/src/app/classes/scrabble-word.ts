import { ScrabbleLetter } from './scrabble-letter';
import { SquareColor } from './square';

const PINK_FACTOR = 2;
const RED_FACTOR = 3;

export class ScrabbleWord {
    content: ScrabbleLetter[]; //Array of ScrabbleLetters continually growing to represent the word
    totalValue(): number {
        let total = 0;
        let pinkBonusCount = 0;
        let redBonusCount = 0;
        for (let i = 0; i < this.content.length; i++) {
            // Account for letter pale/dark blue bonuses
            let color = this.content[i].square.color;
            switch (color) {
                case SquareColor.Teal:
                    this.content[i].tealBonus();
                    break;
                case SquareColor.DarkBlue:
                    this.content[i].darkBlueBonus();
                    break;
                case SquareColor.Pink:
                    pinkBonusCount++;
                    break;
                case SquareColor.Red:
                    redBonusCount++;
                    break;
            }
            total += this.content[i].value;
        }
        // Word pink/red bonuses
        // TODO : Export this into a new service.
        total = total * PINK_FACTOR * pinkBonusCount;
        total = total * RED_FACTOR * redBonusCount;
        return total;
    }
}
