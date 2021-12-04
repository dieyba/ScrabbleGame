import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from './scrabble-word';

describe('ScrabbleWord', () => {
    const scrabbleWord = new ScrabbleWord();

    it('should create an instance', () => {
        expect(scrabbleWord).toBeTruthy();
    });

    it('stringify should create a string with the letter of the scrabble word', () => {
        scrabbleWord.content[0] = new ScrabbleLetter('t');
        scrabbleWord.content[1] = new ScrabbleLetter('e');
        scrabbleWord.content[2] = new ScrabbleLetter('s');
        scrabbleWord.content[3] = new ScrabbleLetter('t');
        const stringWord = scrabbleWord.stringify();
        for (let i = 0; i < scrabbleWord.content.length; i++) {
            expect(scrabbleWord.content[i].character).toEqual(stringWord[i]);
        }
    });

    it('calculateValue should return words value', () => {
        scrabbleWord.content[0] = new ScrabbleLetter('t', 1);
        scrabbleWord.content[1] = new ScrabbleLetter('e', 1);
        scrabbleWord.content[2] = new ScrabbleLetter('s', 2);
        scrabbleWord.content[3] = new ScrabbleLetter('t', 1);
        expect(scrabbleWord.calculateValue()).toEqual(5);
    });
});
