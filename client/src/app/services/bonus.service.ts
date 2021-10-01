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
    pinkBonusCount: number = 0;
    redBonusCount: number = 0;

    constructor(private readonly gridService: GridService) {}

    totalValue(scrabbleWord: ScrabbleWord): number {
        this.pinkBonusCount = 0;
        this.redBonusCount = 0;
        let total = 0;
        scrabbleWord.content.forEach((letter) => {
            // Account for letter pale/dark blue bonuses
            const color = letter.color;
            switch (color) {
                case SquareColor.Teal:
                    total += letter.getTealBonus();
                    break;
                case SquareColor.DarkBlue:
                    total += letter.getDarkBlueBonus();
                    break;
                case SquareColor.Pink:
                    this.pinkBonusCount++;
                    total += letter.value;
                    break;
                case SquareColor.Red:
                    this.redBonusCount++;
                    total += letter.value;
                    break;
                case SquareColor.None:
                    total += letter.value;
                    break;
            }
        });
        // Word pink/red bonuses
        if (this.pinkBonusCount !== 0) {
            total = total * PINK_FACTOR * this.pinkBonusCount;
        }
        if (this.redBonusCount !== 0) {
            total = total * RED_FACTOR * this.redBonusCount;
        }
        scrabbleWord.value = total;
        return total;
    }

    useBonus(scrabbleWord: ScrabbleWord) {
        for (let i = 0; i < scrabbleWord.content.length; i++) {
            if (scrabbleWord.orientation === WordOrientation.Horizontal) {
                if (!this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed) {
                    this.useHorizontalWordBonus(scrabbleWord, i);
                }
            } else if (scrabbleWord.orientation === WordOrientation.Vertical) {
                if (!this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed) {
                    this.useVerticalWordBonus(scrabbleWord, i);
                }
            }
        }
    }

    useHorizontalWordBonus(scrabbleWord: ScrabbleWord, i: number) {
        const color = scrabbleWord.content[i].color;
        switch (color) {
            case SquareColor.Teal:
                this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                break;
            case SquareColor.DarkBlue:
                this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                break;
            case SquareColor.Pink:
                this.pinkBonusCount++;
                this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                break;
            case SquareColor.Red:
                this.redBonusCount++;
                this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                break;
        }
    }

    useVerticalWordBonus(scrabbleWord: ScrabbleWord, i: number) {
        const color = scrabbleWord.content[i].color;
        switch (color) {
            case SquareColor.Teal:
                this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                break;
            case SquareColor.DarkBlue:
                this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                break;
            case SquareColor.Pink:
                this.pinkBonusCount++;
                this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                break;
            case SquareColor.Red:
                this.redBonusCount++;
                this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                break;
        }
    }
}
