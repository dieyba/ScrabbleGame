// TODO: do we need some things from here on the server? delete the rest

import { ScrabbleLetter } from "./scrabble-letter";

// TODO: see if we need all those in server version of utilities

export const ERROR_NUMBER = -1;

export enum Axis {
    H = 'h',
    V = 'v',
}

export const invertAxis = {
    [Axis.H]: Axis.V,
    [Axis.V]: Axis.H, // Vertical is the opposite of horizontal
};

export interface BoardUpdate {
    word: string,
    orientation: Axis, // or string?
    positionX: number,
    positionY: number,
}

export interface LettersUpdate {
    newStock: ScrabbleLetter[],
    newLetters: ScrabbleLetter[];
    newScore: number;
}
