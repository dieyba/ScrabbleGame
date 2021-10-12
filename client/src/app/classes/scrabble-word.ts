import { ScrabbleLetter } from './scrabble-letter';
import { Vec2 } from './vec2';

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
        this.value = 0;
        this.startPosition = new Vec2();
    }
    stringify(): string {
        let string = '';
        for (const i of this.content) {
            string += i.character;
            // TODO: Modify for blank pieces
        }
        return string;
    }
}
