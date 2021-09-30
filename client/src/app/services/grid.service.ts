import { Injectable } from '@angular/core';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Square, SquareColor } from '@app/classes/square';
import { Vec2 } from '@app/classes/vec2';

export enum Colors {
    Teal = '#ACE3EE',
    DarkBlue = '#6AA0E0',
    Pink = '#FFA7C7',
    Red = '#C03E3E',
    None = 'white',
}

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 600;
export const DEFAULT_HEIGHT = 600;
export const BOARD_SIZE = 15;
const SQUARE_SIZE = DEFAULT_WIDTH / BOARD_SIZE - 2;
const BOARD_OFFSET = 20;
const SMALL_OFFSET_Y = 20;
const BIG_OFFSET_Y = 35;
const SMALL_OFFSET_X = 6;
const BIG_OFFSET_X = 15;
const DOUBLE_DIGIT = 10;
const DEFAULT_LETTER_FONT_INDEX = 2;
const DEFAULT_VALUE_FONT_INDEX = 2;
const ROW_MAIN_LETTERS = 'ABCDEFGHIJKLMNO';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    scrabbleBoard: ScrabbleBoard;
    gridContext: CanvasRenderingContext2D;
    letterFonts: string[] = ['27px system-ui', '30px system-ui', '33px system-ui', '35px system-ui'];
    valueFonts: string[] = ['9px system-ui', '11px system-ui', '13px system-ui', '15px system-ui'];
    currentLetterFont: string;
    currentValueFont: string;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor() {
        this.scrabbleBoard = new ScrabbleBoard();
        this.scrabbleBoard.generateBoard();
        this.currentLetterFont = this.letterFonts[DEFAULT_LETTER_FONT_INDEX];
        this.currentValueFont = this.valueFonts[DEFAULT_VALUE_FONT_INDEX];
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

    removeSquare(i: number, j: number) {
        const color = this.scrabbleBoard.squares[i][j].color;
        this.scrabbleBoard.squares[i][j] = new Square(i, j);
        this.scrabbleBoard.squares[i][j].color = color;
        this.drawSingleSquareColor(i, j);
    }

    // To remove a square, set scrabbleBoard.squares[x][y].occupied to false, set scrabbleBoard.square[x][y].letter = new Scrabble
    drawSingleSquareColor(i: number, j: number) {
        const startX = (this.width * i) / BOARD_SIZE + 1 + BOARD_OFFSET;
        const startY = (this.height * j) / BOARD_SIZE + 1 + BOARD_OFFSET;
        this.gridContext.font = '11px system-ui';
        // If colored square, hide text
        switch (this.scrabbleBoard.squares[i][j].color) {
            case SquareColor.DarkBlue:
                this.gridContext.fillStyle = Colors.DarkBlue;
                this.gridContext.fillRect(startX, startY, SQUARE_SIZE, SQUARE_SIZE);
                if (!this.scrabbleBoard.squares[i][j].occupied) {
                    this.gridContext.fillStyle = 'black';
                    this.gridContext.fillText('LETTRE', startX + 2, startY + SMALL_OFFSET_Y);
                    this.gridContext.fillText('x3', startX + BIG_OFFSET_X, startY + BIG_OFFSET_Y);
                }
                break;
            case SquareColor.Teal:
                this.gridContext.fillStyle = Colors.Teal;
                this.gridContext.fillRect(startX, startY, SQUARE_SIZE, SQUARE_SIZE);
                if (!this.scrabbleBoard.squares[i][j].occupied) {
                    this.gridContext.fillStyle = 'black';
                    this.gridContext.fillText('LETTRE', startX + 2, startY + SMALL_OFFSET_Y);
                    this.gridContext.fillText('x2', startX + BIG_OFFSET_X, startY + BIG_OFFSET_Y);
                }
                break;
            case SquareColor.Pink:
                this.gridContext.fillStyle = Colors.Pink;
                this.gridContext.fillRect(startX, startY, SQUARE_SIZE, SQUARE_SIZE);
                if (!this.scrabbleBoard.squares[i][j].occupied) {
                    this.gridContext.fillStyle = 'black';
                    this.gridContext.fillText('MOT', startX + SMALL_OFFSET_X, startY + SMALL_OFFSET_Y);
                    this.gridContext.fillText('x2', startX + BIG_OFFSET_X, startY + BIG_OFFSET_Y);
                }
                break;
            case SquareColor.Red:
                this.gridContext.fillStyle = Colors.Red;
                this.gridContext.fillRect(startX, startY, SQUARE_SIZE, SQUARE_SIZE);
                if (!this.scrabbleBoard.squares[i][j].occupied) {
                    this.gridContext.fillStyle = 'black';
                    this.gridContext.fillText('MOT', startX + SMALL_OFFSET_X, startY + SMALL_OFFSET_Y);
                    this.gridContext.fillText('x3', startX + BIG_OFFSET_X, startY + BIG_OFFSET_Y);
                }
                break;
            case SquareColor.None:
                this.gridContext.fillStyle = Colors.None;
                this.gridContext.fillRect(startX, startY, SQUARE_SIZE, SQUARE_SIZE);
                break;
        }
    }

    // Draw single letters
    drawLetter(scrabbleLetter: ScrabbleLetter, i: number, j: number): void {
        scrabbleLetter.color = this.scrabbleBoard.squares[i][j].color;
        this.scrabbleBoard.squares[i][j].letter = scrabbleLetter;
        this.scrabbleBoard.squares[i][j].occupied = true;
        const letter = scrabbleLetter.character.toUpperCase();
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
                if (this.scrabbleBoard.squares[i][j].letter != null) {
                    const positionX = (this.width * i) / BOARD_SIZE + BOARD_OFFSET;
                    const positionY = (this.height * j) / BOARD_SIZE + BOARD_OFFSET;

                    this.gridContext.fillStyle = 'black';
                    this.gridContext.font = this.currentLetterFont;
                    this.gridContext.fillText(
                        this.scrabbleBoard.squares[i][j].letter.character.toUpperCase(),
                        positionX + 2,
                        positionY + SQUARE_SIZE / 2 + BOARD_SIZE,
                    );

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
}
