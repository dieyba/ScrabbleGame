import { ScrabbleWord } from './scrabble-word';
import { Axis, ERROR_NUMBER } from './utilities';
import { Vec2 } from './vec2';

export class ScrabbleMove {
    word: ScrabbleWord;
    position: Vec2;
    axis: Axis;
    value: number;
    constructor(word?: ScrabbleWord, position?: Vec2, axis?: Axis, value?: number) {
        this.word = word || new ScrabbleWord();
        this.position = position || new Vec2(ERROR_NUMBER, ERROR_NUMBER);
        this.axis = axis || Axis.H;
        this.value = value || 0;
    }
}
