import { Injectable } from '@angular/core';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Axis, ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleRack } from '@app/classes/scrabble-rack';
import { Square } from '@app/classes/square';
import { ValidationService } from './validation.service';
import { Vec2 } from '@app/classes/vec2';

export enum Probability{
  EndTurn = 10,
  ExchangeTile = 10,
  MakeAMove = 80,
}
const POINTS_INTERVAL = 5;

@Injectable({
  providedIn: 'root'
})
export class VirtualPlayerService {
  board : ScrabbleBoard;
  rack : ScrabbleRack; //Replace this for implementation

  constructor(private validationService : ValidationService) {    //TODO Implement timer (3s and 20s limit)
    this.board = new ScrabbleBoard;
    this.rack = new ScrabbleRack;
    let currentMove = this.getRandomIntInclusive(1, 100);
    if(currentMove <= Probability.EndTurn){
      //10% chance to end turn
    } else if(currentMove <= Probability.EndTurn+Probability.ExchangeTile){
      this.chooseTilesFromRack(); //10% chance to exchange tiles
    } else if(currentMove <= Probability.EndTurn+Probability.ExchangeTile+Probability.MakeAMove){ //=100
      this.makeMoves(); //80% chance to make a move
    }
  }
  permutationsOfLetters(letters : ScrabbleLetter[]) : ScrabbleLetter[][]{ //Adapted from medium.com/weekly-webtips/step-by-step-guide-to-array-permutation-using-recursion-in-javascript-4e76188b88ff
    let result = [];
    if(letters.length == 1){
      result[0] = letters;
      return result;
    }
    for (let i = 0; i < letters.length; i++){
      let currentLetter = letters[i];
      let remainingLetters = letters.slice(0, i).concat(letters.slice(i+1));
      let remainingLettersPermuted = this.permutationsOfLetters(remainingLetters);
      for(let j = 0; j<remainingLettersPermuted.length; j++){
        let permutedArray = [currentLetter].concat(remainingLettersPermuted[j]);
        result.push(permutedArray);
      }
    }
    return result;
  }
  movesWithGivenLetter(letter : ScrabbleLetter) : ScrabbleWord[]{
    let lettersAvailable = [];
    lettersAvailable[0] = letter;
    let lettersInArray = [];
    for (let i = 1; i < this.getRandomIntInclusive(2, this.rack.squares.length+1); i++) { //Randomize length of word
      let index = this.getRandomIntInclusive(0, this.rack.squares.length-1);
      while(lettersInArray[index] == 1){ //If we've already generated this number before
        if(index != lettersInArray.length-1){
          index++;
        } else index = 0;
      }
      lettersAvailable[i] = this.rack.squares[index].letter;
      lettersInArray[index] = 1;
    }
    //check all possible permutations. Maximum of O(8!)
    let permutations = this.permutationsOfLetters(lettersAvailable);
    let possibleMoves = [];
    for(let i = 0; i < permutations.length; i++){
      possibleMoves[i] = this.wordify([]);
    }
    let movesFound = 0;
    for(let j = 0; j < permutations.length; j++){ 
      if(this.validationService.isWordValid(permutations[j].toString())){
        possibleMoves[movesFound] = this.wordify(permutations[j]);
        movesFound++;
      }
    }
    return possibleMoves;

  }

  possibleMoves(points : number, axis : Axis) : ScrabbleWord[]{
    let listLength = 4; //How many words we should aim for
    let list = [];
    for (let i = 0; i < listLength; i++) {
      list[i] = new ScrabbleWord;
    }
    //Board analysis
    let movesFound = 0;
    while(movesFound < listLength){
      for(let j = 0; j <= this.board.actualBoardSize; j++){ //TODO : randomize this
        for(let k = 0; k <= this.board.actualBoardSize; k++){
          if(this.board.squares[j][k].occupied){
            list = this.movesWithGivenLetter(this.board.squares[j][k].letter)
            for(let l = 0; l < list.length; l++){
              if(!this.validationService.isWordValid(list[l].stringify())){
                list.splice(l);
              }
              //TODO : Verify if move is valid on the board and simulate placement to calculate points
              if(this.validationService.isPlacable(list[l], this.findPosition(list[l], axis), axis))
              //Verify if points are respected
              if (list[l].totalValue() > points || list[l].totalValue() < points-POINTS_INTERVAL){
                list.splice(l);
              }
              movesFound += list.length;
            }
          }
        }
      }
    }
    return list; //list contains movesFound elements
  }
  makeMoves() : ScrabbleWord{
    let startAxis = Axis.V;
    if(this.getRandomIntInclusive(0,1) == 1){ //coinflip to determine starting axis
      startAxis = Axis.H;
    }
    let currentMove = this.getRandomIntInclusive(1, 100);
    let movesList = [];
    if(currentMove <= 40){
      //40% chance to go for moves that earn 6 points or less
      movesList = this.possibleMoves(6, startAxis);
    } else if(currentMove <= 70){
      //30% chance to go for moves that score 7-12 points
      movesList = this.possibleMoves(12, startAxis);
    } else{
      //30% chance to go for moves that score 13-18 points
      movesList = this.possibleMoves(18, startAxis);
    }
    return movesList[this.getRandomIntInclusive(0, movesList.length-1)]; //randomize move to make
  }
  //Displays a message based on an array of moves.
  displayMoves(moves : ScrabbleWord[]) : string{
    let message = "";
    if(moves.length == 0){
      message = "Il n'y a aucun placement valide pour la plage de points et la longueur de mot sélectionnées par le joueur virtuel."
    } else if (moves.length == 1){
      message = "Le placement joué est le seul valide pour la plage de points et la lo sélectionnée par le joueur virtuel.";
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
        } else message += "  "; //If it's not
      }
      message += moves[i].totalValue + "\n"; //Add score for each move

    }
    return message;
  }
  displayMoveChat(move : ScrabbleWord, position : Vec2, axis : Axis) : string{
    let message = "!placer " + position.y/*convert this to letters*/ + position.x + axis + " " + move.stringify();
    return message;
  }
  wordify(letters : ScrabbleLetter[]) : ScrabbleWord{
    let word = new ScrabbleWord;
    word.content = letters;
    return word;
  }
  //found on developer.mozilla.org under Math.random()
  getRandomIntInclusive(min : number, max : number) : number{
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random()*(max-min+1)+min); 
  }
  findPosition(word : ScrabbleWord, axis : Axis) : Vec2{
    let origin = new ScrabbleLetter('', 0); //Convert position
    let index : number;
    for (index = 0; index < word.content.length; index++){
      if(word.content[index].tile.occupied){
        origin = word.content[index];
      }
    }
    let position = new Vec2;
    if(axis == Axis.V){
      position.y = origin.tile.position.y - index;
      position.x = origin.tile.position.x; 
    } else {
      position.y = origin.tile.position.y;
      position.x = origin.tile.position.x - index;
    }
    return position;
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
