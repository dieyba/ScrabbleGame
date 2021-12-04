import { Column, Row } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { Vec2 } from '@app/classes/vec2/vec2';

const PARSE_INT_BASE = 10;
const ROW_OFFSET = 'a'.charCodeAt(0);
const COLUMN_OFFSET = 1;
export const ERROR_NUMBER = -1;
export const MIN_WORD_LENGTH = 2;

export enum Axis {
    H = 'h',
    V = 'v',
}

export const invertAxis = {
    [Axis.H]: Axis.V,
    [Axis.V]: Axis.H, // Vertical is the opposite of horizontal
};

export const scrabbleLettersToString = (letters: ScrabbleLetter[]): string => {
    let stringLetters = '';
    for (const letter of letters) {
        stringLetters += letter.character === '*' ? letter.whiteLetterCharacter : letter.character;
    }
    return stringLetters.toLowerCase();
};

/**
 * Converts the string row and columns to coordinates with x and y between 0 to 14.
 *
 * @param row String of the row number in letters
 * @param column string of the column number
 * @returns Vec2 of numbers x and y
 */
export const convertStringToCoord = (row: string, column: string): Vec2 | undefined => {
    let columnNumber = parseInt(column, PARSE_INT_BASE);
    if (columnNumber !== null) {
        columnNumber = columnNumber - COLUMN_OFFSET;
        // For place command, row input is not accepted if its a capital letters
        const rowNumber = row.charCodeAt(0) - ROW_OFFSET;
        const isValidRow = rowNumber >= Row.A && rowNumber <= Row.O;
        const isValidColumn = columnNumber >= Column.One && columnNumber <= Column.Fifteen;
        if (isValidRow && isValidColumn) {
            return new Vec2(columnNumber, rowNumber);
        }
    }
    return undefined;
};

export const convertCoordToString = (position: Vec2): string => {
    const rowLetter = String.fromCharCode(position.y + ROW_OFFSET);
    const columnNumber = position.x + COLUMN_OFFSET;
    return rowLetter.toString() + columnNumber.toString();
};

/**
 * Removes white spaces at the beginning and end of a string.
 *
 * @param userInput string Input from the user
 * @returns String without beginning and ending spaces. Returns empty string if it only had white spaces
 */
export const trimSpaces = (userInput: string): string => {
    while (userInput.startsWith(' ')) {
        userInput = userInput.substring(1);
    }
    while (userInput.endsWith(' ')) {
        userInput = userInput.substring(0, userInput.length - 1);
    }

    return userInput;
};

/**
 * Checks if a string is empty or filled only with white spaces.
 *
 * @param userInput string Input from the user
 * @returns True if empty string or white space only string
 */
export const isEmpty = (userInput: string) => {
    userInput = trimSpaces(userInput);
    return userInput === '';
};

export const isAllLowerLetters = (letters: string): boolean => {
    return letters.toLowerCase() === letters;
};

export const removeAccents = (letters: string): string => {
    return letters.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Returns true if it is  a letter. False if it is not or has an accent or ç
 */
export const isValidLetter = (letter: string): boolean => {
    if (!isEmpty(letter) && letter.length === 1) {
        const charCode = letter.toLowerCase().charCodeAt(0);
        const isALetter = charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0);
        return isALetter;
    }
    return false;
};

export const isCoordInsideBoard = (coord: Vec2) => {
    const isValidColumn = coord.x >= Column.One && coord.x <= Column.Fifteen;
    const isValidRow = coord.y >= Row.A && coord.y <= Row.O;
    return isValidColumn && isValidRow;
};

export const convertYAxisToLetterCoordinates = (y: number): string => {
    return String.fromCharCode('a'.charCodeAt(0) + y);
};
