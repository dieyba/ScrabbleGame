import { expect } from 'chai';
import { Player } from './player';

/* eslint-disable  @typescript-eslint/no-unused-expressions */
describe('GameParameters', () => {
    const player = new Player('DIEYBA', '');
    it('should create a game parameters', () => {
        expect(player).to.exist;
    });
});
