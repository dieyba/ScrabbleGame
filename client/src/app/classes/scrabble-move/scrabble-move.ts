import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Axis, ERROR_NUMBER } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';

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
