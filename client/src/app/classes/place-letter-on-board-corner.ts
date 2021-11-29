import { Goal, GoalDescriptions, GoalPoints, GoalType } from './goal';
import { Column, Row } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';
import { Vec2 } from './vec2';

export class PlaceLetterOnBoardCorner extends Goal {
    targetCoordinates: Vec2[];

    constructor() {
        super();
        this.targetCoordinates = [
            new Vec2(Row.A, Column.One),
            new Vec2(Row.A, Column.Fifteen),
            new Vec2(Row.O, Column.One),
            new Vec2(Row.O, Column.Fifteen),
        ];
        this.type = GoalType.PlaceLetterOnBoardCorner;
        this.description = GoalDescriptions.PlaceLetterOnBoardCorner;
    }
    achieve(wordsFormed: ScrabbleWord[], newlyPlacedLetters: ScrabbleLetter[]) {
        if (this.isAchieved) {
            return 0;
        }
        const wordPlaced = wordsFormed[0];
        for (const scrabbleLetter of wordPlaced.content) {
            const isInCorner = this.targetCoordinates.includes(scrabbleLetter.tile.position);
            const isNewlyPlacedLetter = newlyPlacedLetters.includes(scrabbleLetter);
            if (isInCorner && isNewlyPlacedLetter) {
                this.isAchieved = true;
                return GoalPoints.PlaceLetterOnBoardCorner;
            }
        }
        return 0;
    }
}

export const createPlaceLetterOnBoardCorner = (): PlaceLetterOnBoardCorner => {
    return new PlaceLetterOnBoardCorner();
};
