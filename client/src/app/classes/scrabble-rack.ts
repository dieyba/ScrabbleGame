import { Square } from './square';

const RACK_SIZE = 7;

export class ScrabbleRack {
    squares: Square[];

    constructor() {
        this.squares = [];
        for (let i = 0; i < RACK_SIZE; i++) {
            this.squares[i] = new Square(i, 0);
        }
    }
}
