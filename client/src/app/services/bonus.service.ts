import { Injectable } from '@angular/core';
import { DARK_BLUE_FACTOR, PALE_BLUE_FACTOR, ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';
import { Axis, ERROR_NUMBER } from '@app/classes/utilities';
import { GridService } from './grid.service';

const PINK_FACTOR = 2;
const RED_FACTOR = 3;

@Injectable({
    providedIn: 'root',
})
export class BonusService {
    pinkBonusCount: number;
    redBonusCount: number;

    constructor(private readonly gridService: GridService) {
        this.pinkBonusCount = 0;
        this.redBonusCount = 0;
    }

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
            } else {
                total = ERROR_NUMBER;
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
        let newLetter = new ScrabbleLetter(letter.character);
        newLetter = letter;
        letter = newLetter;
        let total = 0;
        switch (color) {
            case SquareColor.Teal:
                total += this.getTealBonus(letter);
                break;
            case SquareColor.DarkBlue:
                total += this.getDarkBlueBonus(letter);
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

    getTealBonus(scrabbleLetter: ScrabbleLetter): number {
        return PALE_BLUE_FACTOR * scrabbleLetter.value;
    }

    getDarkBlueBonus(scrabbleLetter: ScrabbleLetter): number {
        return DARK_BLUE_FACTOR * scrabbleLetter.value;
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
