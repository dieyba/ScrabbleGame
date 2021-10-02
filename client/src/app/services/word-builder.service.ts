import { Injectable } from '@angular/core';
import { LetterValue } from '@app/classes/letter-stock';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { Square } from '@app/classes/square';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';

@Injectable({
    providedIn: 'root',
})
export class WordBuilderService {
    // All words created from the letters placed on the board

    constructor(private gridService: GridService) {

    }

    // this.gridService.scrabbleBoard.square[][]
    allWordsCreated(word: string, coord : Vec2, axis: WordOrientation): ScrabbleWord[] {
        let newLetters : ScrabbleLetter[] = [];
        for(let i = 0; i < word.length; i++){
          let letterfromString = word[i]
          newLetters[i] = new ScrabbleLetter(letterfromString, LetterValue[letterfromString as keyof typeof LetterValue])
        }
        let wordList: ScrabbleWord[] = [];
        wordList[0] = this.wordify(newLetters);
        let currentTile : Square = this.gridService.scrabbleBoard.squares[coord.x][coord.y];
        let newWord = new ScrabbleWord;
        for(let i = 0; i < word.length; i++){
          if(axis = WordOrientation.Horizontal){
            currentTile = this.gridService.scrabbleBoard.squares[coord.x+i][coord.y];
            newWord = this.completeWordInADirection(currentTile, WordOrientation.Horizontal);
          }
          else{
            currentTile = this.gridService.scrabbleBoard.squares[coord.x][coord.y+i];
            newWord = this.completeWordInADirection(currentTile, WordOrientation.Vertical);
          }
          if(newWord.content.length > 0)
            wordList[i+1] = newWord;
        }
        return wordList;
    }
    
    wordify(letters: ScrabbleLetter[]): ScrabbleWord {
      const word = new ScrabbleWord();
      for(let i = 0; i < letters.length; i++){
          word.content[i] = letters[i];
      }
      return word;
    }

    // THIS FUNCTION WILL BREAK WHEN CODE STRUCTURE CHANGES. BEWARE.
    completeWordInADirection(firstTile: Square, direction: WordOrientation): ScrabbleWord {
        let found : boolean = false;
        let steps = 0;
        if (direction === WordOrientation.Horizontal) {
            while(!found){
              let previoustile = this.gridService.scrabbleBoard.squares[firstTile.position.x-1-steps][firstTile.position.y];
              if(!previoustile.occupied){
                found = true;
              }
              else steps++;
            }
        } else if (direction === WordOrientation.Vertical) {
          while(!found){
            let previoustile = this.gridService.scrabbleBoard.squares[firstTile.position.x][firstTile.position.y-1-steps];
            if(!previoustile.occupied){
              found = true;
            }
            else steps++;
          }
        }
        found = false;
        let currentSquare : Square = this.gridService.scrabbleBoard.squares[firstTile.position.x][firstTile.position.y];
        while(!found){
          if(direction === WordOrientation.Horizontal)
            currentSquare = this.gridService.scrabbleBoard.squares[firstTile.position.x - steps][firstTile.position.y];
          else currentSquare = this.gridService.scrabbleBoard.squares[firstTile.position.x][firstTile.position.y - steps];
            if(!currentSquare.occupied) {
            found = true;
          }
        }
        let end : boolean = false;
        let sizeOfWord = 0;
        let currentSquareLast : Square;
        let letters : ScrabbleLetter[] = [];
        while(!end){
          if(direction = WordOrientation.Horizontal)
            currentSquareLast = this.gridService.scrabbleBoard.squares[currentSquare.position.x+sizeOfWord][currentSquare.position.y];
          else  currentSquareLast = this.gridService.scrabbleBoard.squares[currentSquare.position.x][currentSquare.position.y+sizeOfWord];
          if(!currentSquareLast.occupied)
            end = true
          else {
            letters[sizeOfWord] = currentSquareLast.letter;
            sizeOfWord++;
          }
        }
        return this.wordify(letters);        
    }
}