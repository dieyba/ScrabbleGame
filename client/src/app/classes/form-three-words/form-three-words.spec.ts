import { createFormThreeWords, FormThreeWords } from '@app/classes/form-three-words/form-three-words';
import { GoalPoints } from '@app/classes/goal/goal';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';

describe('FormThreeWords', () => {
    let formThreeWords: FormThreeWords;

    beforeEach(() => {
        formThreeWords = new FormThreeWords();
        formThreeWords.isAchieved = false;
    });

    it('should create an instance', () => {
        expect(new FormThreeWords()).toBeTruthy();
    });

    it('achieve should return 50 points when three words are formed', () => {
        const letter1 = new ScrabbleLetter('m', 1);
        const letter2 = new ScrabbleLetter('i', 1);
        const letter3 = new ScrabbleLetter('s', 1);
        const letter4 = new ScrabbleLetter('a', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter4]; // ma
        const newWord2 = new ScrabbleWord();
        newWord2.content = [letter3, letter4]; // sa
        const newWord3 = new ScrabbleWord();
        newWord3.content = [letter3, letter2]; // si
        expect(formThreeWords.achieve([newWord1, newWord2, newWord3])).toEqual(GoalPoints.FormThreeWords);
        expect(formThreeWords.isAchieved).toBeTruthy();
    });

    it('achieve should return 0 points when two words are formed', () => {
        const letter1 = new ScrabbleLetter('m', 1);
        const letter3 = new ScrabbleLetter('s', 1);
        const letter4 = new ScrabbleLetter('a', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter4]; // ma
        const newWord2 = new ScrabbleWord();
        newWord2.content = [letter3, letter4]; // sa
        expect(formThreeWords.achieve([newWord1, newWord2])).toEqual(0);
    });

    it('achieve should return 0 points when goal is already achieved', () => {
        const letter1 = new ScrabbleLetter('m', 1);
        const letter2 = new ScrabbleLetter('i', 1);
        const letter3 = new ScrabbleLetter('s', 1);
        const letter4 = new ScrabbleLetter('a', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter4]; // ma
        const newWord2 = new ScrabbleWord();
        newWord2.content = [letter3, letter4]; // sa
        const newWord3 = new ScrabbleWord();
        newWord3.content = [letter3, letter2]; // si
        formThreeWords.isAchieved = true;
        expect(formThreeWords.achieve([newWord1, newWord2, newWord3])).toEqual(0);
    });

    it('createFormThreeWords should create an instance', () => {
        expect(createFormThreeWords()).toBeTruthy();
    });
});

