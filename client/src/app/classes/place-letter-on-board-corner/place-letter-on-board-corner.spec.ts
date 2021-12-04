import { GoalPoints } from '@app/classes/goal/goal';
import { createPlaceLetterOnBoardCorner, PlaceLetterOnBoardCorner } from '@app/classes/place-letter-on-board-corner/place-letter-on-board-corner';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Square } from '@app/classes/square/square';

describe('PlaceLetterOnBoardCorner', () => {
    let placeLetterOnBoardCorner: PlaceLetterOnBoardCorner;

    beforeEach(() => {
        placeLetterOnBoardCorner = new PlaceLetterOnBoardCorner();
        placeLetterOnBoardCorner.isAchieved = false;
    });

    it('should create an instance', () => {
        expect(new PlaceLetterOnBoardCorner()).toBeTruthy();
    });

    it('createPlaceLetterOnBoardCorner should create an instance', () => {
        expect(createPlaceLetterOnBoardCorner()).toBeTruthy();
    });

    it('achieve should return 30 points when letter is on corner square', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.tile = new Square(0, 0);
        const letter2 = new ScrabbleLetter('m', 1);
        letter2.tile = new Square(0, 1);
        const letter3 = new ScrabbleLetter('i', 1);
        letter3.tile = new Square(0, 2);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter1, letter2];
        expect(placeLetterOnBoardCorner.achieve([newWord1], newLetters)).toEqual(GoalPoints.PlaceLetterOnBoardCorner);
        expect(placeLetterOnBoardCorner.isAchieved).toBeTruthy();
    });

    it('achieve should return 0 points when letter is on corner square but not new', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.tile = new Square(0, 0);
        const letter2 = new ScrabbleLetter('m', 1);
        letter2.tile = new Square(0, 1);
        const letter3 = new ScrabbleLetter('i', 1);
        letter3.tile = new Square(0, 2);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter2, letter3];
        expect(placeLetterOnBoardCorner.achieve([newWord1], newLetters)).toEqual(0);
    });

    it('achieve should return 0 points when goals is already achieved', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.tile = new Square(0, 0);
        const letter2 = new ScrabbleLetter('m', 1);
        letter2.tile = new Square(0, 1);
        const letter3 = new ScrabbleLetter('i', 1);
        letter3.tile = new Square(0, 2);
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letter1, letter2, letter3];
        const newLetters = [letter1, letter2];
        placeLetterOnBoardCorner.isAchieved = true;
        expect(placeLetterOnBoardCorner.achieve([newWord1], newLetters)).toEqual(0);
    });
});

