import { Injectable } from '@angular/core';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { SquareColor } from '@app/classes/square';
import { Vec2 } from '@app/classes/vec2';

enum Colors {
    Teal = '#ACE3EE',
    DarkBlue = '#6AA0E0',
    Pink = '#FFA7C7',
    Red = '#C03E3E',
}

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 700;
export const DEFAULT_HEIGHT = 700;
const BOARD_SIZE = 15;
const SQUARE_SIZE = DEFAULT_WIDTH / BOARD_SIZE - 2;
const BOARD_OFFSET = 30;
const SMALL_OFFSET_Y = 20;
const BIG_OFFSET_Y = 40;
const SMALL_OFFSET_X = 8;
const BIG_OFFSET_X = 18;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    scrabbleBoard: ScrabbleBoard;
    rowMainLetters: string = 'ABCDEFGHIJKLMNO';
    gridContext: CanvasRenderingContext2D;
    letterFont: string = '40px system-ui';
    valueFont: string = '15px system-ui';
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor() {
        this.scrabbleBoard = new ScrabbleBoard();
        this.scrabbleBoard.generateBoard();
    }

    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;

        this.gridContext.font = '25px system-ui';
        this.gridContext.fillStyle = 'black';
        for (let i = 1; i <= BOARD_SIZE; i++) {
            this.gridContext.fillText(String(i), (DEFAULT_WIDTH / BOARD_SIZE - 1) * i, SMALL_OFFSET_Y + 2);
            this.gridContext.fillText(this.rowMainLetters[i - 1], 0, (DEFAULT_WIDTH / BOARD_SIZE) * i + BOARD_SIZE);
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
        this.gridContext.font = '13px system-ui';

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const startX = (this.width * i) / BOARD_SIZE + 1 + BOARD_OFFSET;
                const startY = (this.height * j) / BOARD_SIZE + 1 + BOARD_OFFSET;
                this.drawSingleSquareColor(i, j, startX, startY);
            }
        }
    }

    drawSingleSquareColor(i: number, j: number, startX: number, startY: number) {
        // If colored square, hide text
        if (this.scrabbleBoard.squares[i][j].color !== SquareColor.None) {
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
                        break;
                    }
                    break;
            }
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
        this.drawSingleSquareColor(i, j, startX, startY);

        // Draw letter
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = this.letterFont;
        this.gridContext.fillText(letter, startX + SMALL_OFFSET_X + 2, startY + SQUARE_SIZE / 2 + BOARD_SIZE);

        // Draw letter value
        this.gridContext.font = this.valueFont;
        this.gridContext.fillText(String(scrabbleLetter.value), startX + SQUARE_SIZE - SMALL_OFFSET_X - 2, startY + SQUARE_SIZE - 2);
    }

    // Draw all letters
    drawLetters(): void {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.scrabbleBoard.squares[i][j].letter != null) {
                    const positionX = (this.width * i) / BOARD_SIZE + BOARD_OFFSET;
                    const positionY = (this.height * j) / BOARD_SIZE + BOARD_OFFSET;

                    this.gridContext.fillStyle = 'black';
                    this.gridContext.font = this.letterFont;
                    this.gridContext.fillText(
                        this.scrabbleBoard.squares[i][j].letter.character.toUpperCase(),
                        positionX + SMALL_OFFSET_X + 2,
                        positionY + SQUARE_SIZE / 2 + BOARD_SIZE,
                    );

                    // Draw letter value
                    this.gridContext.font = this.valueFont;
                    this.gridContext.fillText(
                        String(this.scrabbleBoard.squares[i][j].letter.value),
                        positionX + SQUARE_SIZE - SMALL_OFFSET_X - 2,
                        positionY + SQUARE_SIZE - 2,
                    );
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
        // TODO : Implement max font size and font size increment intervals
        this.letterFont = '40px system-ui';
        this.valueFont = '15px system-ui';
        this.gridContext.clearRect(0, 0, DEFAULT_WIDTH + 2 * BOARD_OFFSET, DEFAULT_HEIGHT + 2 * BOARD_OFFSET);
        this.drawGrid();
        this.drawColors();
        this.drawLetters();
    }

    sizeDownLetters(): void {
        // TODO : Implement min font size and font size decrement intervals
        this.letterFont = '30px system-ui';
        this.valueFont = '10px system-ui';
        this.gridContext.clearRect(0, 0, DEFAULT_WIDTH + 2 * BOARD_OFFSET, DEFAULT_HEIGHT + 2 * BOARD_OFFSET);
        this.drawGrid();
        this.drawColors();
        this.drawLetters();
    }
}
