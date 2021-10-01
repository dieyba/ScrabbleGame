import { ScrabbleLetter } from './scrabble-letter';
import { PINK_FACTOR, RED_FACTOR, ScrabbleWord } from './scrabble-word';
import { SquareColor } from './square';

describe('ScrabbleWord', () => {
    it('should create an instance', () => {
        expect(new ScrabbleWord()).toBeTruthy();
    });


    it('should call tealBonus (ScrabbleLetter) when the square is teal', () => {
        let word = new ScrabbleWord();
        let letter = new ScrabbleLetter('a', 1);
        word.content = [letter];
        letter.color = SquareColor.Teal;
        const spy = spyOn(letter, 'tealBonus').and.callThrough();
        word.totalValue();

        expect(spy).toHaveBeenCalled();
    });

    it('should call darkBlueBonus (ScrabbleLetter) when the square is dark blue', () => {
        let word = new ScrabbleWord();
        let letter = new ScrabbleLetter('a', 1);
        word.content = [letter];
        letter.color = SquareColor.DarkBlue;
        const spy = spyOn(letter, 'darkBlueBonus').and.callThrough();
        word.totalValue();

        expect(spy).toHaveBeenCalled();
    });

    it('should increase totalValue when the square is pink', () => {
        let word = new ScrabbleWord();
        let letter = new ScrabbleLetter('a', 1);
        word.content = [letter];
        letter.color = SquareColor.Pink;
        let wordValue = letter.value + PINK_FACTOR * 1;

        expect(word.totalValue()).toEqual(wordValue);
    });

    it('should increase totalValue when the square is red', () => {
        let word = new ScrabbleWord();
        let letter = new ScrabbleLetter('a', 1);
        word.content = [letter];
        letter.color = SquareColor.Red;
        let wordValue = letter.value + RED_FACTOR * 1;

        expect(word.totalValue()).toEqual(wordValue);
    });

    it('should return the right word value', () => {
        let word = new ScrabbleWord();
        word.content = [new ScrabbleLetter('a', 1), new ScrabbleLetter('p', 3)];
        word.content[0].color = SquareColor.Red;
        word.content[1].color = SquareColor.Pink;

        let wordValue = 0;
        for (let letter of word.content) {
            wordValue += letter.value;
        }
        wordValue += PINK_FACTOR * 1;
        wordValue += RED_FACTOR * 1;

        expect(word.totalValue()).toEqual(wordValue);
    });
});
