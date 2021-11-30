import { ScrabbleLetter } from './scrabble-letter/scrabble-letter';
import { Axis } from './utilities/utilities';

export interface BoardUpdate {
    word: string;
    orientation: Axis; // or string?
    positionX: number;
    positionY: number;
}

export interface LettersUpdate {
    newStock: ScrabbleLetter[];
    newLetters: ScrabbleLetter[];
    newScore: number;
}
