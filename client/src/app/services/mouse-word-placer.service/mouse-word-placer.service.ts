/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { DefaultCommandParams, PlaceParams } from '@app/classes/commands/commands';
import { PlaceCmd } from '@app/classes/place-command/place-command';
import { BOARD_SIZE } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter, setLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { Axis, isCoordInsideBoard, isValidLetter, removeAccents } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { CommandInvokerService } from '@app/services/command-invoker.service/command-invoker.service';
import { GameService } from '@app/services/game.service/game.service';
import { ABSOLUTE_BOARD_SIZE, ACTUAL_SQUARE_SIZE, BOARD_OFFSET, GridService, SQUARE_SIZE } from '@app/services/grid.service/grid.service';
import { MouseWordPlacerCompanionService } from '@app/services/mouse-word-placer-companion.service/mouse-word-placer-companion.service';
import { RackService, RACK_HEIGHT, RACK_WIDTH } from '@app/services/rack.service/rack.service';
@Injectable({
    providedIn: 'root',
})
export class MouseWordPlacerService {
    currentAxis: Axis;
    initialPosition: Vec2;
    latestPosition: Vec2;
    currentPosition: Vec2;
    deletePosition: Vec2;
    currentWord: ScrabbleLetter[];
    wordString: string;
    overlayContext: CanvasRenderingContext2D;

    constructor(
        private gridService: GridService,
        private rackService: RackService,
        private gameService: GameService,
        private commandInvokerService: CommandInvokerService,
        private companionService: MouseWordPlacerCompanionService,
    ) {
        this.currentAxis = Axis.H;
        this.initialPosition = new Vec2();
        this.latestPosition = new Vec2();
        this.currentPosition = new Vec2();
        this.deletePosition = new Vec2();
        this.currentWord = [];
        this.wordString = '';
    }

    onMouseClick(e: MouseEvent) {
        if (!this.gameService.game.getLocalPlayer().isActive || this.currentWord.length > 0 || this.gameService.game.isEndGame) return;
        this.clearOverlay();
        if (this.initialPosition.x !== 0 && this.initialPosition.y !== 0) {
            this.drawArrow(this.initialPosition, this.currentAxis);
        }
        this.removeAllLetters();
        // Mouse position relative to the start of the grid in the canvas
        const mousePositionX = e.offsetX + BOARD_OFFSET;
        const mousePositionY = e.offsetY + BOARD_OFFSET;
        // Square would be out of bounds.
        // Now we find the origin of the square in which we clicked
        let xBaseOfSquare = Math.floor(mousePositionX / ACTUAL_SQUARE_SIZE) * ACTUAL_SQUARE_SIZE;
        xBaseOfSquare = xBaseOfSquare - ACTUAL_SQUARE_SIZE / 2 + 2;
        let yBaseOfSquare = Math.floor(mousePositionY / ACTUAL_SQUARE_SIZE) * ACTUAL_SQUARE_SIZE;
        yBaseOfSquare = yBaseOfSquare - ACTUAL_SQUARE_SIZE / 2 + 2;
        const clickedSquare: Vec2 = new Vec2(xBaseOfSquare, yBaseOfSquare);
        const indexes = this.companionService.convertPositionToGridIndex(clickedSquare);
        if (indexes.x >= BOARD_SIZE || indexes.y >= BOARD_SIZE) return;
        if (this.gridService.scrabbleBoard.squares[indexes.x][indexes.y].occupied === true) return;
        this.currentPosition = clickedSquare;
        this.initialPosition = clickedSquare;
        if (!this.companionService.samePosition(clickedSquare, this.latestPosition)) {
            this.removeAllLetters();
            this.clearOverlay();
            if (this.currentAxis !== Axis.H) {
                this.currentAxis = Axis.H;
            }
            this.drawArrow(clickedSquare, this.currentAxis);
            this.latestPosition = clickedSquare;
        } else if (this.companionService.samePosition(clickedSquare, this.latestPosition)) {
            switch (this.currentAxis) {
                case Axis.H:
                    this.currentAxis = Axis.V;
                    break;
                case Axis.V:
                    this.currentAxis = Axis.H;
                    break;
            }
            this.clearOverlay();
            this.drawArrow(clickedSquare, this.currentAxis);
            this.latestPosition = clickedSquare;
        }
    }

    onKeyDown(e: KeyboardEvent) {
        if (this.gameService.game.getLocalPlayer().isActive === false) return;
        if (this.initialPosition.x === 0 && this.initialPosition.y === 0) return;
        const keyPressed = e.key;
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
                if (
                    isValidLetter(removeAccents(keyPressed)) &&
                    this.currentPosition.x < ABSOLUTE_BOARD_SIZE &&
                    this.currentPosition.y < ABSOLUTE_BOARD_SIZE
                ) {
                    this.findPlaceForLetter(keyPressed);
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

    findPlaceForLetter(keyPressed: string) {
        let pos = this.companionService.convertPositionToGridIndex(this.currentPosition);
        while (this.gridService.scrabbleBoard.squares[pos.x][pos.y].occupied && isCoordInsideBoard(pos)) {
            const boardLetter = this.gridService.scrabbleBoard.squares[pos.x][pos.y].letter;
            this.wordString += boardLetter.character === '*' ? boardLetter.whiteLetterCharacter : boardLetter.character;
            // Update the current position to the next position
            this.currentPosition =
                this.currentAxis === Axis.H
                    ? new Vec2(this.currentPosition.x + ACTUAL_SQUARE_SIZE, this.currentPosition.y)
                    : new Vec2(this.currentPosition.x, this.currentPosition.y + ACTUAL_SQUARE_SIZE);
            pos = this.companionService.convertPositionToGridIndex(this.currentPosition);
        }
        // Place a new letter only if the next position is unoccupied and in the board
        if (!isCoordInsideBoard(pos)) return;
        this.placeLetter(removeAccents(keyPressed));
    }

    // Draws an arrow on the canvas in the square specified by the position
    drawArrow(position: Vec2, axis: Axis) {
        const indexes = this.companionService.convertPositionToGridIndex(position);
        if (indexes.x < 0 || indexes.x >= BOARD_SIZE || indexes.y < 0 || indexes.y >= BOARD_SIZE) return;
        this.drawSquare(position, this.companionService.convertColorToString(this.gridService.scrabbleBoard.squares[indexes.x][indexes.y].color));
        if (indexes.x >= BOARD_SIZE || indexes.y >= BOARD_SIZE) return;
        this.overlayContext.textAlign = 'center';
        this.overlayContext.textBaseline = 'middle';
        this.overlayContext.font = 'bold 20px Arial';
        this.overlayContext.fillStyle = 'black';
        if (axis === Axis.H) {
            this.overlayContext.fillText('→', position.x + ACTUAL_SQUARE_SIZE / 2, position.y + ACTUAL_SQUARE_SIZE / 2, ACTUAL_SQUARE_SIZE);
        } else if (axis === Axis.V) {
            this.overlayContext.fillText('↓', position.x + ACTUAL_SQUARE_SIZE / 2, position.y + ACTUAL_SQUARE_SIZE / 2, ACTUAL_SQUARE_SIZE);
        }
        // Reset values of context
        this.overlayContext.textAlign = 'start';
        this.overlayContext.textBaseline = 'alphabetic';
        this.overlayContext.font = 'normal 12px Arial';
    }

    // Draws a square on the canvas at the given position with the given color
    drawSquare(position: Vec2, color: string) {
        const indexes = this.companionService.convertPositionToGridIndex(position);
        if (indexes.x >= BOARD_SIZE || indexes.y >= BOARD_SIZE) return;
        this.overlayContext.beginPath();
        this.companionService.changeFillStyleColor(this.overlayContext, color);
        this.overlayContext.fillRect(position.x + 1, position.y + 1, SQUARE_SIZE, SQUARE_SIZE);
    }

    updateRack() {
        this.rackService.gridContext.clearRect(0, 0, RACK_WIDTH, RACK_HEIGHT);
        this.rackService.drawRack();
        this.rackService.drawExistingLetters();
    }

    confirmWord() {
        const posVec = this.companionService.convertPositionToGridIndex(this.initialPosition);
        const defaultParams: DefaultCommandParams = { player: this.gameService.game.getLocalPlayer(), serviceCalled: this.gameService };
        const params: PlaceParams = { position: posVec, orientation: this.currentAxis, word: this.wordString };
        // Refund letters to rack before placing
        this.removeAllLetters();
        const command = new PlaceCmd(defaultParams, params);
        this.commandInvokerService.executeCommand(command);
        this.clearOverlay();
    }

    // Removes the latest drawn arrow indicator
    removeArrow() {
        this.overlayContext.beginPath();
        this.overlayContext.clearRect(this.currentPosition.x, this.currentPosition.y, ACTUAL_SQUARE_SIZE, ACTUAL_SQUARE_SIZE);
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

    removeLetter() {
        const lastLetter = this.currentWord.pop();
        if (lastLetter !== undefined) {
            let stringLetter = lastLetter.character;
            if (lastLetter.character === '*') {
                stringLetter = lastLetter.whiteLetterCharacter;
                lastLetter.whiteLetterCharacter = '*';
            }
            this.rackService.rackLetters.push(lastLetter);
            const charPosition = this.wordString.lastIndexOf(stringLetter);
            const partOne = this.wordString.substring(0, charPosition);
            // const partTwo = this.wordString.substring(charPosition + 1);
            this.wordString = partOne;
        }
        // Draw letter on the end of the canvas
        this.rackService.drawExistingLetters();
        const lastLetterPos = this.currentPosition;
        let previousSquare = this.companionService.findPreviousSquare(this.currentAxis, lastLetterPos, this.gridService.scrabbleBoard);
        if (this.deletePosition.x !== 0 || this.deletePosition.y !== 0) {
            previousSquare = this.deletePosition;
            this.deletePosition = new Vec2(0, 0);
        } // The line above is a bit of a hack but it's the only way I could get it to work
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
            this.drawArrow(this.currentPosition, this.currentAxis);
        }
    }

    drawCurrentWord() {
        const indexes = this.companionService.convertPositionToGridIndex(this.initialPosition);
        for (let i = 0; i < this.currentWord.length; i++) {
            if (this.currentAxis === Axis.H) {
                if (indexes.x + i < BOARD_SIZE && indexes.y < BOARD_SIZE) {
                    if (this.gridService.scrabbleBoard.squares[indexes.x + i][indexes.y].occupied) indexes.x++;
                    this.drawLetter(this.currentWord[i], new Vec2(indexes.x + i, indexes.y));
                }
            } else {
                if (indexes.x < BOARD_SIZE && indexes.y + i < BOARD_SIZE) {
                    if (this.gridService.scrabbleBoard.squares[indexes.x][indexes.y + i].occupied) indexes.y++;
                    this.drawLetter(this.currentWord[i], new Vec2(indexes.x, indexes.y + i));
                }
            }
        }
    }

    clearOverlay() {
        this.overlayContext.clearRect(0, 0, this.overlayContext.canvas.width, this.overlayContext.canvas.height);
    }

    private drawLetter(letterToDraw: ScrabbleLetter, pos: Vec2) {
        if (
            pos.x >= BOARD_SIZE ||
            pos.y >= BOARD_SIZE ||
            this.currentPosition.x > ABSOLUTE_BOARD_SIZE ||
            this.currentPosition.y > ABSOLUTE_BOARD_SIZE
        )
            return;
        letterToDraw.color = this.gridService.scrabbleBoard.squares[pos.x][pos.y].color;
        const letter = letterToDraw.character === '*' ? letterToDraw.whiteLetterCharacter : letterToDraw.character.toUpperCase();
        // Draw background
        this.drawSquare(this.currentPosition, this.companionService.convertColorToString(letterToDraw.color));
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

    private placeLetter(letter: string) {
        if (this.currentPosition.x === ABSOLUTE_BOARD_SIZE || this.currentPosition.y === ABSOLUTE_BOARD_SIZE)
            this.deletePosition = this.currentPosition;
        const indexes = this.companionService.convertPositionToGridIndex(this.currentPosition);
        if (indexes.x >= BOARD_SIZE || indexes.y >= BOARD_SIZE) return;
        let foundLetter: ScrabbleLetter = new ScrabbleLetter('', 0);
        if (letter === letter.toUpperCase()) {
            // Look for a blank piece on the rack
            for (let rackLetter of this.rackService.rackLetters) {
                if (rackLetter.character === '*') {
                    foundLetter = rackLetter;
                    rackLetter = setLetter(letter, rackLetter); // sets the whiteLetterCharacter attributes
                    this.currentWord.push(rackLetter);
                    this.wordString += letter;
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
            const nextSquare = this.companionService.findNextSquare(this.currentAxis, this.currentPosition, this.gridService.scrabbleBoard);
            this.currentPosition = nextSquare;
            const pos = this.companionService.convertPositionToGridIndex(this.currentPosition);
            if (pos.x >= BOARD_SIZE || pos.y >= BOARD_SIZE) return;
            // let nextArrow = this.currentPosition;
            // if (this.gridService.scrabbleBoard.squares[pos[0]][pos[1]].occupied === true)
            //     nextArrow = this.companionService.findNextSquare(this.currentAxis, this.currentPosition, this.gridService.scrabbleBoard);
            this.drawArrow(this.currentPosition, this.currentAxis);
            // Arrow display bug is here, need to fix before final commit. Works for 1st skip but not further ones.
        }
    }
}
