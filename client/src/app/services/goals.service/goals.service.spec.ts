/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { ActivateTwoBonuses } from '@app/classes/activate-two-bonuses/activate-two-bonuses';
import { GoalPoints, GoalType } from '@app/classes/goal/goal';
import { LetterStock } from '@app/classes/letter-stock/letter-stock';
import { Player } from '@app/classes/player/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { SquareColor } from '@app/classes/square/square';
import { GoalsService } from './goals.service';

describe('GoalsService', () => {
    let service: GoalsService;
    const stock: LetterStock = new LetterStock();

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GoalsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('pickSharedGoals should return a goals that has not already been picked', () => {
        const sharedGoals = service.pickSharedGoals([GoalType.FormThreeWords]);
        expect(sharedGoals[0]).not.toEqual(GoalType.FormThreeWords);
        expect(sharedGoals[2]).not.toEqual(GoalType.FormThreeWords);
    });

    it('pickPrivateGoals should set players goal and increase usedGoal by 1', () => {
        const player1 = new Player('Ariane');
        const player2 = new Player('Kevin');
        const usedGoals = [GoalType.FormThreeWords];
        service.pickPrivateGoals(usedGoals, [player1, player2]);
        expect(usedGoals.length).toEqual(3);
        expect(player1.goal).not.toEqual(GoalType.FormThreeWords);
        expect(player2.goal).not.toEqual(GoalType.FormThreeWords);
    });

    it('pickRandomLetterAndColor should return any scrabble letter with any color but None', () => {
        expect(service.pickRandomLetterAndColor(stock.letterStock).color).not.toEqual(SquareColor.None);
    });

    it('addSharedGoals should increase sharedGoals length', () => {
        service.addSharedGoal(GoalType.ActivateTwoBonuses);
        expect(service.sharedGoals.length).toEqual(1);
        expect(service.goalsCreationMap.size).toEqual(7);
    });

    it('addPrivateGoal should increase sharedGoals length', () => {
        service.addPrivateGoal(GoalType.ActivateTwoBonuses);
        expect(service.privateGoals.length).toEqual(1);
        expect(service.goalsCreationMap.size).toEqual(7);
    });

    it('achieveGoals should return points made by goals achieved', () => {
        service.addPrivateGoal(GoalType.ActivateTwoBonuses);
        service.addSharedGoal(GoalType.FormWordWithLettersFromName);
        const player = new Player('zenn');
        player.goal = GoalType.ActivateTwoBonuses;
        const letter1 = new ScrabbleLetter('z', 10);
        const letter2 = new ScrabbleLetter('e', 1);
        const letter3 = new ScrabbleLetter('n', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter1, letter2];
        expect(service.achieveGoals(player, [newWord1], newLetters)).toEqual(GoalPoints.FormWordWithLettersFromName);
    });

    it('getGoalOfAPlayer should return undefined if goal index does not exist', () => {
        service.addPrivateGoal(GoalType.ActivateTwoBonuses);
        const player = new Player('zenn');
        expect(service.getGoalOfAPlayer(player)).not.toBeDefined();
    });

    it('getGoalByType should return right goal', () => {
        service.addSharedGoal(GoalType.FormWordWithLettersFromName);
        service.addSharedGoal(GoalType.ActivateTwoBonuses);
        expect(service.getGoalByType(GoalType.ActivateTwoBonuses)).toEqual(new ActivateTwoBonuses());
    });

    it('getGoalByType should return undefined if goal index does not exist', () => {
        service.addSharedGoal(GoalType.FormWordWithLettersFromName);
        expect(service.getGoalByType(undefined as unknown as GoalType)).not.toBeDefined();
    });
});
