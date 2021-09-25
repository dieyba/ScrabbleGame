import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WordBuilderService {
    /*
  buildWordOnBoard(direction : number) : void{ //direction is either h or v inputed by the user through the communication window
    if(this.validation.isWordValid){ //bug here?
      for(let i = 0; i < this.board.boardSize; i++){
        for(let j = 0; j < this.board.boardSize; j++){ //iterate through the board
          //WORK IN PROGRESS
        }
      }
    }
  }
  */
    /* This function builds a word, given a direction and the very first letter
from the north, east, south or west position. Written to be used in conjunction
with a function that would find all new edges of the scrabble board*/
    /*
    scoreWordInADirection(firstLetter: ScrabbleLetter, direction: number): ScrabbleWord {
        if (direction === 0 || direction === 3) {
            // If the direction is illegal
            // throw exception (TODO)
        }
        const wordInConstruction = new ScrabbleWord();
        wordInConstruction.content[0] = firstLetter;

        let i = 0;
        while (!wordInConstruction.content[i].nextLetters[direction].square.occupied) {
            wordInConstruction.content[i + 1] = wordInConstruction.content[i].nextLetters[direction];
            i++;
        }

        return wordInConstruction;
    }*/
    /* scoreWordFromEdge(firstLetter : ScrabbleLetter) : ScrabbleWord[]{
    let wordsFormed = new ScrabbleWord[];
    let j = 0
    for(let i = 0; i < firstLetter.nextLetters.length; i++){
      wordsFormed[j] = this.buildWordInADirection(firstLetter, i);
      j++;
    }
    return wordsFormed;
    }
  } // Ne fonctionne pas, je ne sais pas pourquoi. Mais c'est l'implémentation
    // que je comptais faire pour la classe un peu plus haut.*/
}
