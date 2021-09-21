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
const OFFSET = 30;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    scrabbleBoard: ScrabbleBoard;
    rowMainLetters: string = 'ABCDEFGHIJKLMNO';

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
            this.gridContext.fillText(String(i), (DEFAULT_WIDTH / BOARD_SIZE - 1) * i, 22);
            this.gridContext.fillText(this.rowMainLetters[i - 1], 0, (DEFAULT_WIDTH / BOARD_SIZE) * i + 15);
        }

        for (let i = 0; i <= BOARD_SIZE; i++) {
            this.gridContext.moveTo((this.width * i) / BOARD_SIZE + OFFSET, OFFSET);
            this.gridContext.lineTo((this.width * i) / BOARD_SIZE + OFFSET, this.height + OFFSET);
        }

        for (let i = 0; i <= BOARD_SIZE; i++) {
            this.gridContext.moveTo(OFFSET, (this.height * i) / BOARD_SIZE + OFFSET);
            this.gridContext.lineTo(this.width + OFFSET, (this.height * i) / BOARD_SIZE + OFFSET);
        }

        this.gridContext.stroke();
    }

    drawColors(): void {
        this.gridContext.beginPath();
        this.gridContext.font = '13px system-ui';

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                let startx = (this.width * i) / BOARD_SIZE + 1 + OFFSET;
                let starty = (this.height * j) / BOARD_SIZE + 1 + OFFSET;
                switch (this.scrabbleBoard.squares[i][j].color) {
                    case SquareColor.DarkBlue:
                        this.gridContext.fillStyle = '#6AA0E0';
                        this.gridContext.fillRect(startx, starty, SQUARE_SIZE, SQUARE_SIZE);
                        this.gridContext.fillStyle = 'black';
                        this.gridContext.fillText('LETTRE', startx + 2, starty + 20);
                        this.gridContext.fillText('x3', startx + 18, starty + 40);
                        break;
                    case SquareColor.Teal:
                        this.gridContext.fillStyle = '#ACE3EE';
                        this.gridContext.fillRect(startx, starty, SQUARE_SIZE, SQUARE_SIZE);
                        this.gridContext.fillStyle = 'black';
                        this.gridContext.fillText('LETTRE', startx + 2, starty + 20);
                        this.gridContext.fillText('x2', startx + 18, starty + 40);
                        break;
                    case SquareColor.Pink:
                        this.gridContext.fillStyle = '#FFA7C7';
                        this.gridContext.fillRect(startx, starty, SQUARE_SIZE, SQUARE_SIZE);
                        this.gridContext.fillStyle = 'black';
                        this.gridContext.fillText('MOT', startx + 8, starty + 20);
                        this.gridContext.fillText('x2', startx + 16, starty + 40);
                        break;
                    case SquareColor.Red:
                        this.gridContext.fillStyle = '#C03E3E';
                        this.gridContext.fillRect(startx, starty, SQUARE_SIZE, SQUARE_SIZE);
                        this.gridContext.fillStyle = 'black';
                        this.gridContext.fillText('MOT', startx + 10, starty + 20);
                        this.gridContext.fillText('x3', startx + 18, starty + 40);
                        break;
                }
            }
        }

        // TODO - Remove Test
        let letter1 = new ScrabbleLetter();
        letter1.character = 'a';
        letter1.square = new Square(8, 9);
        letter1.value = 1;
        this.drawLetter(letter1);

        let letter2 = new ScrabbleLetter();
        letter2.character = 'p';
        letter2.square = new Square(9, 9);
        letter2.square.color = SquareColor.DarkBlue;
        letter2.value = 3;
        this.drawLetter(letter2);

        let letter3 = new ScrabbleLetter();
        letter3.character = 'p';
        letter3.value = 3;
        letter3.square = new Square(10, 9);
        this.drawLetter(letter3);

        let letter4 = new ScrabbleLetter();
        letter4.character = 'l';
        letter4.value = 1;
        letter4.square = new Square(11, 9);
        this.drawLetter(letter4);

        let letter5 = new ScrabbleLetter();
        letter5.character = 'e';
        letter5.value = 2;
        letter5.square = new Square(12, 9);
        this.drawLetter(letter5);
    }

    drawLetter(scrabbleLetter: ScrabbleLetter): void {
        let positionX = (this.width * scrabbleLetter.square.position.x) / BOARD_SIZE + OFFSET;
        let positionY = (this.height * scrabbleLetter.square.position.y) / BOARD_SIZE + OFFSET;
        let letter = scrabbleLetter.character.toUpperCase();

        // If colored square, hide text
        if (scrabbleLetter.square.color != SquareColor.None) {
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
        this.gridContext.fillText(letter, positionX + 10, positionY + SQUARE_SIZE / 2 + 15);

        // Draw letter value
        this.gridContext.font = '15px system-ui';
        this.gridContext.fillText(String(scrabbleLetter.value), positionX + SQUARE_SIZE - 10, positionY + SQUARE_SIZE - 2);
    }

    drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };
        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
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
