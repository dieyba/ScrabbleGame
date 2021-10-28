import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';

export const RACK_WIDTH = 500;
export const RACK_HEIGHT = 60;
export const MAX_LETTER_COUNT = 7;
const OFFSET = 5;
const DOUBLE_DIGIT = 10;

@Injectable({
    providedIn: 'root',
})
export class RackService {
    rackLetters: ScrabbleLetter[];
    gridContext: CanvasRenderingContext2D;
    squareWidth = RACK_WIDTH / MAX_LETTER_COUNT;
    squareHeight = RACK_WIDTH;

    constructor() {
        this.rackLetters = [];
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

    // Draws letter and returns the letter position in the rack
    addLetter(scrabbleLetter: ScrabbleLetter): void {
        if (scrabbleLetter !== undefined && this.rackLetters.length !== MAX_LETTER_COUNT) {
            this.rackLetters[this.rackLetters.length] = scrabbleLetter;
            this.drawLetter(this.rackLetters.length - 1);
        }
    }

    removeLetter(scrabbleLetter: ScrabbleLetter): number {
        let pos = -1;
        for (let i = 0; i < this.rackLetters.length; i++) {
            if (this.rackLetters[i].character === scrabbleLetter.character) {
                this.rackLetters.splice(i, 1);
                pos = i;
                break;
            }
        }
        this.gridContext.clearRect(0, 0, RACK_WIDTH, RACK_HEIGHT);
        this.drawRack();
        this.drawExistingLetters();
        return pos;
    }

    drawExistingLetters() {
        for (let i = 0; i < this.rackLetters.length; i++) {
            this.drawLetter(i);
        }
    }

    drawLetter(position: number) {
        const positionX = (RACK_WIDTH * position) / MAX_LETTER_COUNT;
        const letter = this.rackLetters[position].character.toUpperCase();
        this.gridContext.beginPath();
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '60px system-ui';
        this.gridContext.fillText(letter, positionX + OFFSET, 0 + RACK_HEIGHT - OFFSET);
        this.gridContext.font = '18px system-ui';
        if (this.rackLetters[position].value >= DOUBLE_DIGIT) {
            this.gridContext.fillText(String(this.rackLetters[position].value), positionX + RACK_HEIGHT - OFFSET * 2, 0 + RACK_HEIGHT - OFFSET);
        } else {
            this.gridContext.fillText(String(this.rackLetters[position].value), positionX + RACK_HEIGHT - OFFSET, 0 + RACK_HEIGHT - OFFSET);
        }
    }
}
