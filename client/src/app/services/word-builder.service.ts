import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';

@Injectable({
  providedIn: 'root'
})

/*This function builds a word, given a direction and the very first letter
from the north, east, south or west position. Written to be used in conjunction
with a function that would find all new edges of the scrabble board*/
export class WordBuilderService {

  buildWordInADirection(firstLetter : ScrabbleLetter, direction : number) : ScrabbleWord {
    let wordInConstruction = new ScrabbleWord;
    wordInConstruction.content[0] = firstLetter;
    
    let i = 0;
    while(wordInConstruction.content[i].nextLetters[direction] != null){
      wordInConstruction.content[i+1] = wordInConstruction.content[i].nextLetters[direction];
      i++;
    }

    return wordInConstruction;
  }

  /*buildWordFromEdge(firstLetter : ScrabbleLetter) : ScrabbleWord[]{
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
