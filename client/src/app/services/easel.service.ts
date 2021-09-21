import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Square } from '@app/classes/square';

export const EASEL_WIDTH = 700;
export const EASEL_HEIGHT = 100;
const MAX_LETTER_COUNT = 7;

@Injectable({
  providedIn: 'root'
})
export class EaselService {
  gridContext: CanvasRenderingContext2D;

  constructor() { }

  drawEasel() {
    this.gridContext.beginPath();
    this.gridContext.strokeStyle = 'black';
    this.gridContext.lineWidth = 1;

    for (let i = 1; i < MAX_LETTER_COUNT; i++) {
        this.gridContext.moveTo((EASEL_WIDTH * i) / MAX_LETTER_COUNT, 0);
        this.gridContext.lineTo((EASEL_WIDTH * i) / MAX_LETTER_COUNT, EASEL_HEIGHT);
    }

    this.gridContext.stroke();
    // TEST
    let letter1 = new ScrabbleLetter();
    letter1.character = 'a';
    letter1.value = 1;
    letter1.square = new Square(0, 0);
    this.drawLetter(letter1);

    let letter2 = new ScrabbleLetter();
    letter2.character = 'o';
    letter2.value = 2;
    letter2.square = new Square(1, 0);
    this.drawLetter(letter2); 

    let letter3 = new ScrabbleLetter();
    letter3.character = 'p';    
    letter3.value = 3;
    letter3.square = new Square(2, 0);
    this.drawLetter(letter3); 

    let letter4 = new ScrabbleLetter();
    letter4.character = 'k';
    letter4.value = 2;
    letter4.square = new Square(3, 0);
    this.drawLetter(letter4);

    let letter5 = new ScrabbleLetter();
    letter5.character = 'g';    
    letter5.value = 1;
    letter5.square = new Square(4, 0);
    this.drawLetter(letter5);
  }

  drawLetter(scrabbleLetter: ScrabbleLetter): void {
    let positionX = (EASEL_WIDTH * scrabbleLetter.square.position.x) / MAX_LETTER_COUNT;
    let positionY = (EASEL_HEIGHT * scrabbleLetter.square.position.y) / MAX_LETTER_COUNT;
    let letter = scrabbleLetter.character.toUpperCase();
    this.gridContext.fillStyle = 'black';
    this.gridContext.font = '90px system-ui';
    this.gridContext.fillText(letter, positionX + 15, positionY + EASEL_HEIGHT - 20);
    this.gridContext.font = '30px system-ui';
    this.gridContext.fillText(String(scrabbleLetter.value), positionX + EASEL_HEIGHT - 20, positionY + EASEL_HEIGHT - 5);
  }
}

