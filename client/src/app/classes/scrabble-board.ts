import { Square, SquareColor } from './square';

const BOARD_SIZE = 15;

/* export enum Quadrant {
    NorthEast = 0,
    NorthWest = 1,
    SouthEast = 2,
    SouthWest = 4,
}*/

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
                // Cross
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
                this.generateRedSquares(i, j);
                this.generateDarkBlueSquares(i, j);
                this.generateTealSquares(i, j);
            }
        }
        // Big cross
        // this.crossBonus(Quadrant.NorthEast);
        // this.crossBonus(Quadrant.SouthWest);
        // this.crossBonus(Quadrant.NorthWest);
        // this.crossBonus(Quadrant.SouthEast);
        // +Side bonuses
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
    /* crossBonus(side: Quadrant): void {
        // does northeast quadrant
        let i = 0;
        let j = 0;
        switch (side) {
            case Quadrant.NorthEast:
                i = this.boardSize - 1;
                break;
            case Quadrant.SouthWest:
                j = this.boardSize - 1;
                break;
            case Quadrant.SouthEast: {
                i = this.boardSize - 1;
                j = this.boardSize - 1;
                break;
            }
            default:
                // NorthWest nothing, since we start at x = 0, y = 0.
                break;
        }
        for (let addedFactor = 0; addedFactor < this.boardSize / 2; addedFactor++) {
            if (addedFactor === 0) {
                this.squares[i][j].color = SquareColor.Red;
            } else if (addedFactor < this.boardSize / 3 && addedFactor !== 0) {
                this.squares[i][j].color = SquareColor.Pink;
            } else
                switch (addedFactor) {
                    case this.boardSize / 3: {
                        // case 5
                        this.squares[i][j].color = SquareColor.DarkBlue;

                        break;
                    }
                    case this.boardSize / 3 + 1: {
                        // case 6
                        this.squares[i][j].color = SquareColor.Teal;

                        break;
                    }
                    case this.boardSize / 2 - 1: {
                        // Étoile
                        this.squares[i][j].color = SquareColor.Pink;

                        break;
                    }
                    default:
                        this.squares[i][j].color = SquareColor.None;
                }

            switch (side) {
                case Quadrant.NorthWest: {
                    i++;
                    j++;
                    break;
                }
                case Quadrant.NorthEast: {
                    i--;
                    j++;
                    break;
                }
                case Quadrant.SouthWest: {
                    i++;
                    j--;
                    break;
                }
                case Quadrant.SouthEast: {
                    i--;
                    j--;
                    break;
                }
                default:
                    // side undefined, throw error
                    break;
            }
        }
    }*/
    sideBonus(): void {
        // TODO : add bonus on top, right, left and right side
    }
}
