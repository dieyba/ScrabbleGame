import { ColorQuantity, Square, SquareColor } from '../square/square';

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

    constructor(isRandom: boolean) {
        this.actualBoardSize == BOARD_SIZE - 1;
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
        this.generateBoard(isRandom);
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
}
