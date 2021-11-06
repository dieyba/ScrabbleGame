import { expect } from 'chai';
import { ScrabbleBoard } from './scrabble-board';

describe('ScrabbleBoard', () => {
    let board = new ScrabbleBoard(true);
    it('should create a game parameters', () => {
        expect(board).to.exist;
    });
});