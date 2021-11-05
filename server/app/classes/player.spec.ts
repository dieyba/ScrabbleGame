import { expect } from 'chai';
import { Player } from './player';

describe('GameParameters', () => {
    let player = new Player('DIEYBA', '');
    it('should create a game parameters', () => {
        expect(player).to.exist;
    });
});