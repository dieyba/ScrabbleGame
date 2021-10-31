import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';
import { Axis } from '@app/classes/utilities';
import { Service } from 'typedi';

const PINK_FACTOR = 2;
const RED_FACTOR = 3;

@Service()
export class BonusService {
    pinkBonusCount: number;
    redBonusCount: number;

    constructor() {
        this.pinkBonusCount = 0;
        this.redBonusCount = 0;
    }

    totalValue(scrabbleWord: ScrabbleWord, scrabbleBoard: ScrabbleBoard): number {
        this.pinkBonusCount = 0;
        this.redBonusCount = 0;
        let total = 0;
        for (let i = 0; i < scrabbleWord.content.length; i++) {
            // Account for letter pale/dark blue bonuses
            if (scrabbleWord.orientation === Axis.H) {
                if (!scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed) {
                    total += this.calculateValue(
                        scrabbleWord.content[i],
                        scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].color,
                    );
                } else {
                    total += scrabbleWord.content[i].value;
                }
            } else if (scrabbleWord.orientation === Axis.V) {
                if (!scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed) {
                    total += this.calculateValue(
                        scrabbleWord.content[i],
                        scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].color,
                    );
                } else {
                    total += scrabbleWord.content[i].value;
                }
            } else {
                total += scrabbleWord.content[i].value; // For purposes of testing, when we don't need an orientation.
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

    useBonus(scrabbleWord: ScrabbleWord, scrabbleBoard: ScrabbleBoard) {
        for (let i = 0; i < scrabbleWord.content.length; i++) {
            if (scrabbleWord.orientation === Axis.H) {
                if (!scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed) {
                    this.useHorizontalWordBonus(scrabbleWord, scrabbleBoard, i);
                }
            } else if (scrabbleWord.orientation === Axis.V) {
                if (!scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed) {
                    this.useVerticalWordBonus(scrabbleWord, scrabbleBoard, i);
                }
            }
        }
    }

    useHorizontalWordBonus(scrabbleWord: ScrabbleWord, scrabbleBoard: ScrabbleBoard, i: number) {
        const color = scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].color;
        switch (color) {
            case SquareColor.Teal:
                scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                break;
            case SquareColor.DarkBlue:
                scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                break;
            case SquareColor.Pink:
                this.pinkBonusCount++;
                scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                break;
            case SquareColor.Red:
                this.redBonusCount++;
                scrabbleBoard.squares[scrabbleWord.startPosition.x + i][scrabbleWord.startPosition.y].isBonusUsed = true;
                break;
        }
    }

    useVerticalWordBonus(scrabbleWord: ScrabbleWord, scrabbleBoard: ScrabbleBoard, i: number) {
        const color = scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].color;
        switch (color) {
            case SquareColor.Teal:
                scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                break;
            case SquareColor.DarkBlue:
                scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                break;
            case SquareColor.Pink:
                this.pinkBonusCount++;
                scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                break;
            case SquareColor.Red:
                this.redBonusCount++;
                scrabbleBoard.squares[scrabbleWord.startPosition.x][scrabbleWord.startPosition.y + i].isBonusUsed = true;
                break;
        }
    }
}
