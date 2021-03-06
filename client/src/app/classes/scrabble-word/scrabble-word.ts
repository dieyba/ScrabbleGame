import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { Axis, scrabbleLettersToString } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
export class ScrabbleWord {
    content: ScrabbleLetter[]; // Array of ScrabbleLetters continually growing to represent the word
    value: number;
    startPosition: Vec2;
    orientation: Axis;

    constructor() {
        this.content = [];
        this.value = 0;
        this.startPosition = new Vec2();
    }

    stringify(): string {
        return scrabbleLettersToString(this.content);
    }

    calculateValue(): number {
        let value = 0;
        for (const i of this.content) {
            value += i.value;
        }
        return value;
    }
}
