import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_OFFSET, GridService, SQUARE_SIZE } from './grid.service';
import { RackService } from './rack.service';
@Injectable({
    providedIn: 'root',
})
export class MouseWordPlacerService {
    currentAxis: Axis;
    latestPosition: Vec2;
    latestKey: string;
    currentWord: ScrabbleLetter[];
    constructor(private gridService: GridService, private rackService: RackService) {
        this.currentAxis = Axis.H;
        this.latestPosition = new Vec2();
        this.latestKey = '';
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
        const indexes = this.convertPositionToGridIndex(clickedSquare);
        if (this.gridService.scrabbleBoard.squares[indexes[0]][indexes[1]].occupied === true) {
            return; // Don't do anything since square is occupied
        }
        let nextSquare: Vec2 = new Vec2();
        nextSquare = this.findNextSquare(this.currentAxis, clickedSquare);
        if (nextSquare.x !== this.latestPosition.x && nextSquare.y !== this.latestPosition.y) {
            if (this.currentAxis !== Axis.H) {
                this.currentAxis = Axis.H;
                nextSquare = this.findNextSquare(this.currentAxis, clickedSquare);
            }
            this.latestPosition = nextSquare;
            this.gridService.gridContext.beginPath();
            // const arrowOrigin = new Vec2(nextSquare.x + BOARD_OFFSET, nextSquare.y + BOARD_OFFSET);
            // const arrowEnd = new Vec2(arrowOrigin.x + 15, arrowOrigin.y);
            // Rework function : this.canvasArrow(arrowOrigin, arrowEnd);
            this.gridService.gridContext.fillRect(nextSquare.x, nextSquare.y, SQUARE_SIZE + 2, SQUARE_SIZE + 2);
        } else {
            switch (this.currentAxis) {
                case Axis.H:
                    this.currentAxis = Axis.V;
                    break;
                case Axis.V:
                    this.currentAxis = Axis.H;
                    break;
            }
            nextSquare = this.findNextSquare(this.currentAxis, clickedSquare);
            this.latestPosition = nextSquare;
            this.gridService.gridContext.beginPath();
            this.gridService.gridContext.fillRect(nextSquare.x, nextSquare.y, SQUARE_SIZE + 2, SQUARE_SIZE + 2);
        }
    }
    findNextSquare(axis: Axis, position: Vec2): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x + SQUARE_SIZE + 2;
        } else if (axis === Axis.V) {
            newPosition.y = position.y + SQUARE_SIZE + 2;
        }
        return newPosition;
    }
    convertPositionToGridIndex(position: Vec2): number[] {
        const positionInGrid: Vec2 = new Vec2(position.x - BOARD_OFFSET, position.y - BOARD_OFFSET);
        const gridIndex: number[] = [Math.floor(positionInGrid.x / (SQUARE_SIZE + 2)), Math.floor(positionInGrid.y / (SQUARE_SIZE + 2))];
        return gridIndex;
    }
    onKeyDown(e: KeyboardEvent) {
        const keyPressed = e.key;
        const alphabet = 'abcdefghijklmnopqrstuvwxyzàâçéèêëïîöôûü';
        if (keyPressed === 'Backspace') {
            this.removeLetter();
        } else if (this.latestKey === 'Shift' && keyPressed !== 'Shift') {
            this.placeBlankLetter(keyPressed);
            this.latestKey = keyPressed;
            // use this for blank pieces.
        } else if (this.latestKey !== 'Shift' && alphabet.includes(keyPressed)) {
            this.placeLetter(keyPressed);
        }
    }
    removeLetter() {
        // TODO : removeLetter temporary function
    }
    placeBlankLetter(keyPressed: string) {
        // Normalize key pressed, decomposes "è" into "e`"
        const letter = keyPressed.normalize('NFD').replace(/\p{Diacritic}/gu, '')[0];
        this.placeLetter(letter);
    }
    placeLetter(letter: string) {
        // Check for the letter on the rack
        if (letter === letter.toUpperCase()) {
            // look for a blank piece
            for (const rackLetter of this.rackService.rackLetters) {
                if (rackLetter.character === '*') {
                    // TODO: Remove letter, place on board
                }
            }
        } else {
            // Disregard the blank pieces
        }
    }
    // canvasArrow(origin: Vec2, end: Vec2) {
    //     const headLength = 10; // length of head in pixels
    //     const dx = end.x - origin.x;
    //     const dy = end.y - origin.y;
    //     const angle = Math.atan2(dy, dx);
    //     this.gridService.gridContext.moveTo(origin.x, origin.y);
    //     this.gridService.gridContext.lineTo(end.x, end.y);
    //     this.gridService.gridContext.lineTo(end.x - headLength *Math.cos(angle - Math.PI / 6), end.y - headLength * Math.sin(angle - Math.PI / 6));
    //     this.gridService.gridContext.moveTo(end.x, end.y);
    //     this.gridService.gridContext.lineTo(end.x - headLength *Math.cos(angle + Math.PI / 6), end.y - headLength * Math.sin(angle + Math.PI / 6));
    // }
}
