import { Injectable } from '@angular/core';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Square, SquareColor } from '@app/classes/square';
import { Vec2 } from '@app/classes/vec2';

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
                const startx = (this.width * i) / BOARD_SIZE + 1 + BOARD_OFFSET;
                const starty = (this.height * j) / BOARD_SIZE + 1 + BOARD_OFFSET;
                switch (this.scrabbleBoard.squares[i][j].color) {
                    case SquareColor.DarkBlue:
                        this.gridContext.fillStyle = '#6AA0E0';
                        this.gridContext.fillRect(startx, starty, SQUARE_SIZE, SQUARE_SIZE);
                        this.gridContext.fillStyle = 'black';
                        this.gridContext.fillText('LETTRE', startx + 2, starty + SMALL_OFFSET_Y);
                        this.gridContext.fillText('x3', startx + BIG_OFFSET_X, starty + BIG_OFFSET_Y);
                        break;
                    case SquareColor.Teal:
                        this.gridContext.fillStyle = '#ACE3EE';
                        this.gridContext.fillRect(startx, starty, SQUARE_SIZE, SQUARE_SIZE);
                        this.gridContext.fillStyle = 'black';
                        this.gridContext.fillText('LETTRE', startx + 2, starty + SMALL_OFFSET_Y);
                        this.gridContext.fillText('x2', startx + BIG_OFFSET_X, starty + BIG_OFFSET_Y);
                        break;
                    case SquareColor.Pink:
                        this.gridContext.fillStyle = '#FFA7C7';
                        this.gridContext.fillRect(startx, starty, SQUARE_SIZE, SQUARE_SIZE);
                        this.gridContext.fillStyle = 'black';
                        this.gridContext.fillText('MOT', startx + SMALL_OFFSET_X, starty + SMALL_OFFSET_Y);
                        this.gridContext.fillText('x2', startx + BIG_OFFSET_X, starty + BIG_OFFSET_Y);
                        break;
                    case SquareColor.Red:
                        this.gridContext.fillStyle = '#C03E3E';
                        this.gridContext.fillRect(startx, starty, SQUARE_SIZE, SQUARE_SIZE);
                        this.gridContext.fillStyle = 'black';
                        this.gridContext.fillText('MOT', startx + SMALL_OFFSET_X, starty + SMALL_OFFSET_Y);
                        this.gridContext.fillText('x3', startx + BIG_OFFSET_X, starty + BIG_OFFSET_Y);
                        break;
                }
            }
        }

        // TODO - Remove Test
        const letter1 = new ScrabbleLetter();
        letter1.character = 'a';
        letter1.square = new Square(8, 9);
        letter1.value = 1;
        this.drawLetter(letter1);

        const letter2 = new ScrabbleLetter();
        letter2.character = 'p';
        letter2.square = new Square(9, 9);
        letter2.square.color = SquareColor.DarkBlue;
        letter2.value = 3;
        this.drawLetter(letter2);

        const letter3 = new ScrabbleLetter();
        letter3.character = 'p';
        letter3.value = 3;
        letter3.square = new Square(10, 9);
        this.drawLetter(letter3);

        const letter4 = new ScrabbleLetter();
        letter4.character = 'l';
        letter4.value = 1;
        letter4.square = new Square(11, 9);
        this.drawLetter(letter4);

        const letter5 = new ScrabbleLetter();
        letter5.character = 'e';
        letter5.value = 2;
        letter5.square = new Square(12, 9);
        this.drawLetter(letter5);
    }

    drawLetter(scrabbleLetter: ScrabbleLetter): void {
        const positionX = (this.width * scrabbleLetter.square.position.x) / BOARD_SIZE + BOARD_OFFSET;
        const positionY = (this.height * scrabbleLetter.square.position.y) / BOARD_SIZE + BOARD_OFFSET;
        const letter = scrabbleLetter.character.toUpperCase();

        // If colored square, hide text
        if (scrabbleLetter.square.color !== SquareColor.None) {
            switch (scrabbleLetter.square.color) {
                case SquareColor.DarkBlue:
                    this.gridContext.fillStyle = '#6AA0E0';
                    this.gridContext.fillRect(positionX + 1, positionY + 1, SQUARE_SIZE, SQUARE_SIZE);
                    break;
                case SquareColor.Teal:
                    this.gridContext.fillStyle = '#ACE3EE';
                    this.gridContext.fillRect(positionX + 1, positionY + 1, SQUARE_SIZE, SQUARE_SIZE);
                    break;
                case SquareColor.Pink:
                    this.gridContext.fillStyle = '#FFA7C7';
                    this.gridContext.fillRect(positionX + 1, positionY + 1, SQUARE_SIZE, SQUARE_SIZE);
                    break;
                case SquareColor.Red:
                    this.gridContext.fillStyle = '#C03E3E';
                    this.gridContext.fillRect(positionX + 1, positionY + 1, SQUARE_SIZE, SQUARE_SIZE);
                    break;
            }
        }
        // Draw letter
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '40px system-ui';
        this.gridContext.fillText(letter, positionX + SMALL_OFFSET_X + 2, positionY + SQUARE_SIZE / 2 + BOARD_SIZE);

        // Draw letter value
        this.gridContext.font = '15px system-ui';
        this.gridContext.fillText(String(scrabbleLetter.value), positionX + SQUARE_SIZE - SMALL_OFFSET_X - 2, positionY + SQUARE_SIZE - 2);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    sizeUpLetters(): void {
        // TODO
    }

    sizeDownLetters(): void {
        // TODO
    }
}
