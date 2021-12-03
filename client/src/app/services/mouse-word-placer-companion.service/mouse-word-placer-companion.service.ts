import { Injectable } from '@angular/core';
import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { SquareColor } from '@app/classes/square/square';
import { Axis } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { BOARD_SIZE } from '@app/services/grid.service/grid.service';
import { ABSOLUTE_BOARD_SIZE, ACTUAL_SQUARE_SIZE } from '@app/services/mouse-word-placer.service/mouse-word-placer.service';

@Injectable({
    providedIn: 'root',
})
export class MouseWordPlacerCompanionService {
    convertPositionToGridIndex(position: Vec2): number[] {
        const positionInGrid: Vec2 = new Vec2(position.x, position.y);
        // gridIndex : [row, column]
        let gridIndex: number[] = [Math.floor(positionInGrid.x / ACTUAL_SQUARE_SIZE), Math.floor(positionInGrid.y / ACTUAL_SQUARE_SIZE)];
        if (position.x > ABSOLUTE_BOARD_SIZE || position.y > ABSOLUTE_BOARD_SIZE) return (gridIndex = [BOARD_SIZE, BOARD_SIZE]); // Out of bounds
        return gridIndex;
    }
    // Resets the canvas and the word in progress
    findNextSquare(axis: Axis, position: Vec2, board: ScrabbleBoard): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x + ACTUAL_SQUARE_SIZE;
        } else if (axis === Axis.V) {
            newPosition.y = position.y + ACTUAL_SQUARE_SIZE;
        }
        if (newPosition.x > ABSOLUTE_BOARD_SIZE || newPosition.y > ABSOLUTE_BOARD_SIZE) return new Vec2(0, 0);
        const newPositionIndexes = this.convertPositionToGridIndex(newPosition);
        if (board.squares[newPositionIndexes[0]][newPositionIndexes[1]].occupied) this.findNextSquare(axis, newPosition, board);
        return newPosition;
    }
    findPreviousSquare(axis: Axis, position: Vec2, board: ScrabbleBoard): Vec2 {
        const newPosition = new Vec2(position.x, position.y);
        if (axis === Axis.H) {
            newPosition.x = position.x - ACTUAL_SQUARE_SIZE;
        } else if (axis === Axis.V) {
            newPosition.y = position.y - ACTUAL_SQUARE_SIZE;
        }
        if (newPosition.x < 0 || newPosition.y < 0) return new Vec2(0, 0);
        const newPositionIndexes = this.convertPositionToGridIndex(newPosition);
        if (board.squares[newPositionIndexes[0]][newPositionIndexes[1]].occupied) this.findPreviousSquare(axis, newPosition, board);
        return newPosition;
    }
    samePosition(pos: Vec2, otherPos: Vec2): boolean {
        return pos.x === otherPos.x && pos.y === otherPos.y;
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
                context.fillStyle = '#E60000';
                break;
            default:
                break;
        }
    }
}
