import { Injectable } from '@angular/core';
import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter, setLetter, UNPLACED } from '@app/classes/scrabble-letter/scrabble-letter';
import { Square, SquareColor } from '@app/classes/square/square';
import { Axis } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';

export enum Colors {
    Teal = '#ACE3EE',
    DarkBlue = '#6AA0E0',
    Pink = '#FFA7C7',
    Red = '#E60000',
    None = 'white',
}
export interface Case {
    type: Colors;
    colorType: string;
    valueType: string;
}

// TODO : Make a file for constants
export const DEFAULT_WIDTH = 540;
export const DEFAULT_HEIGHT = 540;
export const BOARD_SIZE = 15;
export const SQUARE_SIZE = DEFAULT_WIDTH / BOARD_SIZE - 2;
export const BOARD_OFFSET = 20;
const SMALL_OFFSET_Y = 18;
const BIG_OFFSET_Y = 30;
const SMALL_OFFSET_X = 6;
const BIG_OFFSET_X = 13;
const DOUBLE_DIGIT = 10;
const DEFAULT_LETTER_FONT_INDEX = 2;
const DEFAULT_VALUE_FONT_INDEX = 2;
const ROW_MAIN_LETTERS = 'ABCDEFGHIJKLMNO';

export const ABSOLUTE_BOARD_SIZE = 580;
export const ACTUAL_SQUARE_SIZE = SQUARE_SIZE + 2;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    scrabbleBoard: ScrabbleBoard;
    gridContext: CanvasRenderingContext2D;
    letterFonts: string[];
    valueFonts: string[];
    currentLetterFont: string;
    currentValueFont: string;
    private canvasSize: Vec2;

    constructor() {
        // this.scrabbleBoard = board;
        this.letterFonts = ['27px system-ui', '30px system-ui', '33px system-ui', '35px system-ui'];
        this.valueFonts = ['9px system-ui', '11px system-ui', '13px system-ui', '15px system-ui'];
        this.currentLetterFont = this.letterFonts[DEFAULT_LETTER_FONT_INDEX];
        this.currentValueFont = this.valueFonts[DEFAULT_VALUE_FONT_INDEX];
        this.canvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;

        this.gridContext.font = '20px system-ui';
        this.gridContext.fillStyle = 'black';
        for (let i = 1; i <= BOARD_SIZE; i++) {
            this.gridContext.fillText(String(i), (DEFAULT_WIDTH / BOARD_SIZE - 1) * i, BOARD_SIZE + 1);
            this.gridContext.fillText(ROW_MAIN_LETTERS[i - 1], 0, (DEFAULT_WIDTH / BOARD_SIZE) * i + BOARD_OFFSET / 2);
        }

        for (let i = 0; i <= BOARD_SIZE; i++) {
            this.gridContext.moveTo((this.width * i) / BOARD_SIZE + BOARD_OFFSET, BOARD_OFFSET);
            this.gridContext.lineTo((this.width * i) / BOARD_SIZE + BOARD_OFFSET, this.height + BOARD_OFFSET);
        }

        for (let i = 0; i <= BOARD_SIZE; i++) {
            this.gridContext.moveTo(BOARD_OFFSET, (this.height * i) / BOARD_SIZE + BOARD_OFFSET);
            this.gridContext.lineTo(this.width + BOARD_OFFSET, (this.height * i) / BOARD_SIZE + BOARD_OFFSET);
        }

        this.gridContext.stroke();
    }

    drawColors(): void {
        this.gridContext.beginPath();

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                this.drawSingleSquareColor(i, j);
            }
        }
    }

    // reset tile and returns the letter that was on it
    removeSquare(i: number, j: number): ScrabbleLetter {
        // Saving information about square
        const color = this.scrabbleBoard.squares[i][j].color;
        let letter = this.scrabbleBoard.squares[i][j].letter;
        // Reset white letters
        if (letter?.value === 0) {
            letter = setLetter('*', letter);
        }
        // Unassign the letter and the letter coordinates (tile)
        letter.tile = new Square(UNPLACED, UNPLACED);
        this.scrabbleBoard.squares[i][j] = new Square(i, j);
        this.scrabbleBoard.squares[i][j].color = color;
        this.drawSingleSquareColor(i, j);
        return letter;
    }

    fill(type: Case, i: number, j: number) {
        const startX = (this.width * i) / BOARD_SIZE + 1 + BOARD_OFFSET;
        const startY = (this.height * j) / BOARD_SIZE + 1 + BOARD_OFFSET;
        this.gridContext.font = '10px system-ui';
        this.gridContext.fillStyle = type.type;
        this.gridContext.fillRect(startX, startY, SQUARE_SIZE, SQUARE_SIZE);
        if (!this.scrabbleBoard.squares[i][j].occupied) {
            this.gridContext.fillStyle = 'black';
            this.gridContext.fillText(type.colorType, startX + 2, startY + SMALL_OFFSET_Y);
            this.gridContext.fillText(type.valueType, startX + BIG_OFFSET_X, startY + BIG_OFFSET_Y);
        }
    }

    // Draw single letters
    drawLetter(scrabbleLetter: ScrabbleLetter, i: number, j: number): void {
        scrabbleLetter.color = this.scrabbleBoard.squares[i][j].color;
        this.scrabbleBoard.squares[i][j].letter = scrabbleLetter;
        this.scrabbleBoard.squares[i][j].occupied = true;
        const letter =
            scrabbleLetter.character === '*' ? scrabbleLetter.whiteLetterCharacter.toLocaleUpperCase() : scrabbleLetter.character.toUpperCase();
        const startX = (this.width * i) / BOARD_SIZE + BOARD_OFFSET + 1;
        const startY = (this.height * j) / BOARD_SIZE + BOARD_OFFSET + 1;

        // Draw background
        this.drawSingleSquareColor(i, j);

        // Draw letter
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = this.currentLetterFont;
        this.gridContext.fillText(letter, startX + 2, startY + SQUARE_SIZE / 2 + BOARD_SIZE);

        // Draw letter value
        this.gridContext.font = this.currentValueFont;
        if (scrabbleLetter.value >= DOUBLE_DIGIT) {
            this.gridContext.fillText(String(scrabbleLetter.value), startX + SQUARE_SIZE - BIG_OFFSET_X, startY + SQUARE_SIZE - 2);
        } else {
            this.gridContext.fillText(String(scrabbleLetter.value), startX + SQUARE_SIZE - SMALL_OFFSET_X - 2, startY + SQUARE_SIZE - 2);
        }
    }

    // Draw all letters
    drawLetters(): void {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.scrabbleBoard.squares[i][j].occupied) {
                    const positionX = (this.width * i) / BOARD_SIZE + BOARD_OFFSET;
                    const positionY = (this.height * j) / BOARD_SIZE + BOARD_OFFSET;

                    this.gridContext.fillStyle = 'black';
                    this.gridContext.font = this.currentLetterFont;
                    const scrabbleLetter = this.scrabbleBoard.squares[i][j].letter;
                    const letterChar =
                        scrabbleLetter.character === '*'
                            ? scrabbleLetter.whiteLetterCharacter.toLocaleUpperCase()
                            : scrabbleLetter.character.toUpperCase();
                    this.gridContext.fillText(letterChar, positionX + 2, positionY + SQUARE_SIZE / 2 + BOARD_SIZE);

                    // Draw letter value
                    this.gridContext.font = this.currentValueFont;
                    if (this.scrabbleBoard.squares[i][j].letter.value >= DOUBLE_DIGIT) {
                        this.gridContext.fillText(
                            String(this.scrabbleBoard.squares[i][j].letter.value),
                            positionX + SQUARE_SIZE - BIG_OFFSET_X,
                            positionY + SQUARE_SIZE - 2,
                        );
                    } else {
                        this.gridContext.fillText(
                            String(this.scrabbleBoard.squares[i][j].letter.value),
                            positionX + SQUARE_SIZE - SMALL_OFFSET_X - 2,
                            positionY + SQUARE_SIZE - 2,
                        );
                    }
                }
            }
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    sizeUpLetters(): void {
        for (let i = 0; i < this.letterFonts.length; i++) {
            if (this.currentLetterFont === this.letterFonts[i] && i !== this.letterFonts.length - 1) {
                this.currentLetterFont = this.letterFonts[i + 1];
                this.currentValueFont = this.valueFonts[i + 1];
                break;
            }
        }
        this.gridContext.clearRect(0, 0, DEFAULT_WIDTH + 2 * BOARD_OFFSET, DEFAULT_HEIGHT + 2 * BOARD_OFFSET);
        this.drawGrid();
        this.drawColors();
        this.drawLetters();
    }

    sizeDownLetters(): void {
        for (let i = 0; i < this.letterFonts.length; i++) {
            if (this.currentLetterFont === this.letterFonts[i] && i !== 0) {
                this.currentLetterFont = this.letterFonts[i - 1];
                this.currentValueFont = this.valueFonts[i - 1];
                break;
            }
        }
        this.gridContext.clearRect(0, 0, DEFAULT_WIDTH + 2 * BOARD_OFFSET, DEFAULT_HEIGHT + 2 * BOARD_OFFSET);
        this.drawGrid();
        this.drawColors();
        this.drawLetters();
    }

    removeInvalidLetters(coord: Vec2, length: number, orientation: Axis): ScrabbleLetter[] {
        const removedScrabbleLetters: ScrabbleLetter[] = [];
        for (let i = 0; i < length; i++) {
            const tempCoord = orientation === Axis.V ? new Vec2(coord.x, coord.y + i) : new Vec2(coord.x + i, coord.y);
            if (!this.scrabbleBoard.squares[tempCoord.x][tempCoord.y].isValidated && this.scrabbleBoard.squares[tempCoord.x][tempCoord.y].occupied) {
                removedScrabbleLetters.push(this.removeSquare(tempCoord.x, tempCoord.y));
            }
        }
        return removedScrabbleLetters;
    }

    updateBoard(word: string, orientation: string, position: Vec2) {
        const positionInc = orientation === 'h' ? new Vec2(1, 0) : new Vec2(0, 1);
        for (const letter of word) {
            let scrabbleLetter = new ScrabbleLetter(letter);
            scrabbleLetter = setLetter(letter, scrabbleLetter);
            scrabbleLetter.tile.position.x = position.x;
            scrabbleLetter.tile.position.y = position.y;
            this.drawLetter(scrabbleLetter, position.x, position.y);
            this.scrabbleBoard.squares[position.x][position.y].isValidated = true;
            this.scrabbleBoard.squares[position.x][position.y].isBonusUsed = true;
            position.x += positionInc.x;
            position.y += positionInc.y;
        }
    }

    private drawSingleSquareColor(i: number, j: number) {
        const startX = (this.width * i) / BOARD_SIZE + 1 + BOARD_OFFSET;
        const startY = (this.height * j) / BOARD_SIZE + 1 + BOARD_OFFSET;
        this.gridContext.font = '10px system-ui';
        // If colored square, hide text
        switch (this.scrabbleBoard.squares[i][j].color) {
            case SquareColor.DarkBlue:
                this.fill({ type: Colors.DarkBlue, colorType: 'LETTRE', valueType: 'x3' }, i, j);
                break;
            case SquareColor.Teal:
                this.fill({ type: Colors.Teal, colorType: 'LETTRE', valueType: 'x2' }, i, j);
                break;
            case SquareColor.Pink:
                this.fill({ type: Colors.Pink, colorType: ' MOT', valueType: 'x2' }, i, j);
                break;
            case SquareColor.Red:
                this.fill({ type: Colors.Red, colorType: ' MOT', valueType: 'x3' }, i, j);
                break;
            case SquareColor.None:
                this.gridContext.fillStyle = Colors.None;
                this.gridContext.fillRect(startX, startY, SQUARE_SIZE, SQUARE_SIZE);
                break;
        }
    }
}
