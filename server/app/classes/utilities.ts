import { ScrabbleLetter } from './scrabble-letter';

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

export const isAllLowerLetters = (letters: string): boolean => {
    return letters.toLowerCase() === letters;
};

export const removeAccents = (letters: string): string => {
    return letters.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const isValidLetter = (letter: string): boolean => {
    if (letter.length === 1) {
        const charCode = letter.toLowerCase().charCodeAt(0);
        const isALetter = charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0);
        return isALetter;
    }
    return false;
};
