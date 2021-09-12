import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import { ScrabbleLetter } from "./scrabble-letter";

export class ScrabbleWord {
    content : ScrabbleLetter[]; //Array of ScrabbleLetters continually growing to represent the word
    totalValue() : number {
        let total = 0;
        let  i = 0;
        for(let i = 0; i < this.content.length; i++){
            //TODO : Account for teal/blue bonuses
            total += this.content[i].value; 
        }
        //TODO: Add pink/red bonuses
        return total;
    }
}
