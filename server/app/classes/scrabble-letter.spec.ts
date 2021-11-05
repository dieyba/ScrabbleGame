/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { ScrabbleLetter } from './scrabble-letter';

describe('ScrabbleLetter', () => {
    it('should create an instance', () => {
        expect(new ScrabbleLetter('a', 1)).to.not.be.undefined;
    });

    // it('tealBonus should mutliply the value by 2', () => {
    //     const letter = new ScrabbleLetter('a', 1);
    //     expect(letter.getTealBonus()).to.equal(2);
    // });

    // it('tealBonus should mutliply the value by 2', () => {
    //     const letter = new ScrabbleLetter('a', 1);
    //     letter.setTealBonus();
    //     expect(letter.value).to.equal(2);
    // });

    // it('darkBlueBonus should mutliply the value by 3', () => {
    //     const letter = new ScrabbleLetter('a', 1);
    //     expect(letter.getDarkBlueBonus()).to.equal(3);
    // });

    // it('darkBlueBonus should mutliply the value by 3', () => {
    //     const letter = new ScrabbleLetter('a', 1);
    //     letter.setDarkBlueBonus();
    //     expect(letter.value).to.equal(3);
    // });
});
