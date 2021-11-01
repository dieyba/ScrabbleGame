/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { DefaultCommandParams, PlaceParams } from '@app/classes/commands';
import { PlaceCmd } from '@app/classes/place-command';
import { BOARD_SIZE } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { SquareColor } from '@app/classes/square';
import { Axis, invertAxis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { CommandInvokerService } from './command-invoker.service';
import { GameService } from './game.service';
import { BOARD_OFFSET, GridService, SQUARE_SIZE } from './grid.service';
import { RackService, RACK_HEIGHT, RACK_WIDTH } from './rack.service';
const ABSOLUTE_BOARD_SIZE = 580;
const ACTUAL_SQUARE_SIZE = SQUARE_SIZE + 2;
@Injectable({
    providedIn: 'root',
})
export class MouseWordPlacerService {
    currentAxis: Axis;
    initialPosition: Vec2;
    latestPosition: Vec2;
    currentPosition: Vec2;
    currentWord: ScrabbleLetter[];
    wordString: string;
    overlayContext: CanvasRenderingContext2D;

    constructor(
        private gridService: GridService,
        private rackService: RackService,
        private gameService: GameService,
        private commandInvokerService: CommandInvokerService,
    ) {
        this.currentAxis = Axis.H;
        this.initialPosition = new Vec2();
        this.latestPosition = new Vec2();
        this.currentPosition = new Vec2();
        this.currentWord = [];
        this.wordString = '';
    }
    onMouseClick(e: MouseEvent) {
        this.clearOverlay();
        if (this.initialPosition.x !== 0 && this.initialPosition.y !== 0) {
            this.drawSquare(this.initialPosition, 'green');
        }
        this.removeAllLetters();
        // Mouse position relative to the start of the grid in the canvas
        const mousePositionX = e.offsetX + BOARD_OFFSET;
        const mousePositionY = e.offsetY + BOARD_OFFSET;
        if (mousePositionX < ACTUAL_SQUARE_SIZE || mousePositionY < ACTUAL_SQUARE_SIZE) return;
        // Square would be out of bounds.
        // Now we find the origin of the square in which we clicked
        let xBaseOfSquare = Math.floor(mousePositionX / ACTUAL_SQUARE_SIZE) * ACTUAL_SQUARE_SIZE;
        xBaseOfSquare = xBaseOfSquare - ACTUAL_SQUARE_SIZE / 2;
        let yBaseOfSquare = Math.floor(mousePositionY / ACTUAL_SQUARE_SIZE) * ACTUAL_SQUARE_SIZE;
        yBaseOfSquare = yBaseOfSquare - ACTUAL_SQUARE_SIZE / 2;
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
            this.removeAllLetters();
            this.clearOverlay();
            this.drawSquare(clickedSquare, 'green');
            if (this.currentAxis !== Axis.H) {
                this.currentAxis = Axis.H;
                nextSquare = this.findNextSquare(this.currentAxis, clickedSquare);
            }
            this.latestPosition = clickedSquare;
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
                this.wordString = '';
            }
            nextSquare = this.findNextSquare(this.currentAxis, clickedSquare);
            this.latestPosition = clickedSquare;
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
                    let pos = this.convertPositionToGridIndex(this.currentPosition);
                    let i = 0;
                    if (pos[0] + i >= BOARD_SIZE || pos[1] + i >= BOARD_SIZE) return;
                    while (this.gridService.scrabbleBoard.squares[pos[0]][pos[1]].occupied === true && pos[0] < BOARD_SIZE && pos[1] < BOARD_SIZE) {
                        this.wordString += this.gridService.scrabbleBoard.squares[pos[0]][pos[1]].letter.character;
                        if (pos[0] + i >= BOARD_SIZE || pos[1] + i >= BOARD_SIZE) return;
                        if (this.currentAxis === Axis.H) {
                            this.currentPosition.x = this.currentPosition.x + ACTUAL_SQUARE_SIZE;
                        } else if (this.currentAxis === Axis.V) {
                            this.currentPosition.y = this.currentPosition.y + ACTUAL_SQUARE_SIZE;
                        }
                        pos = this.convertPositionToGridIndex(this.currentPosition);
                        i++;
                    }
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
        const indexes = this.convertPositionToGridIndex(this.currentPosition);
        if (indexes[0] >= BOARD_SIZE || indexes[1] >= BOARD_SIZE) return;
        let foundLetter: ScrabbleLetter = new ScrabbleLetter('', 0);
        if (letter === letter.toUpperCase()) {
            // Look for a blank piece on the rack
            for (const rackLetter of this.rackService.rackLetters) {
                if (rackLetter.character === '*') {
                    foundLetter = rackLetter;
                    this.currentWord.push(rackLetter);
                    this.wordString += rackLetter.character;
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
                    this.wordString += rackLetter.character;
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
        const posArray = this.convertPositionToGridIndex(this.initialPosition);
        const posVec = new Vec2(posArray[0], posArray[1]);
        const defaultParams: DefaultCommandParams = { player: this.gameService.currentGameService.localPlayer, serviceCalled: this.gameService };
        const params: PlaceParams = { position: posVec, orientation: this.currentAxis, word: this.wordString };
        // Refund letters to rack before placing
        this.removeAllLetters();
        const command = new PlaceCmd(defaultParams, params);
        this.commandInvokerService.executeCommand(command);
        // TODO: Wait 3s before clearing overlay
        this.clearOverlay();
    }
    // Removes the latest drawn square preview from the canvas
    removeLatestPreview(axis: Axis) {
        const previousSquareDrawn = this.findNextSquare(invertAxis[axis], this.latestPosition);
        this.overlayContext.beginPath();
        this.overlayContext.clearRect(previousSquareDrawn.x, previousSquareDrawn.y, ACTUAL_SQUARE_SIZE, ACTUAL_SQUARE_SIZE);
    }
    removeLatestCurrentSquare() {
        this.overlayContext.beginPath();
        this.overlayContext.clearRect(this.latestPosition.x, this.latestPosition.y, ACTUAL_SQUARE_SIZE, ACTUAL_SQUARE_SIZE);
    }
    removeAllLetters() {
        while (this.currentWord.length > 0) {
            const popped = this.currentWord.pop();
            if (popped !== undefined) {
                this.rackService.addLetter(popped);
            }
        }
        this.wordString = '';
        this.currentWord = [];
    }
    // Resets the canvas and the word in progress
    findNextSquare(axis: Axis, position: Vec2): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x + ACTUAL_SQUARE_SIZE;
        } else if (axis === Axis.V) {
            newPosition.y = position.y + ACTUAL_SQUARE_SIZE;
        }
        if (newPosition.x > ABSOLUTE_BOARD_SIZE || newPosition.y > ABSOLUTE_BOARD_SIZE) return this.currentPosition;
        const newPositionIndexes = this.convertPositionToGridIndex(newPosition);
        if (newPositionIndexes[0] > BOARD_SIZE || newPositionIndexes[1] > BOARD_OFFSET) return this.currentPosition;
        if (this.gridService.scrabbleBoard.squares[newPositionIndexes[0]][newPositionIndexes[1]].occupied)
            this.findNextSquare(this.currentAxis, newPosition);
        return newPosition;
    }
    findPreviousSquare(axis: Axis, position: Vec2): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x - SQUARE_SIZE - 2;
        } else if (axis === Axis.V) {
            newPosition.y = position.y - SQUARE_SIZE - 2;
        }
        if (newPosition.x < 0 || newPosition.y < 0) return this.currentPosition;
        const newPositionIndexes = this.convertPositionToGridIndex(newPosition);
        if (this.gridService.scrabbleBoard.squares[newPositionIndexes[0]][newPositionIndexes[1]].occupied)
            this.findPreviousSquare(this.currentAxis, newPosition);
        return newPosition;
    }
    convertPositionToGridIndex(position: Vec2): number[] {
        const positionInGrid: Vec2 = new Vec2(position.x - BOARD_OFFSET, position.y - BOARD_OFFSET);
        // gridIndex : [row, column]
        const gridIndex: number[] = [Math.floor(positionInGrid.x / ACTUAL_SQUARE_SIZE), Math.floor(positionInGrid.y / ACTUAL_SQUARE_SIZE)];
        return gridIndex;
    }
    removeLetter() {
        const lastLetter = this.currentWord.pop();
        if (lastLetter !== undefined) {
            this.rackService.rackLetters.push(lastLetter);
            const charPosition = this.wordString.lastIndexOf(lastLetter.character);
            const partOne = this.wordString.substring(0, charPosition);
            const partTwo = this.wordString.substring(charPosition + 1);
            this.wordString = partOne + partTwo;
        }
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
