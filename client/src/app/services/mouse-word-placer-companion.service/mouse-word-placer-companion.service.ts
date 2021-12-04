import { Injectable } from '@angular/core';
import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { Square, SquareColor } from '@app/classes/square/square';
import { Axis, isCoordInsideBoard } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { ABSOLUTE_BOARD_SIZE, ACTUAL_SQUARE_SIZE, BOARD_SIZE } from '@app/services/grid.service/grid.service';

@Injectable({
    providedIn: 'root',
})
export class MouseWordPlacerCompanionService {
    convertPositionToGridIndex(position: Vec2): Vec2 {
        const positionInGrid: Vec2 = new Vec2(position.x, position.y);
        // gridIndex : [row, column]
        const gridIndex = new Vec2(Math.floor(positionInGrid.x / ACTUAL_SQUARE_SIZE), Math.floor(positionInGrid.y / ACTUAL_SQUARE_SIZE));
        if (position.x >= ABSOLUTE_BOARD_SIZE || position.y >= ABSOLUTE_BOARD_SIZE) {
            gridIndex.x = BOARD_SIZE;
            gridIndex.y = BOARD_SIZE;
        } // Out of bounds
        return gridIndex;
    }

    // Resets the canvas and the word in progress
    findNextSquare(axis: Axis, position: Vec2, board: ScrabbleBoard): Vec2 {
        let newPosition =
            axis === Axis.H ? new Vec2(position.x + ACTUAL_SQUARE_SIZE, position.y) : new Vec2(position.x, position.y + ACTUAL_SQUARE_SIZE);
        const newPositionIndexes = this.convertPositionToGridIndex(newPosition);
        // Next position is out of bound
        if (!isCoordInsideBoard(newPositionIndexes)) return newPosition;
        // Find the next square position
        if (board.squares[newPositionIndexes.x][newPositionIndexes.y].occupied) {
            newPosition = this.findNextSquare(axis, newPosition, board);
        }
        return newPosition;
    }

    findPreviousSquare(axis: Axis, position: Vec2, board: ScrabbleBoard): Vec2 {
        let newPosition =
            axis === Axis.H ? new Vec2(position.x - ACTUAL_SQUARE_SIZE, position.y) : new Vec2(position.x, position.y - ACTUAL_SQUARE_SIZE);
        // Previous position is out of bound
        if (newPosition.x < 0 || newPosition.y < 0) return position;
        // Find the following previous square position
        const newPositionIndexes = this.convertPositionToGridIndex(newPosition);
        if (board.squares[newPositionIndexes.x][newPositionIndexes.y].occupied) {
            newPosition = this.findPreviousSquare(axis, newPosition, board);
        }
        return newPosition;
    }

    getStringLettersFromBoard(startCoord: Vec2, endCoord: Vec2, squares: Square[][]): string {
        const isHorizontal = startCoord.y === endCoord.y;
        let letters = '';
        // Add any letter on board until the next square to place letter on
        while (!this.samePosition(startCoord, endCoord) && squares[startCoord.x][startCoord.y].occupied) {
            const boardLetter = squares[startCoord.x][startCoord.y].letter;
            letters += boardLetter.character === '*' ? boardLetter.whiteLetterCharacter : boardLetter.character;
            if (isHorizontal) {
                startCoord.x++;
                continue;
            }
            startCoord.y--;
        }
        return letters;
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
