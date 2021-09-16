import { Square, SquareColor } from "./square";

export enum Quadrant{
    NorthEast = 0,
    NorthWest = 1,
    SouthEast = 2,
    SouthWest = 4
}

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
        //Big cross
        this.crossBonus(Quadrant.NorthEast);
        this.crossBonus(Quadrant.SouthWest);
        this.crossBonus(Quadrant.NorthWest);
        this.crossBonus(Quadrant.SouthEast);
        //Side bonuses

    }
    crossBonus(side : Quadrant) : void{ //does northeast quadrant
        let i = 0;
        let j = 0;
        switch (side){
            case Quadrant.NorthWest:
                //nothing, since we start at x = 0, y = 0.
            break;
            case Quadrant.NorthEast:
                i = this.boardSize-1;
            break;
            case Quadrant.SouthWest:
                j = this.boardSize-1
            break;
            case Quadrant.SouthEast:{
                i = this.boardSize-1;
                j = this.boardSize-1;
            break;
            }
            default :
            //side undefined, throw error
            break;
        }
        for(let addedFactor = 0; addedFactor < this.boardSize/2; addedFactor++){
            if(addedFactor == 0){
                this.squares[i][j].color = SquareColor.Red;
            }
            else if(addedFactor < 5 && addedFactor != 0){
                this.squares[i][j].color = SquareColor.Pink;
            }
            else if(addedFactor == 5){
                this.squares[i][j].color = SquareColor.DarkBlue;
            }
            else if(addedFactor == 6){
                this.squares[i][j].color = SquareColor.Teal;
            }
            else if(addedFactor == (this.boardSize/2 - 1)){
                this.squares[i][j].color = SquareColor.Pink;
            }
            else this.squares[i][j].color = SquareColor.None;

            switch (side){
                case Quadrant.NorthWest:{
                    i++;
                    j++;
                    break;
                }
                case Quadrant.NorthEast:{
                    i--;
                    j++;
                    break;
                }
                case Quadrant.SouthWest:{
                    i++;
                    j--;
                    break;
                }
                case Quadrant.SouthEast:{
                    i--;
                    j--;
                break;
                }
                default :
                //side undefined, throw error
                break;
            }
        }
    }
    sideBonus() : void{
        //TODO : add bonus on top, right, left and right side
    }
}

