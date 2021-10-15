import { Square } from './square';

export const BOARD_SIZE = 15;

export class ScrabbleBoard {
    squares: Square[][];
    actualBoardSize: number = BOARD_SIZE - 1;
}
