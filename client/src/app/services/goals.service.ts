import { Injectable } from '@angular/core';
import { Goal, Goals } from '@app/classes/goal';
import { createPlaceLetterWorthTenPts } from '@app/classes/place-letter-worth-ten-pts';
import { Player } from '@app/classes/player';
import { ScrabbleWord } from '@app/classes/scrabble-word';

@Injectable({
    providedIn: 'root',
})
export class GoalsService {
    goalsCreationMap: Map<Goals, Function>; // eslint-disable-line @typescript-eslint/ban-types
    goals: Goal[];

    constructor() {
        this.goals = new Array<Goal>();
        this.goalsCreationMap = new Map();
        this.goalsCreationMap.set(Goals.PlaceLetterWorthTenPts, createPlaceLetterWorthTenPts);
    }
    executeGoals(activePlayer: Player, wordsFormed: ScrabbleWord[]): number {
        let pointsMade = 0;
        this.goals.forEach((goal) => {
            if (goal.players.includes(activePlayer)) {
                pointsMade += goal.execute(wordsFormed);
            }
        });
        this.goals = this.goals.filter((goal: Goal) => {
            return !goal.isExecuted;
        });
        return pointsMade;
    }
}
