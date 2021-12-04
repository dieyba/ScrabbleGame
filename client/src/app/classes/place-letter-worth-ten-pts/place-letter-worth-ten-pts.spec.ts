import { GoalPoints } from '@app/classes/goal/goal';
import { createPlaceLetterWorthTenPts, PlaceLetterWorthTenPts } from '@app/classes/place-letter-worth-ten-pts/place-letter-worth-ten-pts';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';

/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('PlaceLetterWorthTenPts', () => {
    let placeLetterWorthTenPts: PlaceLetterWorthTenPts;

    beforeEach(() => {
        placeLetterWorthTenPts = new PlaceLetterWorthTenPts();
        placeLetterWorthTenPts.isAchieved = false;
    });

    it('should create an instance', () => {
        expect(new PlaceLetterWorthTenPts()).toBeTruthy();
    });

    it('createPlaceLetterWorthTenPts should create an instance', () => {
        expect(createPlaceLetterWorthTenPts()).toBeTruthy();
    });

    it('achieve should return 20 points if one of placed letters value is 10', () => {
        const letter1 = new ScrabbleLetter('z', 10);
        const letter2 = new ScrabbleLetter('e', 1);
        const letter3 = new ScrabbleLetter('n', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter1, letter2];
        expect(placeLetterWorthTenPts.achieve([newWord1], newLetters)).toEqual(GoalPoints.PlaceLetterWorthTenPts);
        expect(placeLetterWorthTenPts.isAchieved).toBeTruthy();
    });

    it('achieve should return 0 points if goals is already achieved', () => {
        const letter1 = new ScrabbleLetter('z', 10);
        const letter2 = new ScrabbleLetter('e', 1);
        const letter3 = new ScrabbleLetter('n', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter1, letter2];
        placeLetterWorthTenPts.isAchieved = true;
        expect(placeLetterWorthTenPts.achieve([newWord1], newLetters)).toEqual(0);
    });

    it('achieve should return 0 points if no placed letter is worth 10 pts', () => {
        const letter1 = new ScrabbleLetter('z', 10);
        const letter2 = new ScrabbleLetter('e', 1);
        const letter3 = new ScrabbleLetter('n', 1);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter2, letter3];
        expect(placeLetterWorthTenPts.achieve([newWord1], newLetters)).toEqual(0);
    });
});
