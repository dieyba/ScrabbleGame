import { ScrabbleLetter } from "./scrabble-letter";
import { Axis } from "./utilities";

export interface BoardUpdate {
    word: string,
    orientation: Axis, // or string?
    positionX: number,
    positionY: number,
}

export interface LettersUpdate {
    playerIndex: number, // players[] index of the player who exchanged letters
    newStock: ScrabbleLetter[],
    newLetters: ScrabbleLetter[];
    newScore?: number;
}

