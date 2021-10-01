import { Player } from '@app/classes/player';
import { ScrabbleLetter } from './scrabble-letter';

describe('Player', () => {

    class PlayerTest extends Player {};

    it('method addLetter should add the given letter', () => {
        let player: PlayerTest = new PlayerTest('Sara');
        let letter: ScrabbleLetter = new ScrabbleLetter('a', 1);

        expect(player.letters).toEqual([]);

        player.addLetter(letter);

        expect(player.letters).toEqual([letter]);
    });

    it('method removeLetter should remove the given letters', () => {
        let player: PlayerTest = new PlayerTest('Sara');
        player.letters = [new ScrabbleLetter('a', 1)];
        let isRemove: boolean = player.removeLetter('a');

        expect(isRemove).toBeTruthy();
        expect(player.letters).toEqual([]);
    });

    it('method removeLetter should return false if the letter to remove is not  in the rack', () => {
        let player: PlayerTest = new PlayerTest('Sara');
        player.letters = [new ScrabbleLetter('a', 1)];
        let isRemove: boolean = player.removeLetter('b');

        expect(isRemove).toBeFalse();
    });
});
