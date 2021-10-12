import { Square, SquareColor } from './square';
import { Vec2 } from './vec2';

const BOARD_SIZE = 15;

export enum Row {
    A = 0,
    B = 1,
    C = 2,
    D = 3,
    E = 4,
    F = 5,
    G = 6,
    H = 7,
    I = 8,
    J = 9,
    K = 10,
    L = 11,
    M = 12,
    N = 13,
    O = 14,
    Length,
}

export enum Column {
    One = 0,
    Two = 1,
    Three = 2,
    Four = 3,
    Five = 4,
    Six = 5,
    Seven = 6,
    Eight = 7,
    Nine = 8,
    Ten = 9,
    Eleven = 10,
    Twelve = 11,
    Thirteen = 12,
    Fourteen = 13,
    Fifteen = 14,
    Length,
}

export class ScrabbleBoard {
    squares: Square[][];
    actualBoardSize: number = BOARD_SIZE - 1;

    constructor() {
        this.squares = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            this.squares[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                this.squares[i][j] = new Square(i, j);
            }
        }
        this.generateBoard();
    }

    generateBoard(): void {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                this.generateCrossSquares(i, j);
                this.generateRedSquares(i, j);
                this.generateDarkBlueSquares(i, j);
                this.generateTealSquares(i, j);
                this.generateTealSquaresArrows(i, j);
            }
        }
    }

    generateCrossSquares(i: number, j: number) {
        if (i === j || i === this.actualBoardSize - j) {
            if (i === Column.One || i === this.actualBoardSize) {
                this.squares[i][j].color = SquareColor.Red;
            }
            if ((i > Column.One && i < Column.Six) || (i > Column.Ten && i < Column.Fifteen) || i === Column.Eight) {
                this.squares[i][j].color = SquareColor.Pink;
            }
            if (i === Column.Seven || i === Column.Nine) {
                this.squares[i][j].color = SquareColor.Teal;
            }
        }
    }

    generateRedSquares(i: number, j: number) {
        if (Math.abs(i - j) === this.actualBoardSize / 2 && (i === Column.Eight || j === Row.H)) {
            this.squares[i][j].color = SquareColor.Red;
        }
    }

    generateDarkBlueSquares(i: number, j: number) {
        if (i === Column.Six || i === Column.Ten) {
            if (j === Row.B || j === Row.F || j === Row.J || j === Row.N) {
                this.squares[i][j].color = SquareColor.DarkBlue;
            }
        }
        if (j === Row.F || j === Row.J) {
            if (i === Column.Two || i === Column.Six || i === Column.Ten || i === Column.Fourteen) {
                this.squares[i][j].color = SquareColor.DarkBlue;
            }
        }
    }

    generateTealSquares(i: number, j: number) {
        if ((i === Column.One || i === Column.Fifteen) && (j === Row.D || j === Row.L)) {
            this.squares[i][j].color = SquareColor.Teal;
        }
        if ((j === Row.A || j === Row.O) && (i === Column.Four || i === Column.Twelve)) {
            this.squares[i][j].color = SquareColor.Teal;
        }
    }

    generateTealSquaresArrows(i: number, j: number) {
        if ((i === Column.Seven || i === Column.Nine) && (j === Row.C || j === Row.M)) {
            this.squares[i][j].color = SquareColor.Teal;
        }
        if ((j === Row.G || j === Row.I) && (i === Column.Three || i === Column.Thirteen)) {
            this.squares[i][j].color = SquareColor.Teal;
        }
        if (i === Column.Eight && (j === Row.D || j === Row.L)) {
            this.squares[i][j].color = SquareColor.Teal;
        }
        if (j === Row.H && (i === Column.Four || i === Column.Twelve)) {
            this.squares[i][j].color = SquareColor.Teal;
        }
    }

    isCoordInsideBoard(coord: Vec2): boolean {
        const isValidColumn = coord.x >= Column.One && coord.x <= Column.Fifteen;
        const isValidRow = coord.y >= Row.A && coord.y <= Row.O;
        return isValidColumn && isValidRow;
    }

    isWordInsideBoard(word: string, coord: Vec2, orientation: string): boolean {
        // Verifying if coordinates are good
        if (!this.isCoordInsideBoard(coord)) {
            return false;
        }
        // Verifying if word is too long to stay inside board
        if (orientation === 'h' && coord.x + word.length > Row.Length) {
            return false;
        }
        if (orientation === 'v' && coord.y + word.length > Column.Length) {
            return false;
        }

        return true;
    }

    isWordPassingInCenter(word: string, coord: Vec2, orientation: string): boolean {
        const tempCoord = new Vec2(coord.x, coord.y);
        // Checking if word passing middle vertically
        const isWordInMiddleColumn = tempCoord.x === Column.Eight && orientation === 'v';
        const isVerticalWordOnCenter = tempCoord.y < Row.I && tempCoord.y + word.length - 1 >= Row.H;
        if (isWordInMiddleColumn) {
            if (isVerticalWordOnCenter) {
                return true;
            }
        }

        // Checking if word passing middle horizontally
        const isWordInMiddleRow = tempCoord.y === Row.H && orientation === 'h';
        const isHorizontalWordOnCenter = tempCoord.x < Column.Nine && tempCoord.x + word.length - 1 >= Column.Eight;
        if (isWordInMiddleRow) {
            if (isHorizontalWordOnCenter) {
                return true;
            }
        }
        return false;
    }
    isWordPartOfAnotherWord(word: string, coord: Vec2, orientation: string): boolean {
        let result = false;
        const isVertical = orientation === 'v';

        // For each letter in "word", verifies if a Scrabble letter is already place and if it's the same letter
        for (let i = 0; i < word.length; i++) {
            const tempCoord = new Vec2(coord.x, coord.y);
            if (isVertical) {
                tempCoord.y += i;
            } else {
                tempCoord.x += i;
            }

            if (this.squares[tempCoord.x][tempCoord.y].occupied) {
                // Checking if the letter corresponds with the string's character
                if (this.squares[tempCoord.x][tempCoord.y].letter.character.toLowerCase() === word[i]) {
                    result = true;
                } else {
                    return false;
                }
            }
        }

        return result;
    }

    isWordTouchingOtherWord(word: string, coord: Vec2, orientation: string): boolean {
        // Checking if touching word before or after
        const coordBeforeWord = new Vec2();
        const coordAfterWord = new Vec2();

        if (orientation === 'v') {
            coordBeforeWord.x = coordAfterWord.x = coord.x;
            coordBeforeWord.y = coord.y - 1;
            coordAfterWord.y = coord.y + word.length;
        } else {
            coordBeforeWord.y = coordAfterWord.y = coord.y;
            coordBeforeWord.x = coord.x - 1;
            coordAfterWord.x = coord.x + word.length;
        }

        if (this.isCoordInsideBoard(coordBeforeWord)) {
            if (this.squares[coordBeforeWord.x][coordBeforeWord.y].occupied) {
                return true;
            }
        }
        if (this.isCoordInsideBoard(coordBeforeWord)) {
            if (this.squares[coordAfterWord.x][coordAfterWord.y].occupied) {
                return true;
            }
        }
        // Checking if touching word lengthwise (down if horizontal, right if vertical)
        const tempCoord = new Vec2();
        for (let i = 0; i < word.length; i++) {
            if (orientation === 'v') {
                tempCoord.x = coord.x + 1;
                tempCoord.y = coord.y + i;
            } else {
                tempCoord.y = coord.y + 1;
                tempCoord.x = coord.x + i;
            }
            if (this.isCoordInsideBoard(tempCoord) && this.squares[tempCoord.x][tempCoord.y].occupied) {
                return true;
            }
        }

        // Checking if touching word lengthwise (up if horizontal, left if vertical)
        for (let i = 0; i < word.length; i++) {
            if (orientation === 'v') {
                tempCoord.x = coord.x - 1;
                tempCoord.y = coord.y + i;
            } else {
                tempCoord.y = coord.y - 1;
                tempCoord.x = coord.x + i;
            }
            if (this.isCoordInsideBoard(tempCoord) && this.squares[tempCoord.x][tempCoord.y].occupied) {
                return true;
            }
        }

        return false;
    }

    /**
     * @summary Returns a string representing the scrabble letters on the board. When there is not letter
     * at a given location, a space character is return instead. White letter will be returned as
     * the letter they represent (not as uppercase).
     * @param coord Coordinates of the first letter
     * @param length Length of the word to check
     * @param orientation Vertical ('v') or horizontal ('h')
     * @returns The string representation of scrabble letters
     */
    getStringFromCoord(coord: Vec2, length: number, orientation: string): string {
        const tempCoord = new Vec2(coord.x, coord.y);
        let tempString = '';
        for (let i = 0; i < length; i++) {
            if (this.squares[tempCoord.x][tempCoord.y].occupied) {
                tempString += this.squares[tempCoord.x][tempCoord.y].letter.character;
            } else {
                tempString += ' ';
            }
            if (orientation === 'h') {
                tempCoord.x++;
            } else {
                tempCoord.y++;
            }
        }
        return tempString;
    }
}
