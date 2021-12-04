import { LetterStock } from '@app/classes/letter-stock/letter-stock';
import { expect } from 'chai';
describe('LetterStock', () => {
    const letterStock = new LetterStock();
    it('should create a player', () => {
        expect(letterStock).to.not.equals(undefined);
    });
});