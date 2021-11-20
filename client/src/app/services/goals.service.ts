import { Injectable } from '@angular/core';
import { createActivateTwoBonuses } from '@app/classes/activate-two-bonuses';
import { createFormAnExistingWord } from '@app/classes/form-an-existing-word';
import { createFormThreeWords } from '@app/classes/form-three-words';
import { createFormTwoLettersStarsOnly } from '@app/classes/form-two-letters-stars-only';
import { createFormWordWithLettersFromName } from '@app/classes/form-word-with-letters-from-name';
import { Goal, GoalType } from '@app/classes/goal';
import { createPlaceLetterOnBoardCorner } from '@app/classes/place-letter-on-board-corner';
import { createPlaceLetterOnColorSquare } from '@app/classes/place-letter-on-color-square';
import { createPlaceLetterWorthTenPts } from '@app/classes/place-letter-worth-ten-pts';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { TOTAL_COLORS } from '@app/classes/square';

const PUBLIC_GOALS_COUNT = 2;
const TOTAL_GOALS_COUNT = 8;
@Injectable({
	providedIn: 'root',
})
export class GoalsService {
	goalsCreationMap: Map<GoalType, Function>; // eslint-disable-line @typescript-eslint/ban-types
	sharedGoals: Goal[];
	privateGoals: Goal[];

	constructor() {
		this.goalsCreationMap = new Map();
		this.initialize();
	}

	initialize() {
		this.sharedGoals = new Array<Goal>();
		this.privateGoals = new Array<Goal>();
		this.goalsCreationMap.set(GoalType.ActivateTwoBonuses, createActivateTwoBonuses);
		this.goalsCreationMap.set(GoalType.FormAnExistingWord, createFormAnExistingWord);
		this.goalsCreationMap.set(GoalType.FormThreeWords, createFormThreeWords);
		this.goalsCreationMap.set(GoalType.FormTwoLettersStarsOnly, createFormTwoLettersStarsOnly);
		this.goalsCreationMap.set(GoalType.FormWordWithLettersFromName, createFormWordWithLettersFromName);
		this.goalsCreationMap.set(GoalType.PlaceLetterOnBoardCorner, createPlaceLetterOnBoardCorner);
		this.goalsCreationMap.set(GoalType.PlaceLetterOnColorSquare, createPlaceLetterOnColorSquare);
		this.goalsCreationMap.set(GoalType.PlaceLetterWorthTenPts, createPlaceLetterWorthTenPts);
	}

	pickSharedGoals(usedGoals: GoalType[]) {
		let newSharedGoals: GoalType[] = [];
		for (let i = 0; newSharedGoals.length < PUBLIC_GOALS_COUNT; i++) {
			const randomGoal = Math.floor(Math.random() * TOTAL_GOALS_COUNT);
			if (!newSharedGoals.includes(randomGoal)) {
				newSharedGoals.push(randomGoal);
				usedGoals.push(randomGoal);
			}
		}
		return newSharedGoals;
	}

	pickPrivateGoals(usedGoals: GoalType[], players: Player[]) {
		players.forEach(player => {
			do {
				const randomGoal = Math.floor(Math.random() * TOTAL_GOALS_COUNT);
				if (!usedGoals.includes(randomGoal)) {
					player.goal = randomGoal;
					usedGoals.push(randomGoal)
				}
			} while (player.goal === undefined);
		});
	}

	pickRandomLetterAndColor(lettersLeftInStock: ScrabbleLetter[]) {
		let letterAndcolor = new ScrabbleLetter('');
		// Set random letter and random color
		const randomLetterIndex = Math.floor(Math.random() * lettersLeftInStock.length);
		letterAndcolor = lettersLeftInStock[randomLetterIndex];
		let randomColorIndex = 0;
		do {
			randomColorIndex = Math.floor(Math.random() * TOTAL_COLORS);
		} while (randomColorIndex === 0);
		letterAndcolor.color = randomColorIndex;
		return letterAndcolor;
	}

	addSharedGoal(goalType: GoalType) {
		const createGoalFunction = this.goalsCreationMap.get(goalType);
		if (createGoalFunction !== undefined) {
			this.sharedGoals.push(createGoalFunction.call(this));
			this.goalsCreationMap.delete(goalType);
		}
	}
	addPrivateGoal(goalType: GoalType) {
		const createGoalFunction = this.goalsCreationMap.get(goalType);
		if (createGoalFunction !== undefined) {
			this.privateGoals.push(createGoalFunction.call(this));
			this.goalsCreationMap.delete(goalType);
		}
	}

	achieveGoals(activePlayer: Player, wordsFormed: ScrabbleWord[], newlyPlacedLetters: ScrabbleLetter[]) {
		let pointsMade = 0;
		// Checks if goals were achieved this turn
		this.sharedGoals.forEach((goal) => {
			pointsMade += goal.achieve(wordsFormed, newlyPlacedLetters);
		});
		const privateGoal = this.getGoalOfAPlayer(activePlayer)
		if (privateGoal !== undefined) {
			pointsMade += privateGoal.achieve(wordsFormed, newlyPlacedLetters);
		}
		// TODO: see with UI if we want to remove the goals that are achieved or leave them
		// Remove goals achieved this turn
		// this.sharedGoals = this.sharedGoals.filter((goal: Goal) => {
		// 	return !goal.isAchieved;
		// });
		// this.privateGoals = this.privateGoals.filter((goal: Goal) => {
		// 	return !goal.isAchieved;
		// });
		return pointsMade;
	}

	getGoalOfAPlayer(activePlayer: Player) {
		const activePlayerGoalId = this.privateGoals.findIndex((goal: Goal) => {
			if (activePlayer.goal === undefined || goal.type === undefined) {
				return false;
			}
			return goal.type === activePlayer.goal
		});
		return this.privateGoals[activePlayerGoalId];
	}

	getGoalByType(goalType: GoalType) {
		const allGoals = this.sharedGoals.concat(this.privateGoals);
		let goalId = allGoals.findIndex((goal: Goal) => {
			if (goal.type === undefined) {
				return false;
			}
			return goal.type === goalType
		});
		return allGoals[goalId];
	}
}
