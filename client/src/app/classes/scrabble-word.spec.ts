import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';

describe('ScrabbleWord', () => {
    let scrabbleWord = new ScrabbleWord();

    it('should create an instance', () => {
        expect(scrabbleWord).toBeTruthy();
    });

    it('stringify should create a string with the letter of the scrabble word', () => {
        scrabbleWord.content[0] = new ScrabbleLetter('t');
        scrabbleWord.content[0] = new ScrabbleLetter('e');
        scrabbleWord.content[0] = new ScrabbleLetter('s');
        scrabbleWord.content[0] = new ScrabbleLetter('t');
        const stringWord = scrabbleWord.stringify();

        for (let i = 0; i < scrabbleWord.content.length; i++) {
            expect(scrabbleWord.content[i].character).toEqual(stringWord[i]);
        }
    });
});
