import { expect } from 'chai';
import * as utilities from './utilities';

/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
describe('Square', () => {

    it('isAllLowerLetters should return true if all the caracters of the string are low case', () => {
        let word = 'TeSt';
        expect(utilities.isAllLowerLetters(word)).to.equals(false);

        word = 'test';
        expect(utilities.isAllLowerLetters(word)).to.equals(true);
    });

    it('removeAccents should remove the accents', () => {
        const word = 'àéù';
        expect(utilities.removeAccents(word)).to.equals('aeu');
    });
});
