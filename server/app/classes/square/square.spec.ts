import { expect } from 'chai';
import { Square } from './square';

/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
describe('Square', () => {
    it('should create an instance', () => {
        expect(new Square(0, 0)).to.exist;
    });
});
