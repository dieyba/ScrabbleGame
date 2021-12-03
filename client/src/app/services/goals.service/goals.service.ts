import { Injectable } from '@angular/core';
import { createActivateTwoBonuses } from '@app/classes/activate-two-bonuses/activate-two-bonuses';
import { createFormAnExistingWord } from '@app/classes/form-an-existing-word/form-an-existing-word';
import { createFormThreeWords } from '@app/classes/form-three-words/form-three-words';
import { createFormTwoLettersStarsOnly } from '@app/classes/form-two-letters-stars-only/form-two-letters-stars-only';
import { createFormWordWithLettersFromName } from '@app/classes/form-word-with-letters-from-name/form-word-with-letters-from-name';
import { Goal, GoalType } from '@app/classes/goal/goal';
import { createPlaceLetterOnBoardCorner } from '@app/classes/place-letter-on-board-corner/place-letter-on-board-corner';
import { createPlaceLetterOnColorSquare } from '@app/classes/place-letter-on-color-square/place-letter-on-color-square';
import { createPlaceLetterWorthTenPts } from '@app/classes/place-letter-worth-ten-pts/place-letter-worth-ten-pts';
import { Player } from '@app/classes/player/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { TOTAL_COLORS } from '@app/classes/square/square';
import * as SocketHandler from '@app/modules/socket-handler';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

const PUBLIC_GOALS_COUNT = 2;
const TOTAL_GOALS_COUNT = 8;
type GoalCreationFunction = () => InstanceType<typeof Goal>;

@Injectable({
    providedIn: 'root',
})
export class GoalsService {
    goalsCreationMap: Map<GoalType, GoalCreationFunction>;
    sharedGoals: Goal[];
    privateGoals: Goal[];
    private socket: io.Socket;
    private readonly server: string;

    constructor() {
        this.server = environment.socketUrl;
        this.socket = SocketHandler.requestSocket(this.server);
        this.goalsCreationMap = new Map();
        this.initialize();
        this.socket.on('goal achieved', (goalAchieved: GoalType) => {
            this.getGoalByType(goalAchieved).isAchieved = true;
            // console.log('opponent new goal achieved:', this.getGoalByType(goalAchieved).constructor.name);
        });
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
        const newSharedGoals: GoalType[] = [];
        for (let i = 0; newSharedGoals.length < PUBLIC_GOALS_COUNT; i++) {
            const randomGoal = Math.floor(Math.random() * TOTAL_GOALS_COUNT);
            if (!usedGoals.includes(randomGoal)) {
                newSharedGoals.push(randomGoal);
                usedGoals.push(randomGoal);
            }
        }
        return newSharedGoals;
    }

    pickPrivateGoals(usedGoals: GoalType[], players: Player[]) {
        players.forEach((player) => {
            do {
                const randomGoal = Math.floor(Math.random() * TOTAL_GOALS_COUNT);
                if (!usedGoals.includes(randomGoal)) {
                    player.goal = randomGoal;
                    usedGoals.push(randomGoal);
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
        const allGoals = this.sharedGoals.concat(this.privateGoals);
        const alreadyAchievedGoals = allGoals.filter((goal: Goal) => {
            return goal.isAchieved;
        });
        // Check if a new goal was achieved and return the corresponding points
        this.sharedGoals.forEach((goal) => {
            pointsMade += goal.achieve(wordsFormed, newlyPlacedLetters, activePlayer.name);
        });
        const privateGoal = this.getGoalOfAPlayer(activePlayer);
        if (privateGoal !== undefined) {
            pointsMade += privateGoal.achieve(wordsFormed, newlyPlacedLetters, activePlayer.name);
        }
        // Synchronize the new goals achieved for multiplayer mode
        allGoals.forEach((goal) => {
            if (!alreadyAchievedGoals.includes(goal) && goal.isAchieved) {
                this.socket.emit('achieve goal', goal.type);
                // console.log('new goal achieved:', goal.constructor.name);
            }
        });

        return pointsMade;
    }

    getGoalOfAPlayer(activePlayer: Player): Goal {
        const activePlayerGoalId = this.privateGoals.findIndex((goal: Goal) => {
            return goal.type === activePlayer.goal;
        });
        return this.privateGoals[activePlayerGoalId];
    }

    getGoalByType(goalType: GoalType) {
        const allGoals = this.sharedGoals.concat(this.privateGoals);
        const goalId = allGoals.findIndex((goal: Goal) => {
            return goal.type === goalType;
        });
        return allGoals[goalId];
    }
}
