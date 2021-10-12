import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';
import { GridService } from './grid.service';
import { Axis } from '@app/classes/utilities';

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
        for (let i = 0; i < scrabbleWord.content.length; i++) {
            // Account for letter pale/dark blue bonuses
            if (scrabbleWord.orientation === Axis.H) {
                if (!this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed) {
                    total += this.calculateValue(
                        scrabbleWord.content[i],
                        this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].color,
                    );
                } else {
                    total += scrabbleWord.content[i].value;
                }
            } else if (scrabbleWord.orientation === Axis.V) {
                if (!this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed) {
                    total += this.calculateValue(
                        scrabbleWord.content[i],
                        this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].color,
                    );
                } else {
                    total += scrabbleWord.content[i].value;
                }
            }
        }
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

    calculateValue(letter: ScrabbleLetter, color: SquareColor): number {
        let total = 0;
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
        return total;
    }

    useBonus(scrabbleWord: ScrabbleWord) {
        for (let i = 0; i < scrabbleWord.content.length; i++) {
            if (scrabbleWord.orientation === Axis.H) {
                if (!this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed) {
                    this.useHorizontalWordBonus(scrabbleWord, i);
                }
            } else if (scrabbleWord.orientation === Axis.V) {
                if (!this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed) {
                    this.useVerticalWordBonus(scrabbleWord, i);
                }
            }
        }
    }

    useHorizontalWordBonus(scrabbleWord: ScrabbleWord, i: number) {
        const color = this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].color;
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
        const color = this.gridService.scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].color;
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
