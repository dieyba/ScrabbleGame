import { Square, SquareColor } from './square';

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
        if (i === Column.One || i === Column.Fifteen) {
            if (j === Row.D || j === Row.L) {
                this.squares[i][j].color = SquareColor.Teal;
            }
        }
        if (j === Row.A || j === Row.O) {
            if (i === Column.Four || i === Column.Twelve) {
                this.squares[i][j].color = SquareColor.Teal;
            }
        }
    }
}
