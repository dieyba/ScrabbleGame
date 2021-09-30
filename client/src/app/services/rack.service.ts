import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleRack } from '@app/classes/scrabble-rack';
import { Square } from '@app/classes/square';

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
    squareWidth = RACK_WIDTH / 7;
    squareHeight = RACK_WIDTH;

    constructor() {
        this.scrabbleRack = new ScrabbleRack();
    }

    drawRack() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;

        for (let i = 0; i < MAX_LETTER_COUNT + 1; i++) {
            this.gridContext.moveTo((RACK_WIDTH * i) / MAX_LETTER_COUNT, 0);
            this.gridContext.lineTo((RACK_WIDTH * i) / MAX_LETTER_COUNT, RACK_HEIGHT);
        }

        this.gridContext.moveTo(0, 0);
        this.gridContext.lineTo(RACK_WIDTH, 0);
        this.gridContext.moveTo(0, RACK_HEIGHT);
        this.gridContext.lineTo(RACK_WIDTH, RACK_HEIGHT);

        this.gridContext.stroke();
    }

    drawLetter(scrabbleLetter: ScrabbleLetter): void {
        for (let i = 0; i < MAX_LETTER_COUNT; i++) {
            if (!this.scrabbleRack.squares[i].occupied) {
                this.scrabbleRack.squares[i].letter = scrabbleLetter;
                this.scrabbleRack.squares[i].occupied = true;
                this.scrabbleRack.squares[i].position = { x: i, y: 0 };
                const positionX = (RACK_WIDTH * i) / MAX_LETTER_COUNT;
                const letter = scrabbleLetter.getLetter().toUpperCase();
                this.gridContext.beginPath();
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

    removeLetter(scrabbleLetter: ScrabbleLetter) {
        for (let i = 0; i < this.scrabbleRack.squares.length; i++) {
            if (this.scrabbleRack.squares[i].letter.getLetter() === scrabbleLetter.getLetter()) {
                this.scrabbleRack.squares[i] = new Square(i, 0);
                break;
            }
        }
        this.gridContext.clearRect(0, 0, RACK_WIDTH, RACK_HEIGHT);
        this.drawRack();
        this.replaceLetters();
    }

    replaceLetters() {
        for (let i = 0; i < this.scrabbleRack.squares.length - 1; i++) {
            if (this.scrabbleRack.squares[i].letter === undefined) {
                this.scrabbleRack.squares[i].letter = this.scrabbleRack.squares[i + 1].letter;
                this.scrabbleRack.squares[i + 1] = new Square(i + 1, 0);
            }
            this.scrabbleRack.squares[i].occupied = false;
            this.drawLetter(this.scrabbleRack.squares[i].letter);
        }
    }
}
