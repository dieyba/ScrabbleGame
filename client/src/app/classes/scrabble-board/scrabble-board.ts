import { ColorQuantity, Square, SquareColor } from '@app/classes/square/square';
import { Axis, isCoordInsideBoard } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';

export const BOARD_SIZE = 15;

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
    actualBoardSize: number;
    colorStock: SquareColor[];

    constructor(initParam?: boolean | Square[][]) {
        this.actualBoardSize = BOARD_SIZE - 1;
        // in solo mode, game service initializes the board on the client, initParam tells if the board has random bonus tile
        if (typeof initParam === 'boolean') {
            this.squares = [];
            this.colorStock = [];
            this.addColorToStock(SquareColor.DarkBlue, ColorQuantity.DarkBlue);
            this.addColorToStock(SquareColor.Teal, ColorQuantity.Teal);
            this.addColorToStock(SquareColor.Red, ColorQuantity.Red);
            this.addColorToStock(SquareColor.Pink, ColorQuantity.Pink);
            for (let i = 0; i < BOARD_SIZE; i++) {
                this.squares[i] = [];
                for (let j = 0; j < BOARD_SIZE; j++) {
                    this.squares[i][j] = new Square(i, j);
                }
            }
            this.generateBoard(initParam);
        } else if (initParam instanceof Array) {
            // Multiplayer game already has the board initialized in the server, initParam is the squares matrix
            this.squares = initParam;
        }
    }

    addColorToStock(color: SquareColor, quantity: number): void {
        for (let i = 0; i < quantity; i++) {
            this.colorStock.push(color);
        }
    }

    setSquareColor(i: number, j: number, color: SquareColor, isRandom: boolean) {
        if (this.squares[i][j].color === SquareColor.None && this.colorStock.length !== 0) {
            if (isRandom) {
                const index = Math.floor(Math.random() * this.colorStock.length);
                this.squares[i][j].color = this.colorStock[index];
                this.colorStock.splice(index, 1);
            } else {
                this.squares[i][j].color = color;
            }
        }
    }

    generateBoard(isRandom: boolean): void {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                this.generateCrossSquares(i, j, isRandom);
                this.generateRedSquares(i, j, isRandom);
                this.generateDarkBlueSquares(i, j, isRandom);
                this.generateTealSquares(i, j, isRandom);
                this.generateTealSquaresArrows(i, j, isRandom);
            }
        }
    }

    generateCrossSquares(i: number, j: number, isRandom: boolean) {
        if (i === j || i === this.actualBoardSize - j) {
            if (i === Column.One || i === this.actualBoardSize) {
                this.setSquareColor(i, j, SquareColor.Red, isRandom);
            }
            if ((i > Column.One && i < Column.Six) || (i > Column.Ten && i < Column.Fifteen) || i === Column.Eight) {
                this.setSquareColor(i, j, SquareColor.Pink, isRandom);
            }
            if (i === Column.Seven || i === Column.Nine) {
                this.setSquareColor(i, j, SquareColor.Teal, isRandom);
            }
        }
    }

    generateRedSquares(i: number, j: number, isRandom: boolean) {
        if (Math.abs(i - j) === this.actualBoardSize / 2 && (i === Column.Eight || j === Row.H)) {
            this.setSquareColor(i, j, SquareColor.Red, isRandom);
        }
    }

    generateDarkBlueSquares(i: number, j: number, isRandom: boolean) {
        if (i === Column.Six || i === Column.Ten) {
            if (j === Row.B || j === Row.F || j === Row.J || j === Row.N) {
                this.setSquareColor(i, j, SquareColor.DarkBlue, isRandom);
            }
        }
        if (j === Row.F || j === Row.J) {
            if (i === Column.Two || i === Column.Six || i === Column.Ten || i === Column.Fourteen) {
                this.setSquareColor(i, j, SquareColor.DarkBlue, isRandom);
            }
        }
    }

    generateTealSquares(i: number, j: number, isRandom: boolean) {
        if ((i === Column.One || i === Column.Fifteen) && (j === Row.D || j === Row.L)) {
            this.setSquareColor(i, j, SquareColor.Teal, isRandom);
        }
        if ((j === Row.A || j === Row.O) && (i === Column.Four || i === Column.Twelve)) {
            this.setSquareColor(i, j, SquareColor.Teal, isRandom);
        }
    }

    generateTealSquaresArrows(i: number, j: number, isRandom: boolean) {
        if ((i === Column.Seven || i === Column.Nine) && (j === Row.C || j === Row.M)) {
            this.setSquareColor(i, j, SquareColor.Teal, isRandom);
        }
        if ((j === Row.G || j === Row.I) && (i === Column.Three || i === Column.Thirteen)) {
            this.setSquareColor(i, j, SquareColor.Teal, isRandom);
        }
        if (i === Column.Eight && (j === Row.D || j === Row.L)) {
            this.setSquareColor(i, j, SquareColor.Teal, isRandom);
        }
        if (j === Row.H && (i === Column.Four || i === Column.Twelve)) {
            this.setSquareColor(i, j, SquareColor.Teal, isRandom);
        }
    }

    isWordInsideBoard(word: string, coord: Vec2, orientation: string): boolean {
        if (!isCoordInsideBoard(coord)) {
            return false;
        }
        // verifying if the word is longer than the board's edges
        return orientation === 'h' ? coord.x + word.length <= Row.Length : coord.y + word.length <= Column.Length;
    }

    isWordPassingInCenter(word: string, coord: Vec2, orientation: string): boolean {
        const tempCoord = new Vec2(coord.x, coord.y);
        // Checking if word passing middle vertically
        const isWordInMiddleColumn = tempCoord.x === Column.Eight && orientation === Axis.V;
        const isVerticalWordOnCenter = tempCoord.y < Row.I && tempCoord.y + word.length - 1 >= Row.H;
        // Checking if word passing middle horizontally
        const isWordInMiddleRow = tempCoord.y === Row.H && orientation === 'h';
        const isHorizontalWordOnCenter = tempCoord.x < Column.Nine && tempCoord.x + word.length - 1 >= Column.Eight;
        return (isWordInMiddleColumn && isVerticalWordOnCenter) || (isWordInMiddleRow && isHorizontalWordOnCenter);
    }

    isWordPartOfAnotherWord(word: string, coord: Vec2, orientation: string): boolean {
        let isPartOfAnotherWord = false;
        // For each letter in the word to place, verifies if a Scrabble letter is already placed and if it's the same letter
        for (let i = 0; i < word.length; i++) {
            const tempCoord = orientation === 'v' ? new Vec2(coord.x, coord.y + i) : new Vec2(coord.x + i, coord.y);
            if (!this.squares[tempCoord.x][tempCoord.y].occupied) {
                continue;
            }
            const letterOnBoard = this.squares[tempCoord.x][tempCoord.y].letter;
            if (this.squares[tempCoord.x][tempCoord.y].occupied) {
                isPartOfAnotherWord =
                    letterOnBoard.character === '*' ? letterOnBoard.whiteLetterCharacter === word[i] : letterOnBoard.character === word[i];
            }
            if (!isPartOfAnotherWord) return isPartOfAnotherWord;
        }
        return isPartOfAnotherWord;
    }

    // eslint-disable-next-line complexity
    isWordTouchingOtherWord(word: string, coord: Vec2, orientation: string): boolean {
        // Checking if touching word before or after
        const coordBeforeWord = new Vec2();
        const coordAfterWord = new Vec2();
        if (orientation === Axis.V) {
            coordBeforeWord.x = coordAfterWord.x = coord.x;
            if (coord.y === 0) coordBeforeWord.y = coord.y;
            else coordBeforeWord.y = coord.y - 1;
            if (coord.y + word.length > BOARD_SIZE) return false;
            coordAfterWord.y = coord.y + word.length;
        } else {
            coordBeforeWord.y = coordAfterWord.y = coord.y;
            if (coord.x === 0) coordBeforeWord.x = coord.x;
            else coordBeforeWord.x = coord.x - 1;
            if (coord.x + word.length > BOARD_SIZE) return false;
            coordAfterWord.x = coord.x + word.length;
        }

        if (isCoordInsideBoard(coordBeforeWord)) {
            if (this.squares[coordBeforeWord.x][coordBeforeWord.y].occupied) {
                return true;
            }
        }
        if (isCoordInsideBoard(coordBeforeWord)) {
            if (this.squares[coordAfterWord.x][coordAfterWord.y].occupied) {
                return true;
            }
        }
        // Checking if touching word lengthwise (down if horizontal, right if vertical)
        const tempCoord = new Vec2();
        for (let i = 0; i < word.length; i++) {
            if (orientation === Axis.V) {
                tempCoord.x = coord.x + 1;
                tempCoord.y = coord.y + i;
            } else {
                tempCoord.y = coord.y + 1;
                tempCoord.x = coord.x + i;
            }
            if (isCoordInsideBoard(tempCoord) && this.squares[tempCoord.x][tempCoord.y].occupied) {
                return true;
            }
        }

        // Checking if touching word lengthwise (up if horizontal, left if vertical)
        for (let i = 0; i < word.length; i++) {
            if (orientation === Axis.V) {
                tempCoord.x = coord.x - 1;
                tempCoord.y = coord.y + i;
            } else {
                tempCoord.y = coord.y - 1;
                tempCoord.x = coord.x + i;
            }
            if (isCoordInsideBoard(tempCoord) && this.squares[tempCoord.x][tempCoord.y].occupied) {
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
                tempString +=
                    this.squares[tempCoord.x][tempCoord.y].letter.value === 0
                        ? this.squares[tempCoord.x][tempCoord.y].letter.whiteLetterCharacter
                        : this.squares[tempCoord.x][tempCoord.y].letter.character;
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
