import { ActivateTwoBonuses, createActivateTwoBonuses } from '@app/classes/activate-two-bonuses/activate-two-bonuses';
import { GoalPoints } from '@app/classes/goal/goal';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Square, SquareColor } from '@app/classes/square/square';

describe('ActivateTwoBonuses', () => {
    let activateTwoBonuses: ActivateTwoBonuses;

    beforeEach(() => {
        activateTwoBonuses = new ActivateTwoBonuses();
        activateTwoBonuses.isAchieved = false;
    });

    it('should create an instance', () => {
        expect(new ActivateTwoBonuses()).toBeTruthy();
    });

    it('createActivateTwoBonuses should create an instance', () => {
        expect(createActivateTwoBonuses()).toBeTruthy();
    });

    it('achieve should return 30 points when placed letters activate 2 bonuses', () => {
        const letter1 = new ScrabbleLetter('z', 1);
        letter1.tile = new Square(0, 0);
        letter1.tile.color = SquareColor.DarkBlue;
        letter1.tile.isBonusUsed = true;
        const letter2 = new ScrabbleLetter('e', 1);
        letter2.tile = new Square(0, 1);
        letter2.tile.color = SquareColor.Pink;
        letter2.tile.isBonusUsed = true;
        const letter3 = new ScrabbleLetter('n', 1);
        letter3.tile = new Square(0, 2);
        letter3.tile.color = SquareColor.None;
        letter3.tile.isBonusUsed = true;
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter1, letter2];
        expect(activateTwoBonuses.achieve([newWord1], newLetters)).toEqual(GoalPoints.ActivateTwoBonuses);
    });

    it('achieve should return 0 points when placed letters activate 1 bonus', () => {
        const letter1 = new ScrabbleLetter('z', 1);
        letter1.tile = new Square(0, 0);
        letter1.tile.color = SquareColor.DarkBlue;
        letter1.tile.isBonusUsed = true;
        const letter2 = new ScrabbleLetter('e', 1);
        letter2.tile = new Square(0, 1);
        letter2.tile.color = SquareColor.None;
        letter2.tile.isBonusUsed = true;
        const letter3 = new ScrabbleLetter('n', 1);
        letter3.tile = new Square(0, 2);
        letter3.tile.color = SquareColor.None;
        letter3.tile.isBonusUsed = true;
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter1, letter2];
        expect(activateTwoBonuses.achieve([newWord1], newLetters)).toEqual(0);
    });

    it('achieve should return 0 points when goals is already achieved', () => {
        const letter1 = new ScrabbleLetter('z', 1);
        letter1.tile = new Square(0, 0);
        letter1.tile.color = SquareColor.DarkBlue;
        letter1.tile.isBonusUsed = true;
        const letter2 = new ScrabbleLetter('e', 1);
        letter2.tile = new Square(0, 1);
        letter2.tile.color = SquareColor.Pink;
        letter2.tile.isBonusUsed = true;
        const letter3 = new ScrabbleLetter('n', 1);
        letter3.tile = new Square(0, 2);
        letter3.tile.color = SquareColor.None;
        letter3.tile.isBonusUsed = true;
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter1, letter2];
        activateTwoBonuses.isAchieved = true;
        expect(activateTwoBonuses.achieve([newWord1], newLetters)).toEqual(0);
    });
});

