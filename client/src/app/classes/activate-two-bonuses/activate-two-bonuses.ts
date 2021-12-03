import { Goal, GoalDescriptions, GoalPoints, GoalType } from '@app/classes/goal/goal';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { SquareColor } from '@app/classes/square/square';

const MIN_AMOUNT_BONUS_USED = 2;

export class ActivateTwoBonuses extends Goal {
    constructor() {
        super();
        this.type = GoalType.ActivateTwoBonuses;
        this.description = GoalDescriptions.ActivateTwoBonuses;
    }

    achieve(wordsFormed: ScrabbleWord[]) {
        if (this.isAchieved) {
            return 0;
        }
        const wordPlaced = wordsFormed[0];
        let newBonusUsedCounter = 0;
        for (const scrabbleLetter of wordPlaced.content) {
            if (scrabbleLetter.tile.color !== SquareColor.None && scrabbleLetter.tile.isBonusUsed) {
                newBonusUsedCounter++;
            }
        }
        if (newBonusUsedCounter >= MIN_AMOUNT_BONUS_USED) {
            this.isAchieved = true;
            return GoalPoints.ActivateTwoBonuses;
        }
        return 0;
    }
}

export const createActivateTwoBonuses = (): ActivateTwoBonuses => {
    return new ActivateTwoBonuses();
};
