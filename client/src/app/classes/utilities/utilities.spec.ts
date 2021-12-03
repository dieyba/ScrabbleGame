import { Column, Row } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { Vec2 } from '@app/classes/vec2/vec2';
import * as utilities from './utilities';
import { isCoordInsideBoard } from './utilities';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('ScrabbleWord', () => {
    it('scrabbleLettersToString should convert a scrabble letter tab to a string', () => {
        const scrabbleLetters = [new ScrabbleLetter('t'), new ScrabbleLetter('e'), new ScrabbleLetter('s'), new ScrabbleLetter('t')];
        const stringWord = utilities.scrabbleLettersToString(scrabbleLetters);
        expect(stringWord).toEqual('test');
    });

    it('convertStringToCoord should convert the string row and columns to coordinates with x and y between 0 to 14', () => {
        const coords = utilities.convertStringToCoord('f', '4') as Vec2;
        expect(coords.x).toEqual(3);
        expect(coords.y).toEqual(5);

        const wrongCoords = utilities.convertStringToCoord('l', '19');
        expect(wrongCoords).not.toBeTruthy();
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

    it('isValidLetter should return false if it is not a letter, if it has an accent of if the string is empty', () => {
        let letter = 'à';
        expect(utilities.isValidLetter(letter)).toBeFalse();

        letter = 'a';
        expect(utilities.isValidLetter(letter)).toBeTrue();

        letter = '';
        expect(utilities.isValidLetter(letter)).toBeFalse();
    });

    it('isCoordInsideBoard should return true for valid coordinates only', () => {
        expect(isCoordInsideBoard(new Vec2(Column.One, Row.A))).toBeTrue();
        expect(isCoordInsideBoard(new Vec2(Column.Fifteen, Row.O))).toBeTrue();
        expect(isCoordInsideBoard(new Vec2(Column.One - 1, Row.A))).toBeFalse();
        expect(isCoordInsideBoard(new Vec2(Column.One, Row.A - 1))).toBeFalse();
        expect(isCoordInsideBoard(new Vec2(Column.Fifteen + 1, Row.O))).toBeFalse();
        expect(isCoordInsideBoard(new Vec2(Column.Fifteen, Row.O + 1))).toBeFalse();
    });
});
