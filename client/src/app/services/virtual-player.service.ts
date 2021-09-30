import { Injectable } from '@angular/core';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleRack } from '@app/classes/scrabble-rack';
import { Square } from '@app/classes/square';

@Injectable({
  providedIn: 'root'
})
export class VirtualPlayerService {
  board : ScrabbleBoard;
  rack : ScrabbleRack; //Replace this for implementation

  constructor() {    //TODO Implement timer (3s and 20s limit)
    let currentMove = this.getRandomIntInclusive(1, 100);
    if(currentMove <= 10){
      //10% chance to end turn
    } else if(currentMove <= 20){
      this.chooseTilesFromRack(); //10% chance to exchange tiles
    } else{
      this.findMoves(); //80% chance to make a move
    }
  }
  findMoves() : number{
    let currentMove = this.getRandomIntInclusive(1, 100);
    if(currentMove <= 40){
      //40% chance to go for moves that earn 6 points or less
    } else if(currentMove <= 70){
      //30% chance to go for moves that score 7-12 points
    } else{
      //30% chance to go for moves that score 13-18 points
    }
    return 0;
  }
  //Displays a message based on an array of moves.
  displayMove(moves : ScrabbleWord[]) : string{
    let message = "";
    if (moves.length == 0){
      message = "Le placement joué est le seul valide pour la plage de points sélectionnée par le joueur virtuel.";
    }
    else for(let i = 0; i < moves.length; i++){
      for(let j = 0; j < moves[i].content.length; j++){
        let letter = moves[i].content[j]
        message += letter.tile.position.x + letter.tile.position.y; //displays position
        if(letter.character == '*'){
          //Show real letter
        } else message += letter.character; //displays character
        if(j == moves[i].content.length-1){
          message += ' '; //If it's the last letter
        } else message += "  "; //If not
      }
      message += moves[i].totalValue + "\n"; //Add score for each move

    }
    return message;
  }
  //found on developer.mozilla.org under Math.random()
  getRandomIntInclusive(min : number, max : number) : number{
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random()*(max-min+1)+min); 
  }
  chooseTilesFromRack() : Square[]{
    let numberOfTiles = this.getRandomIntInclusive(1,this.rack.squares.length);
    let tileReplaced = 0;
    let listOfTiles = [];
    for (let i = 0; i < this.rack.squares.length; i++) {
       listOfTiles[i] = new Square(i, 0);
    }
    let currentLetter = 0;
    while (tileReplaced < numberOfTiles){
        let replaced = this.getRandomIntInclusive(0,1);
        if(replaced == 1){
         listOfTiles[tileReplaced] = this.rack.squares[currentLetter];
         currentLetter++;
         if(currentLetter == 7)
          currentLetter = 0; 
      }
    }
    return listOfTiles;
  }
}
