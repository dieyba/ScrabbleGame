import { ScrabbleLetter } from './scrabble-letter';

export class Player {
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True is it is this players turn, false if not.

    constructor(/*name: string, score:number*/) {
        // this.name = name;
        // this.score = score;
        this.letters = [];
        this.isActive = false;

        // A retirer apres
        this.name = 'bob';
        this.score = 0;

    }
}
