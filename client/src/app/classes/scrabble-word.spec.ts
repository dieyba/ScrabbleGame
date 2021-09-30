import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';
import { SquareColor } from './square';

describe('ScrabbleWord', () => {
    it('should create an instance', () => {
        expect(new ScrabbleWord()).toBeTruthy();
    });

    it('totalValue should apply the right bonuses', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Teal;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const letter4 = new ScrabbleLetter('d', 1);
        letter4.color = SquareColor.Red;
        const word = new ScrabbleWord();
        word.content = [letter1, letter2, letter3, letter4];
        word.totalValue();
        expect(word.value).toEqual(15);
    });

    it('totalValue should apply the right bonuses', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const letter4 = new ScrabbleLetter('d', 1);
        letter4.color = SquareColor.Pink;
        const word = new ScrabbleWord();
        word.content = [letter1, letter2, letter3, letter4];
        word.totalValue();
        expect(word.value).toEqual(12);
    });
});
