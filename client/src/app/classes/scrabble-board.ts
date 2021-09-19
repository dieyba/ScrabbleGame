import { Square, SquareColor } from './square';

const BOARD_SIZE = 15;

export enum Quadrant {
    NorthEast = 0,
    NorthWest = 1,
    SouthEast = 2,
    SouthWest = 4,
}

export class ScrabbleBoard {
    squares: Square[][];
    boardSize: number = BOARD_SIZE;

    constructor() {
        this.squares = [];
        for (let i = 0; i < this.boardSize; i++) {
            this.squares[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.squares[i][j] = new Square(i, j);
            }
        }
        this.generateBoard();
    }

    generateBoard(): void {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.squares[i][j].occupied = false;
                this.squares[i][j].position.x = i;
                this.squares[i][j].position.y = j;
                this.squares[i][j].color = SquareColor.None;

                // Appliquer les boni par la suite avec un service de calcul de boni
            }
        }
        // Big cross
        this.crossBonus(Quadrant.NorthEast);
        this.crossBonus(Quadrant.SouthWest);
        this.crossBonus(Quadrant.NorthWest);
        this.crossBonus(Quadrant.SouthEast);
        // +Side bonuses
        // TODO
    }
    crossBonus(side: Quadrant): void {
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
    }
    sideBonus(): void {
        // TODO : add bonus on top, right, left and right side
    }
}
