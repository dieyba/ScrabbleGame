import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleRack } from '@app/classes/scrabble-rack';

export const RACK_WIDTH = 600;
export const RACK_HEIGHT = 80;
const MAX_LETTER_COUNT = 7;
const LETTER_OFFSET = 13;
const VALUE_OFFSET = 10;

@Injectable({
    providedIn: 'root',
})
export class RackService {
    scrabbleRack: ScrabbleRack;
    gridContext: CanvasRenderingContext2D;

    constructor() {
        this.scrabbleRack = new ScrabbleRack();
    }

    drawRack() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;

        for (let i = 1; i < MAX_LETTER_COUNT; i++) {
            this.gridContext.moveTo((RACK_WIDTH * i) / MAX_LETTER_COUNT, 0);
            this.gridContext.lineTo((RACK_WIDTH * i) / MAX_LETTER_COUNT, RACK_HEIGHT);
        }

        this.gridContext.stroke();
        // TODO : Remove test
        const letter1 = new ScrabbleLetter();
        letter1.character = 'a';
        letter1.value = 1;
        this.drawLetter(letter1);

        const letter2 = new ScrabbleLetter();
        letter2.character = 'o';
        letter2.value = 2;
        this.drawLetter(letter2);

        const letter3 = new ScrabbleLetter();
        letter3.character = 'p';
        letter3.value = 3;
        this.drawLetter(letter3);

        const letter4 = new ScrabbleLetter();
        letter4.character = 'k';
        letter4.value = 2;
        this.drawLetter(letter4);

        const letter5 = new ScrabbleLetter();
        letter5.character = 'g';
        letter5.value = 1;
        this.drawLetter(letter5);
    }

    drawLetter(scrabbleLetter: ScrabbleLetter): void {
        for (let i = 0; i < MAX_LETTER_COUNT; i++) {
            if (!this.scrabbleRack.squares[i].occupied) {
                this.scrabbleRack.squares[i].letter = scrabbleLetter;
                this.scrabbleRack.squares[i].occupied = true;
                const positionX = (RACK_WIDTH * i) / MAX_LETTER_COUNT;
                const letter = scrabbleLetter.character.toUpperCase();
                this.gridContext.fillStyle = 'black';
                this.gridContext.font = '80px system-ui';
                this.gridContext.fillText(letter, positionX + LETTER_OFFSET, 0 + RACK_HEIGHT - LETTER_OFFSET);
                this.gridContext.font = '20px system-ui';
                this.gridContext.fillText(String(scrabbleLetter.value), positionX + RACK_HEIGHT - VALUE_OFFSET, 0 + RACK_HEIGHT - VALUE_OFFSET / 2);
                return;
            }
        }
    }
}
