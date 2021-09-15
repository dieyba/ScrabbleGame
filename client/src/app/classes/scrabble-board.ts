import { Square, SquareColor } from "./square";

export class ScrabbleBoard {
    squares : Square[][];
    boardSize : number = 15;
    generateBoard() : void {
        for(let i = 0; i < this.boardSize; i++){
            for(let j = 0; j < this.boardSize; j++){
                this.squares[i][j].occupied = false;
                this.squares[i][j].position.x = i;
                this.squares[i][j].position.y = j;
                this.squares[i][j].color = SquareColor.None;
                //Appliquer les boni par la suite avec un service de calcul de boni
                    }
                }
            }
        }
    }
}

