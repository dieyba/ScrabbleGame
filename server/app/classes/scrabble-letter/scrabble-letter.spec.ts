/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { ScrabbleLetter, setLetter } from './scrabble-letter';

describe('ScrabbleLetter', () => {
    it('should create an instance', () => {
        expect(new ScrabbleLetter('a', 1)).to.not.be.undefined;
    });

    it('should set the value with the right number', () => {
        const letter = new ScrabbleLetter('j');
        expect(letter.value).to.equals(8);
    });

    it('setLetter should remove the accents', () => {
        let letter = new ScrabbleLetter('a', 1);
        letter = setLetter('à', letter);
        expect(letter.character).to.equals('a');
    });

    it('setLetter should set empty char', () => {
        let letter = new ScrabbleLetter('z');
        letter = setLetter('', letter);
        expect(letter.character).to.equals('');
        expect(letter.value).to.equals(10);
    });

    it('setLetter should set * char', () => {
        let letter = new ScrabbleLetter('z');
        letter = setLetter('*', letter);
        expect(letter.character).to.equals('*');
        expect(letter.whiteLetterCharacter).to.equals('*');
        expect(letter.value).to.equals(10);
    });

    it('setLetter should set * char and its letter value', () => {
        let letter = new ScrabbleLetter('z');
        letter = setLetter('E', letter);
        expect(letter.character).to.equals('*');
        expect(letter.whiteLetterCharacter).to.equals('E');
        expect(letter.value).to.equals(10);
    });
});
