import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Square } from '@app/classes/square';

export const EASEL_WIDTH = 600;
export const EASEL_HEIGHT = 80;
const MAX_LETTER_COUNT = 7;
const LETTER_OFFSET = 13;
const VALUE_OFFSET = 10;

@Injectable({
    providedIn: 'root',
})
export class EaselService {
    gridContext: CanvasRenderingContext2D;

    drawEasel() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;

        for (let i = 1; i < MAX_LETTER_COUNT; i++) {
            this.gridContext.moveTo((EASEL_WIDTH * i) / MAX_LETTER_COUNT, 0);
            this.gridContext.lineTo((EASEL_WIDTH * i) / MAX_LETTER_COUNT, EASEL_HEIGHT);
        }

        this.gridContext.stroke();
        // TODO : Remove test
        const letter1 = new ScrabbleLetter();
        letter1.character = 'a';
        letter1.value = 1;
        letter1.square = new Square(0, 0);
        this.drawLetter(letter1);

        const letter2 = new ScrabbleLetter();
        letter2.character = 'o';
        letter2.value = 2;
        letter2.square = new Square(1, 0);
        this.drawLetter(letter2);

        const letter3 = new ScrabbleLetter();
        letter3.character = 'p';
        letter3.value = 3;
        letter3.square = new Square(2, 0);
        this.drawLetter(letter3);

        const letter4 = new ScrabbleLetter();
        letter4.character = 'k';
        letter4.value = 2;
        letter4.square = new Square(3, 0);
        this.drawLetter(letter4);

        const letter5 = new ScrabbleLetter();
        letter5.character = 'g';
        letter5.value = 1;
        letter5.square = new Square(3 + 1, 0);
        this.drawLetter(letter5);
    }

    drawLetter(scrabbleLetter: ScrabbleLetter): void {
        const positionX = (EASEL_WIDTH * scrabbleLetter.square.position.x) / MAX_LETTER_COUNT;
        const positionY = (EASEL_HEIGHT * scrabbleLetter.square.position.y) / MAX_LETTER_COUNT;
        const letter = scrabbleLetter.character.toUpperCase();
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '80px system-ui';
        this.gridContext.fillText(letter, positionX + LETTER_OFFSET, positionY + EASEL_HEIGHT - LETTER_OFFSET);
        this.gridContext.font = '20px system-ui';
        this.gridContext.fillText(String(scrabbleLetter.value), positionX + EASEL_HEIGHT - VALUE_OFFSET, positionY + EASEL_HEIGHT - VALUE_OFFSET / 2);
    }
}
