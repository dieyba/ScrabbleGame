import { ScrabbleLetter } from './scrabble-letter';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('ScrabbleLetter', () => {
    it('should create an instance', () => {
        expect(new ScrabbleLetter('a', 1)).toBeTruthy();
    });

    it('should set the value with the right number', () => {
        const letter = new ScrabbleLetter('j');
        expect(letter.value).toEqual(8);
    });

    it('setLetter should remove the accents', () => {
        const letter = new ScrabbleLetter('a', 1);
        letter.setLetter('à');
        expect(letter.character).toEqual('a');
    });

    it('setLetter should set empty char', () => {
        const letter = new ScrabbleLetter('z');
        letter.setLetter('');
        expect(letter.character).toEqual('');
        expect(letter.value).toEqual(0);
    });

    it('setLetter should set * char', () => {
        const letter = new ScrabbleLetter('z');
        letter.setLetter('*');
        expect(letter.character).toEqual('*');
        expect(letter.whiteLetterCharacter).toEqual('*');
        expect(letter.value).toEqual(0);
    });

    it('setLetter should set * char and its letter value', () => {
        const letter = new ScrabbleLetter('z');
        letter.setLetter('E');
        expect(letter.character).toEqual('*');
        expect(letter.whiteLetterCharacter).toEqual('E');
        expect(letter.value).toEqual(0);
    });
});
