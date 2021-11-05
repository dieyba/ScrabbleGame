import { expect } from 'chai';
import { ScrabbleLetter } from './scrabble-letter';

describe('ScrabbleLetter', () => {
    it('should create an instance', () => {
        expect(new ScrabbleLetter('a', 1)).to.not.be.undefined;
    });

});
