import { ScrabbleLetter } from './scrabble-letter';

export abstract class Player {
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True is it is this players turn, false if not.

    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.letters = [];
        this.isActive = false;
    }
}
