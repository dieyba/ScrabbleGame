import { ScrabbleLetter } from '../scrabble-letter/scrabble-letter';
export const RACK_SIZE = 7;
export class ScrabbleRack {
    letters: ScrabbleLetter[];

    constructor() {
        this.letters = [];
        for (let i = 0; i < RACK_SIZE; i++) {
            this.letters[i] = new ScrabbleLetter('', 0);
        }
    }
}
