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
                this.squares[i][j] = new Square();
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
                
                    default:{
                        this.squares[i][j].color = SquareColor.None;
                        break;
                    }
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
        //TEAL AND BLUE SIDE BONUSES
        let i = 0;
        let j = 3
        let color = SquareColor.Teal;
        for(let k = 0; k < 4; k++){
            this.squares[i][j].color = color;
            this.squares[j][i].color = color;
            this.squares[i][this.boardSize-j-1].color = color;
            this.squares[j][this.boardSize-i-1].color = color;
            this.squares[this.boardSize-j-1][i].color = color;
            this.squares[this.boardSize-i-1][j].color = color;
            this.squares[this.boardSize-i-1][this.boardSize-j-1].color = color;
            this.squares[this.boardSize-j-1][this.boardSize-i-1].color = color;
            i++;
            color = SquareColor.Teal;
            if(k = 0){
                j += 2;
                color = SquareColor.DarkBlue;
            }
            else j++;
        }
        //Missing red bonuses
        color = SquareColor.Red;
        i = 0;
        for(let l = 0; l < 3; l++){
            this.squares[0][i].color = color;
            if(i == ((this.boardSize-1)/2)){
                color = SquareColor.Pink; //STAR
            }
            this.squares[(this.boardSize-1)/2][i].color = color;
            color = SquareColor.Red;
            this.squares[this.boardSize-1][i].color = color;
            i += (this.boardSize-1)/2;
        }
    }
}
