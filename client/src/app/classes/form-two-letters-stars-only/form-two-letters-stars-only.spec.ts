import { GoalPoints } from '@app/classes/goal/goal';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { createFormTwoLettersStarsOnly, FormTwoLettersStarsOnly } from '@app/classes/form-two-letters-stars-only/form-two-letters-stars-only';


describe('FormTwoLettersStarsOnly', () => {
    let formTwoLettersStarsOnly: FormTwoLettersStarsOnly;

    beforeEach(() => {
        formTwoLettersStarsOnly = new FormTwoLettersStarsOnly();
        formTwoLettersStarsOnly.isAchieved = false;
    });

    it('should create an instance', () => {
        expect(new FormTwoLettersStarsOnly()).toBeTruthy();
    });

    it('achieve should return 20 points when newWord is **', () => {
        const letter1 = new ScrabbleLetter('*', 1);
        const letter2 = new ScrabbleLetter('*', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2];
        expect(formTwoLettersStarsOnly.achieve([newWord1])).toEqual(GoalPoints.FormTwoLettersStarsOnly);
        expect(formTwoLettersStarsOnly.isAchieved).toBeTruthy();
    });

    it('achieve should return 0 points when goals is already achieved', () => {
        const letter1 = new ScrabbleLetter('*', 1);
        const letter2 = new ScrabbleLetter('*', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2];
        formTwoLettersStarsOnly.isAchieved = true;
        expect(formTwoLettersStarsOnly.achieve([newWord1])).toEqual(0);
        expect(formTwoLettersStarsOnly.isAchieved).toBeTruthy();
    });

    it('achieve should return 0 points when word is not **', () => {
        const letter1 = new ScrabbleLetter('*', 1);
        const letter2 = new ScrabbleLetter('a', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2];
        expect(formTwoLettersStarsOnly.achieve([newWord1])).toEqual(0);
        expect(formTwoLettersStarsOnly.isAchieved).not.toBeTruthy();
    });

    it('createFormTwoLettersStarsOnly should create an instance', () => {
        expect(createFormTwoLettersStarsOnly()).toBeTruthy();
    });
});

