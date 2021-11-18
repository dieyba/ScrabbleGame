import { Goal, GoalDescriptions, GoalPoints } from './goal';
import { Player } from './player';
import { ScrabbleWord } from './scrabble-word';

const GOAL_LETTER_VALUE = 10;

export class PlaceLetterWorthTenPts extends Goal {
    constructor(players: Player[]) {
        super();
        this.players = players;
        this.description = GoalDescriptions.PlaceLetterWorthTenPts;
    }
    execute(wordsFormed: ScrabbleWord[]) {
        if (this.isExecuted) {
            return 0;
        }
        const wordPlaced = wordsFormed[0];
        for (const letter of wordPlaced.content) {
            if (letter.value === GOAL_LETTER_VALUE) {
                this.isExecuted = true;
                return GoalPoints.PlaceLetterWorthTenPts;
            }
        }
        return 0;
    }
}

export const createPlaceLetterWorthTenPts = (players: Player[]): PlaceLetterWorthTenPts => {
    return new PlaceLetterWorthTenPts(players);
};
