import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleRack } from '@app/classes/scrabble-rack';

export const RACK_WIDTH = 500;
export const RACK_HEIGHT = 60;
const MAX_LETTER_COUNT = 7;
const OFFSET = 5;
const DOUBLE_DIGIT = 10;

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
        const letter1 = new ScrabbleLetter('a', 1);
        this.drawLetter(letter1);

        const letter2 = new ScrabbleLetter('o', 2);
        this.drawLetter(letter2);

        const letter3 = new ScrabbleLetter('w', 10);
        this.drawLetter(letter3);

        const letter4 = new ScrabbleLetter('k', 2);
        this.drawLetter(letter4);

        const letter5 = new ScrabbleLetter('g', 1);
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
                this.gridContext.font = '60px system-ui';
                this.gridContext.fillText(letter, positionX + OFFSET, 0 + RACK_HEIGHT - OFFSET);
                this.gridContext.font = '18px system-ui';
                if (scrabbleLetter.value >= DOUBLE_DIGIT) {
                    this.gridContext.fillText(String(scrabbleLetter.value), positionX + RACK_HEIGHT - OFFSET * 2, 0 + RACK_HEIGHT - OFFSET);
                } else {
                    this.gridContext.fillText(String(scrabbleLetter.value), positionX + RACK_HEIGHT - OFFSET, 0 + RACK_HEIGHT - OFFSET);
                }
                return;
            }
        }
    }

    clearRack() {
        this.scrabbleRack = new ScrabbleRack();
    }
}
