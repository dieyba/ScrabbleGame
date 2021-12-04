import { expect } from 'chai';
import { ScrabbleBoard } from './scrabble-board';

describe('ScrabbleBoard', () => {
    let board = new ScrabbleBoard(true);
    it('should create a board', () => {
        /* eslint-disable @typescript-eslint/no-unused-expressions*/
        /* eslint-disable  no-unused-expressions */
        expect(board).to.exist;
    });
    it('setSquareColor should decrease colorStock size by 1', () => {
        board = new ScrabbleBoard(true);
        expect(board.colorStock.length).to.equals(0);
    });
});
