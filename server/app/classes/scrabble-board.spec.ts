import { expect } from 'chai';
import { ScrabbleBoard } from './scrabble-board';

/* eslint-disable  @typescript-eslint/no-unused-expressions */
describe('ScrabbleBoard', () => {
    const board = new ScrabbleBoard(true);
    it('should create a game parameters', () => {
        expect(board).to.exist;
    });
});
