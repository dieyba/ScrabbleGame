import { Injectable } from '@angular/core';
import { SquareColor } from '@app/classes/square';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_OFFSET, BOARD_SIZE, GridService } from './grid.service';
import { ABSOLUTE_BOARD_SIZE, ACTUAL_SQUARE_SIZE } from './mouse-word-placer.service';

@Injectable({
    providedIn: 'root',
})
export class MouseWordPlacerCompanionService {
    constructor(private gridService: GridService) {}
    convertPositionToGridIndex(position: Vec2): number[] {
        const positionInGrid: Vec2 = new Vec2(position.x - BOARD_OFFSET, position.y - BOARD_OFFSET);
        // gridIndex : [row, column]
        let gridIndex: number[] = [Math.floor(positionInGrid.x / ACTUAL_SQUARE_SIZE), Math.floor(positionInGrid.y / ACTUAL_SQUARE_SIZE)];
        if (position.x > ABSOLUTE_BOARD_SIZE || position.y > ABSOLUTE_BOARD_SIZE) return (gridIndex = [BOARD_SIZE, BOARD_SIZE]); // Out of bounds
        return gridIndex;
    }
    // Resets the canvas and the word in progress
    findNextSquare(axis: Axis, position: Vec2): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x + ACTUAL_SQUARE_SIZE;
        } else if (axis === Axis.V) {
            newPosition.y = position.y + ACTUAL_SQUARE_SIZE;
        }
        if (newPosition.x > ABSOLUTE_BOARD_SIZE || newPosition.y > ABSOLUTE_BOARD_SIZE) return new Vec2(0, 0);
        const newPositionIndexes = this.convertPositionToGridIndex(newPosition);
        if (this.gridService.scrabbleBoard.squares[newPositionIndexes[0]][newPositionIndexes[1]].occupied) this.findNextSquare(axis, newPosition);
        return newPosition;
    }
    findPreviousSquare(axis: Axis, position: Vec2): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x - ACTUAL_SQUARE_SIZE;
        } else if (axis === Axis.V) {
            newPosition.y = position.y - ACTUAL_SQUARE_SIZE;
        }
        if (newPosition.x < 0 || newPosition.y < 0) return new Vec2(0, 0);
        const newPositionIndexes = this.convertPositionToGridIndex(newPosition);
        if (this.gridService.scrabbleBoard.squares[newPositionIndexes[0]][newPositionIndexes[1]].occupied) this.findPreviousSquare(axis, newPosition);
        return newPosition;
    }
    samePosition(pos: Vec2, otherPos: Vec2): boolean {
        return pos.x === otherPos.x && pos.y === otherPos.y;
    }
    normalizeLetter(keyPressed: string): string {
        const letter = keyPressed.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return letter;
    }
    convertColorToString(color: SquareColor) {
        let stringColor = '';
        switch (color) {
            case SquareColor.None:
                stringColor = 'white';
                break;
            case SquareColor.Teal:
                stringColor = 'teal';
                break;
            case SquareColor.DarkBlue:
                stringColor = 'dark blue';
                break;
            case SquareColor.Pink:
                stringColor = 'pink';
                break;
            case SquareColor.Red:
                stringColor = 'red';
                break;
        }
        return stringColor;
    }
    changeFillStyleColor(context: CanvasRenderingContext2D, color: string) {
        switch (color) {
            case 'white':
                context.fillStyle = 'white';
                break;
            case 'teal':
                context.fillStyle = '#ACE3EE';
                break;
            case 'dark blue':
                context.fillStyle = '#6AA0E0';
                break;
            case 'pink':
                context.fillStyle = '#FFA7C7';
                break;
            case 'red':
                context.fillStyle = '#C03E3E';
                break;
            default:
                break;
        }
    }
    removeLetterFromString(word: string, letter: string): string {
        const charPosition = word.lastIndexOf(letter);
        const partOne = word.substring(0, charPosition);
        const partTwo = word.substring(charPosition + 1);
        return partOne + partTwo;
    }
}
