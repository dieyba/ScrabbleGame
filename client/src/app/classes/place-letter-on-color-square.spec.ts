import { GoalPoints } from './goal';
import { createPlaceLetterOnColorSquare, PlaceLetterOnColorSquare } from './place-letter-on-color-square';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';
import { SquareColor } from './square';

describe('PlaceLetterOnColorSquare', () => {
    let placeLetterOnColorSquare: PlaceLetterOnColorSquare;
    let letterColor: ScrabbleLetter;

    beforeEach(() => {
        placeLetterOnColorSquare = new PlaceLetterOnColorSquare();
        placeLetterOnColorSquare.isAchieved = false;
        letterColor = new ScrabbleLetter('a', 1);
        letterColor.color = SquareColor.Red;
        placeLetterOnColorSquare.initialize(letterColor);
    });

    it('should create an instance', () => {
        expect(new PlaceLetterOnColorSquare()).toBeTruthy();
    });

    it('createPlaceLetterOnColorSquare should create an instance', () => {
        expect(createPlaceLetterOnColorSquare()).toBeTruthy();
    });

    it('initialize should set target color and letter (red)', () => {
        expect(placeLetterOnColorSquare.targetLetter).toEqual('a');
        expect(placeLetterOnColorSquare.targetColor).toEqual(SquareColor.Red);
    });

    it('initialize should set target color and letter (pink)', () => {
        const letterColor = new ScrabbleLetter('a', 1);
        letterColor.color = SquareColor.Pink;
        placeLetterOnColorSquare.initialize(letterColor);
        expect(placeLetterOnColorSquare.targetLetter).toEqual('a');
        expect(placeLetterOnColorSquare.targetColor).toEqual(SquareColor.Pink);
    });

    it('initialize should set target color and letter (teal))', () => {
        const letterColor = new ScrabbleLetter('a', 1);
        letterColor.color = SquareColor.Teal;
        placeLetterOnColorSquare.initialize(letterColor);
        expect(placeLetterOnColorSquare.targetLetter).toEqual('a');
        expect(placeLetterOnColorSquare.targetColor).toEqual(SquareColor.Teal);
    });

    it('initialize should set target color and letter (dark blue)', () => {
        const letterColor = new ScrabbleLetter('a', 1);
        letterColor.color = SquareColor.DarkBlue;
        placeLetterOnColorSquare.initialize(letterColor);
        expect(placeLetterOnColorSquare.targetLetter).toEqual('a');
        expect(placeLetterOnColorSquare.targetColor).toEqual(SquareColor.DarkBlue);
    });

    it('initialize should set target color and letter (none)', () => {
        const letterColor = new ScrabbleLetter('a', 1);
        letterColor.color = SquareColor.None;
        placeLetterOnColorSquare.initialize(letterColor);
        expect(placeLetterOnColorSquare.targetLetter).toEqual('a');
        expect(placeLetterOnColorSquare.targetColor).toEqual(SquareColor.None);
    });

    it('achieve should return 50 points when newLetters has right letter', () => {
        const letter2 = new ScrabbleLetter('m', 1);
        letter2.color = SquareColor.None;
        const letter3 = new ScrabbleLetter('i', 1);
        letter3.color = SquareColor.Pink;
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letterColor, letter2, letter3];
        const newLetters = [letterColor, letter2];
        expect(placeLetterOnColorSquare.achieve([newWord1], newLetters)).toEqual(GoalPoints.PlaceLetterOnColorSquare);
        expect(placeLetterOnColorSquare.isAchieved).toBeTruthy();
    });

    it('achieve should return 0 point when no newLetter is right letter and color', () => {
        const letter2 = new ScrabbleLetter('m', 1);
        letter2.color = SquareColor.None;
        const letter3 = new ScrabbleLetter('i', 1);
        letter3.color = SquareColor.Pink;
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letterColor, letter2, letter3];
        const newLetters = [letter2, letter3];
        expect(placeLetterOnColorSquare.achieve([newWord1], newLetters)).toEqual(0);
    });

    it('achieve should return 0 points when goals is already achieved', () => {
        const letter2 = new ScrabbleLetter('m', 1);
        letter2.color = SquareColor.None;
        const letter3 = new ScrabbleLetter('i', 1);
        letter3.color = SquareColor.Pink;
        const newWord1 = new ScrabbleWord();
        newWord1.content = [letterColor, letter2, letter3];
        const newLetters = [letterColor, letter2];
        placeLetterOnColorSquare.isAchieved = true;
        expect(placeLetterOnColorSquare.achieve([newWord1], newLetters)).toEqual(0);
    });
});
