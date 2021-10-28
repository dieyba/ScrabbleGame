import { Injectable } from '@angular/core';
import { BOARD_SIZE } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { SquareColor } from '@app/classes/square';
import { Axis, invertAxis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_OFFSET, GridService, SQUARE_SIZE } from './grid.service';
import { RackService, RACK_HEIGHT, RACK_WIDTH } from './rack.service';
@Injectable({
    providedIn: 'root',
})
export class MouseWordPlacerService {
    currentAxis: Axis;
    initialPosition: Vec2;
    latestPosition: Vec2;
    currentPosition: Vec2;
    currentWord: ScrabbleLetter[];
    overlayContext: CanvasRenderingContext2D;
    constructor(private gridService: GridService, private rackService: RackService) {
        this.currentAxis = Axis.H;
        this.initialPosition = new Vec2();
        this.latestPosition = new Vec2();
        this.currentPosition = new Vec2();
        this.currentWord = [];
    }
    onMouseClick(e: MouseEvent) {
        // Mouse position relative to the start of the grid in the canvas
        const mousePositionX = e.offsetX + BOARD_OFFSET;
        const mousePositionY = e.offsetY + BOARD_OFFSET;
        const mouseRound = SQUARE_SIZE + 2;
        if (mousePositionX < mouseRound || mousePositionY < mouseRound) return;
        // Square would be out of bounds.
        // Now we find the origin of the square in which we clicked
        let xBaseOfSquare = Math.floor(mousePositionX / mouseRound) * mouseRound;
        xBaseOfSquare = xBaseOfSquare - mouseRound / 2;
        let yBaseOfSquare = Math.floor(mousePositionY / mouseRound) * mouseRound;
        yBaseOfSquare = yBaseOfSquare - mouseRound / 2;
        const clickedSquare: Vec2 = new Vec2(xBaseOfSquare, yBaseOfSquare);
        this.currentPosition = clickedSquare;
        this.initialPosition = clickedSquare;
        const indexes = this.convertPositionToGridIndex(clickedSquare);
        if (indexes[0] >= BOARD_SIZE || indexes[1] >= BOARD_SIZE) return;
        if (this.gridService.scrabbleBoard.squares[indexes[0]][indexes[1]].occupied === true) {
            return; // Don't do anything since square is occupied
        }
        let nextSquare: Vec2 = new Vec2();
        nextSquare = this.findNextSquare(this.currentAxis, clickedSquare);
        if (clickedSquare.x !== this.latestPosition.x || clickedSquare.y !== this.latestPosition.y) {
            this.removeLatestCurrentSquare();
            this.removeLatestPreview(invertAxis[this.currentAxis]);
            this.removeAllLetters();
            this.clearOverlay();
            this.drawSquare(clickedSquare, 'green');
            if (this.currentAxis !== Axis.H) {
                this.currentAxis = Axis.H;
                nextSquare = this.findNextSquare(this.currentAxis, clickedSquare);
            }
            this.latestPosition = clickedSquare;
            this.overlayContext.beginPath();
            this.removeLatestPreview(this.currentAxis);
            this.drawSquare(nextSquare, 'yellow');
        } else {
            switch (this.currentAxis) {
                case Axis.H:
                    this.currentAxis = Axis.V;
                    break;
                case Axis.V:
                    this.currentAxis = Axis.H;
                    break;
            }
            this.removeLatestPreview(this.currentAxis);
            if (this.currentWord.length > 0) {
                this.removeAllLetters();
                this.clearOverlay();
            }
            nextSquare = this.findNextSquare(this.currentAxis, clickedSquare);
            this.latestPosition = clickedSquare;
            this.overlayContext.beginPath();
            this.drawSquare(nextSquare, 'yellow');
        }
    }
    onKeyDown(e: KeyboardEvent) {
        const keyPressed = e.key;
        const alphabet = 'abcdefghijklmnopqrstuvwxyzàâçéèêëïîöôùûü*ABCDEFGHIJLKMNOPQRSTUVWXYZÀÂÇÉÈÊËÏÎÖÔÙÛÜ';
        switch (keyPressed) {
            case 'Backspace':
                this.removeLetter();
                break;
            case 'Enter':
                this.confirmWord();
                break;
            case 'Escape':
                // Resets the canvas
                this.onBlur();
                break;
            default:
                if (alphabet.includes(keyPressed)) {
                    this.placeLetter(keyPressed);
                }
                break;
        }
    }
    onBlur() {
        this.currentAxis = Axis.H;
        this.latestPosition = new Vec2();
        this.currentPosition = new Vec2();
        this.initialPosition = new Vec2();
        this.removeAllLetters();
        this.overlayContext.beginPath();
        this.clearOverlay();
    }
    // Draws a square on the canvas at the given position with the given color
    drawSquare(position: Vec2, color: string) {
        const indexes = this.convertPositionToGridIndex(position);
        if (indexes[0] >= BOARD_SIZE || indexes[1] >= BOARD_SIZE) return;
        this.overlayContext.beginPath();
        switch (color) {
            case 'green':
                this.overlayContext.fillStyle = 'rgba(0, 255, 50, 0.5)';
                break;
            case 'yellow':
                this.overlayContext.fillStyle = 'rgba(255, 255, 100, 0.5)';
                break;
            case 'white':
                this.overlayContext.fillStyle = 'white';
                break;
            case 'teal':
                this.overlayContext.fillStyle = '#ACE3EE';
                break;
            case 'dark blue':
                this.overlayContext.fillStyle = '#6AA0E0';
                break;
            case 'pink':
                this.overlayContext.fillStyle = '#FFA7C7';
                break;
            case 'red':
                this.overlayContext.fillStyle = '#C03E3E';
                break;
            default:
                break;
        }
        this.overlayContext.fillRect(position.x + 1, position.y + 1, SQUARE_SIZE, SQUARE_SIZE);
    }
    drawLetter(letterToDraw: ScrabbleLetter, pos: Vec2) {
        const ABSOLUTE_BOARD_SIZE = 580;
        if (
            pos.x >= BOARD_SIZE ||
            pos.y >= BOARD_SIZE ||
            this.currentPosition.x > ABSOLUTE_BOARD_SIZE ||
            this.currentPosition.y > ABSOLUTE_BOARD_SIZE
        )
            return;
        letterToDraw.color = this.gridService.scrabbleBoard.squares[pos.x][pos.y].color;
        const letter = letterToDraw.character.toUpperCase();
        // Draw background
        let color = '';
        switch (letterToDraw.color) {
            case SquareColor.None:
                color = 'white';
                break;
            case SquareColor.Teal:
                color = 'teal';
                break;
            case SquareColor.DarkBlue:
                color = 'dark blue';
                break;
            case SquareColor.Pink:
                color = 'pink';
                break;
            case SquareColor.Red:
                color = 'red';
                break;
        }
        this.drawSquare(this.currentPosition, color);
        // Draw letter
        this.overlayContext.fillStyle = 'black';
        this.overlayContext.font = this.gridService.currentLetterFont;
        this.overlayContext.fillText(letter, this.currentPosition.x + 2, this.currentPosition.y + SQUARE_SIZE / 2 + BOARD_SIZE);

        // Draw letter value
        this.overlayContext.font = this.gridService.currentValueFont;
        const DOUBLE_DIGIT = 10;
        if (letterToDraw.value >= DOUBLE_DIGIT) {
            const BIG_OFFSET_X = 15;
            this.overlayContext.fillText(
                String(letterToDraw.value),
                this.currentPosition.x + SQUARE_SIZE - BIG_OFFSET_X,
                this.currentPosition.y + SQUARE_SIZE - 2,
            );
        } else {
            const SMALL_OFFSET_X = 6;
            this.overlayContext.fillText(
                String(letterToDraw.value),
                this.currentPosition.x + SQUARE_SIZE - SMALL_OFFSET_X - 2,
                this.currentPosition.y + SQUARE_SIZE - 2,
            );
        }
    }
    placeLetter(letter: string) {
        let foundLetter: ScrabbleLetter = new ScrabbleLetter('', 0);
        if (letter === letter.toUpperCase()) {
            // Look for a blank piece on the rack
            for (const rackLetter of this.rackService.rackLetters) {
                if (rackLetter.character === '*') {
                    foundLetter = rackLetter;
                    this.currentWord.push(rackLetter);
                    this.rackService.rackLetters.splice(this.rackService.rackLetters.indexOf(rackLetter), 1);
                    break;
                }
            }
        } else {
            // Check for the (non-blank) letter on the rack
            for (const rackLetter of this.rackService.rackLetters) {
                if (rackLetter.character === letter) {
                    foundLetter = rackLetter;
                    this.currentWord.push(rackLetter);
                    this.rackService.rackLetters.splice(this.rackService.rackLetters.indexOf(rackLetter), 1);
                    break;
                }
            }
        }
        if (foundLetter.character !== '') {
            // Draw letters
            this.drawCurrentWord();
            // Update rack
            this.updateRack();
            // Prepare for next call
            let nextSquare = this.findNextSquare(this.currentAxis, this.currentPosition);
            this.currentPosition = nextSquare;
            nextSquare = this.findNextSquare(this.currentAxis, this.currentPosition);
            this.drawSquare(this.currentPosition, 'green');
            this.drawSquare(nextSquare, 'yellow');
        } else return;
    }
    updateRack() {
        this.rackService.gridContext.clearRect(0, 0, RACK_WIDTH, RACK_HEIGHT);
        this.rackService.drawRack();
        this.rackService.drawExistingLetters();
    }
    confirmWord() {
        // TODO
        // Send a message to the server that we want to place the word
        // Wait for the response from the server
        // If the response is positive, draw the word on the board canvas and remove the overlay
        // If the response is negative, give back the letters to the player on their rack and set a 3 second timer
    }
    // Removes the latest drawn square preview from the canvas
    removeLatestPreview(axis: Axis) {
        const previousSquareDrawn = this.findNextSquare(invertAxis[axis], this.latestPosition);
        this.overlayContext.beginPath();
        this.overlayContext.clearRect(previousSquareDrawn.x, previousSquareDrawn.y, SQUARE_SIZE + 2, SQUARE_SIZE + 2);
    }
    // Removes latest current square selected
    removeLatestCurrentSquare() {
        this.overlayContext.beginPath();
        this.overlayContext.clearRect(this.latestPosition.x, this.latestPosition.y, SQUARE_SIZE + 2, SQUARE_SIZE + 2);
    }
    removeAllLetters() {
        while (this.currentWord.length > 0) {
            const popped = this.currentWord.pop();
            if (popped !== undefined) {
                this.rackService.addLetter(popped);
            }
        }
        this.currentWord = [];
    }
    // Resets the canvas and the word in progress
    // this does not work for some ungodly reason. Maybe the canvas can't handle focus events?
    findNextSquare(axis: Axis, position: Vec2): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x + SQUARE_SIZE + 2;
        } else if (axis === Axis.V) {
            newPosition.y = position.y + SQUARE_SIZE + 2;
        }
        return newPosition;
    }
    findPreviousSquare(axis: Axis, position: Vec2): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x - SQUARE_SIZE - 2;
        } else if (axis === Axis.V) {
            newPosition.y = position.y - SQUARE_SIZE - 2;
        }
        return newPosition;
    }
    convertPositionToGridIndex(position: Vec2): number[] {
        const positionInGrid: Vec2 = new Vec2(position.x - BOARD_OFFSET, position.y - BOARD_OFFSET);
        // gridIndex : [row, column]
        const gridIndex: number[] = [Math.floor(positionInGrid.x / (SQUARE_SIZE + 2)), Math.floor(positionInGrid.y / (SQUARE_SIZE + 2))];
        return gridIndex;
    }

    removeLetter() {
        const lastLetter = this.currentWord.pop();
        if (lastLetter !== undefined) this.rackService.rackLetters.push(lastLetter);
        // Draw letter on the end of the canvas
        this.rackService.drawExistingLetters();
        const lastLetterPos = this.currentPosition;
        const previousSquare = this.findPreviousSquare(this.currentAxis, lastLetterPos);
        if (this.currentWord.length >= 0 && previousSquare.x >= this.initialPosition.x && previousSquare.y >= this.initialPosition.y) {
            // Shift one spot left/up
            this.currentPosition = previousSquare;
            this.drawCurrentWord();
            this.overlayContext.clearRect(
                this.currentPosition.x,
                this.currentPosition.y,
                this.overlayContext.canvas.width,
                this.overlayContext.canvas.height,
            ); // (Remove marker)
            this.drawSquare(this.currentPosition, 'green');
            this.drawSquare(this.findNextSquare(this.currentAxis, this.currentPosition), 'yellow');
        }
    }
    drawCurrentWord() {
        const indexes = this.convertPositionToGridIndex(this.initialPosition);
        for (let i = 0; i < this.currentWord.length; i++) {
            if (this.currentAxis === Axis.H) {
                if (indexes[0] + i < BOARD_SIZE || indexes[1] < BOARD_SIZE)
                    this.drawLetter(this.currentWord[i], new Vec2(indexes[0] + i, indexes[1]));
            } else {
                if (indexes[0] < BOARD_SIZE || indexes[1] + i < BOARD_SIZE)
                    this.drawLetter(this.currentWord[i], new Vec2(indexes[0], indexes[1] + i));
            }
        }
    }
    normalizeLetter(keyPressed: string): string {
        const letter = keyPressed.normalize('NFD').replace(/\p{Diacritic}/gu, '')[0];
        return letter;
    }
    clearOverlay() {
        this.overlayContext.clearRect(0, 0, this.overlayContext.canvas.width, this.overlayContext.canvas.height);
    }
}
