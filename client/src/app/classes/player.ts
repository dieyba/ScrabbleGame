import { ScrabbleLetter } from './scrabble-letter';

export interface Player {
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True is it is this players turn, false if not.
}
