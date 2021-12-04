import {
    createFormWordWithLettersFromName,
    FormWordWithLettersFromName,
} from '@app/classes/form-word-with-letters-from-name/form-word-with-letters-from-name';
import { GoalPoints } from '@app/classes/goal/goal';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';

describe('FormWordWithLettersFromName', () => {
    let formWordWithLettersFromName: FormWordWithLettersFromName;

    beforeEach(() => {
        formWordWithLettersFromName = new FormWordWithLettersFromName();
        formWordWithLettersFromName.isAchieved = false;
    });

    it('should create an instance', () => {
        expect(new FormWordWithLettersFromName()).toBeTruthy();
    });

    it('createFormWordWithLettersFromName should create an instance', () => {
        expect(createFormWordWithLettersFromName()).toBeTruthy();
    });

    it('achieve should return 30 points when word formed contains 3 letters from name', () => {
        const name = 'ariane';
        const letter1 = new ScrabbleLetter('a', 1);
        const letter2 = new ScrabbleLetter('i', 1);
        const letter3 = new ScrabbleLetter('m', 1);
        const letter4 = new ScrabbleLetter('t', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3, letter1, letter2, letter4]; // aimait
        const newlyPlacedLetters = [letter1, letter2, letter1, letter2, letter4];
        expect(formWordWithLettersFromName.achieve([newWord1], newlyPlacedLetters, name)).toEqual(GoalPoints.FormWordWithLettersFromName);
        expect(formWordWithLettersFromName.isAchieved).toBeTruthy();
    });

    it('achieve should return 0 points when word formed contains 2 letters from name', () => {
        const name = 'ariane';
        const letter1 = new ScrabbleLetter('a', 1);
        const letter2 = new ScrabbleLetter('i', 1);
        const letter3 = new ScrabbleLetter('m', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter3, letter2]; // ami
        const newlyPlacedLetters = [letter1, letter2, letter3];
        expect(formWordWithLettersFromName.achieve([newWord1], newlyPlacedLetters, name)).toEqual(0);
    });

    it('achieve should return 0 points when goals is already achieved', () => {
        const name = 'ariane';
        const letter1 = new ScrabbleLetter('a', 1);
        const letter2 = new ScrabbleLetter('i', 1);
        const letter3 = new ScrabbleLetter('m', 1);
        const letter4 = new ScrabbleLetter('t', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3, letter1, letter2, letter4]; // aimait
        const newlyPlacedLetters = [letter1, letter2, letter1, letter2, letter4];
        formWordWithLettersFromName.isAchieved = true;
        expect(formWordWithLettersFromName.achieve([newWord1], newlyPlacedLetters, name)).toEqual(0);
    });
});
