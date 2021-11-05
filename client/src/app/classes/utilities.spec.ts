import { ScrabbleLetter } from './scrabble-letter';
import * as utilities from './utilities';
import { Vec2 } from './vec2';

describe('ScrabbleWord', () => {
    it('scrabbleLetterstoString should convert a scrabble letter tab to a string', () => {
        const scrabbleLetters = [new ScrabbleLetter('t'), new ScrabbleLetter('e'), new ScrabbleLetter('s'), new ScrabbleLetter('t')];
        const stringWord = utilities.scrabbleLetterstoString(scrabbleLetters);
        expect(stringWord).toEqual('test');
    });

    it('convertStringToCoord should convert the string row and columns to coordinates with x and y between 0 to 14', () => {
        const coords = utilities.convertStringToCoord('f', '4') as Vec2;
        expect(coords.x).toEqual(3);
        expect(coords.y).toEqual(5);

        const wrongCoords = utilities.convertStringToCoord('l', '19');
        expect(wrongCoords).not.toBeTruthy()
    });

    it('convertCoordToString should convert coords between 0 and 14 in string row and column', () => {
        const stringCoords = utilities.convertCoordToString(new Vec2(3, 5));
        expect(stringCoords).toEqual('f4');
    });

    it('trimSpaces should removes white spaces at the beginning and end of a string', () => {
        const wordWithSpaces = ' test ';
        const wordWithoutSpaces = utilities.trimSpaces(wordWithSpaces);
        expect(wordWithoutSpaces).toEqual('test');
    });

    it('isEmpty should return true if the string is filled only with white spaces', () => {
        let word = '    ';
        expect(utilities.isEmpty(word)).toBeTrue();

        word = ' test';
        expect(utilities.isEmpty(word)).toBeFalse();
    });

    it('isAllLowerLetters should return true if all the caracters of the string are low case', () => {
        let word = 'TeSt';
        expect(utilities.isAllLowerLetters(word)).toBeFalse();

        word = 'test';
        expect(utilities.isAllLowerLetters(word)).toBeTrue();
    });

    it('removeAccents should remove the accents', () => {
        const word = 'àéù';
        expect(utilities.removeAccents(word)).toEqual('aeu');
    });

    it('isValidLetter should return false if it is not a letter or if it has an accent', () => {
        let letter = 'à';
        expect(utilities.isValidLetter(letter)).toBeFalse();

        letter = 'a';
        expect(utilities.isValidLetter(letter)).toBeTrue();
    });
});
