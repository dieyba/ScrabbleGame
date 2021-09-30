import { ScrabbleLetter } from './scrabble-letter';

describe('ScrabbleLetter', () => {
    it('should create an instance', () => {
        expect(new ScrabbleLetter('a', 1)).toBeTruthy();
    });

    it('tealBonus should mutliply the value by 2', () => {
        const letter = new ScrabbleLetter('a', 1);
        letter.tealBonus();
        expect(letter.value).toEqual(2);
    });

    it('darkBlueBonus should mutliply the value by 3', () => {
        const letter = new ScrabbleLetter('a', 1);
        letter.darkBlueBonus();
        expect(letter.value).toEqual(3);
    });
});
