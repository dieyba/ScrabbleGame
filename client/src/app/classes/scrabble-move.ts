import { ScrabbleWord } from './scrabble-word';
import { ERROR_NUMBER } from './utilities';
import { Vec2 } from './vec2';

export class ScrabbleMove {
    word: ScrabbleWord;
    position: Vec2;
    constructor(word?: ScrabbleWord, position?: Vec2) {
        this.word = word || new ScrabbleWord();
        this.position = position || new Vec2(ERROR_NUMBER, ERROR_NUMBER);
    }
}
