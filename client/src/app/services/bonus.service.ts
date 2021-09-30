import { Injectable } from '@angular/core';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';
import { GridService } from './grid.service';

const PINK_FACTOR = 2;
const RED_FACTOR = 3;

@Injectable({
    providedIn: 'root',
})
export class BonusService {
    constructor(private readonly gridService: GridService) {}

    totalValue(scrabbleWord: ScrabbleWord): number {
        let total = 0;
        let pinkBonusCount = 0;
        let redBonusCount = 0;
        for (let i = 0; i < scrabbleWord.content.length; i++) {
            // Account for letter pale/dark blue bonuses
            if (scrabbleWord.orientation === WordOrientation.Horizontal) {
                if (!this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed) {
                    const color = scrabbleWord.content[i].color;
                    switch (color) {
                        case SquareColor.Teal:
                          scrabbleWord.content[i].tealBonus();
                            this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                            break;
                        case SquareColor.DarkBlue:
                          scrabbleWord.content[i].darkBlueBonus();
                            this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                            break;
                        case SquareColor.Pink:
                            pinkBonusCount++;
                            this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                            break;
                        case SquareColor.Red:
                            redBonusCount++;
                            this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                            break;
                    }
                }
            }
            else if (scrabbleWord.orientation === WordOrientation.Vertical) {
                if (!this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed) {
                    const color = scrabbleWord.content[i].color;
                    switch (color) {
                        case SquareColor.Teal:
                          scrabbleWord.content[i].tealBonus();
                            this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                            break;
                        case SquareColor.DarkBlue:
                          scrabbleWord.content[i].darkBlueBonus();
                            this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                            break;
                        case SquareColor.Pink:
                            pinkBonusCount++;
                            this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                            break;
                        case SquareColor.Red:
                            redBonusCount++;
                            this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                            break;
                    }
                }
            }
            total += scrabbleWord.content[i].value;
        }
        // Word pink/red bonuses
        if (pinkBonusCount !== 0) {
            total = total * PINK_FACTOR * pinkBonusCount;
        }
        if (redBonusCount !== 0) {
            total = total * RED_FACTOR * redBonusCount;
        }
        scrabbleWord.value = total;
        return total;
    }
}
