import { RACK_SIZE, ScrabbleRack } from './scrabble-rack';

describe('ScrabbleRack', () => {
    const scrabbleRack = new ScrabbleRack();

    it('should create an instance', () => {
        expect(scrabbleRack).toBeTruthy();
    });

    it('should initialize fill the attribute with seven empty scrabble letters', () => {
        expect(scrabbleRack.letters.length).toEqual(RACK_SIZE);
        for (const letter of scrabbleRack.letters) {
            expect(letter.character).toEqual('');
            expect(letter.value).toEqual(0);
        }
    });
});
