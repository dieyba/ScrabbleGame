import { Injectable } from '@angular/core';
import { Axis, ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class WordBuilderService {
    buildWordOnBoard(word: string, coord: Vec2, axis: WordOrientation): ScrabbleWord[] {
        const result: ScrabbleWord[] = [];
        const scrabbleWord = new ScrabbleWord();
        scrabbleWord.startPosition = new Vec2(coord.x, coord.y);
        scrabbleWord.orientation = axis;
        for (const letter of word) {
            scrabbleWord.content.push(new ScrabbleLetter(letter, 1));
            scrabbleWord.value++;
        }
        result.push(scrabbleWord);
        return result;
    }
    allWordsCreated(word: string, coord: Vec2, axis: Axis): ScrabbleWord[] {
        // DUMMY FUNCTION TO MAKE VIRTUAL PLAYER COMPILE, PLEASE IGNORE.
        const words: ScrabbleWord[] = [];
        const newWord = new ScrabbleWord();
        newWord.content[0].character = word[0];
        newWord.content[0].tile.position = coord;
        if (axis) {
            return [];
        }
        return words;
    }
    /*
  buildWordOnBoard(direction : number) : void{ //direction is either h or v inputed by the user through the communication window
    if(this.validation.isWordValid){ //bug here?
      for(let i = 0; i < this.board.boardSize; i++){
        for(let j = 0; j < this.board.boardSize; j++){ //iterate through the board
          //WORK IN PROGRESS
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
    }*/
    // All words created from the letters placed on the board

    /*
    allWordsCreated(newLetters: ScrabbleLetter[], axis: Axis): ScrabbleWord[] {
        const wordList: ScrabbleWord[] = [];
        let i = 0;
        const horizontalResult = this.completeWordInADirection(newLetters[0], axis);
        if (horizontalResult.content !== []) {
            wordList[i] = horizontalResult;
            i++;
        }
        for (const index of newLetters) {
            const verticalResult = this.completeWordInADirection(index, invertAxis[axis]);
            if (verticalResult.content !== []) {
                wordList[i] = verticalResult;
                i++;
            }
        }
        return wordList;
    }

    // THIS FUNCTION WILL BREAK WHEN CODE STRUCTURE CHANGES. BEWARE.
    completeWordInADirection(firstLetter: ScrabbleLetter, direction: Axis): ScrabbleWord {
        const wordInConstruction = new ScrabbleWord();
        let directionOrigin: Direction;
        let directionLast: Direction;
        if (direction === 'h') {
            directionOrigin = Direction.West;
            directionLast = Direction.East;
        } else if (direction === 'v') {
            directionOrigin = Direction.North;
            directionLast = Direction.South;
        } else {
            return new ScrabbleWord();
            // TEMPORARY
            // TODO : Throw exception
        }
        let nextLetter = firstLetter.nextLetters[directionOrigin];
        if (nextLetter) {
            let temp = new ScrabbleLetter('', 0);
            while (nextLetter) {
                temp = nextLetter;
                nextLetter = temp.nextLetters[directionOrigin];
            } // When we get out of the loop, temp is the letter furthest left and leftwardsLetter is invalid
            let i = 0;
            wordInConstruction.content[i] = temp; // first letter of the horizontal word
            while (wordInConstruction.content[i].nextLetters[directionLast]) {
                i++;
                wordInConstruction.content[i] = wordInConstruction.content[i - 1].nextLetters[directionLast];
            }
        }
        return wordInConstruction;
    }*/
}
