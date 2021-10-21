import { Injectable } from '@angular/core';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_OFFSET, GridService, SQUARE_SIZE } from './grid.service';
@Injectable({
    providedIn: 'root',
})
export class MouseWordPlacerService {
    constructor(private gridService: GridService) {}

    // convertMousePosition(x: number, y: number){
    //     const newX = Math.ceil(x, )
    // }
    onMouseClick(e: MouseEvent) {
        // Mouse position relative to the start of the grid in the canvas
        const mousePositionX = e.offsetX + BOARD_OFFSET;
        const mousePositionY = e.offsetY + BOARD_OFFSET;
        const mouseRound = SQUARE_SIZE + 2;
        if (mousePositionX < mouseRound || mousePositionY < mouseRound) return;
        // Square would be out of bounds.
        // Now we find the origin of the square in which we clicked
        let tempX = Math.floor(mousePositionX / mouseRound) * mouseRound;
        tempX = tempX - mouseRound / 2;
        let tempY = Math.floor(mousePositionY / mouseRound) * mouseRound;
        tempY = tempY - mouseRound / 2;
        this.gridService.gridContext.beginPath();
        this.gridService.gridContext.fillRect(tempX, tempY, 2, 2);
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
}
