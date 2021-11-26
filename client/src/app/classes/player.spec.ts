import { calculateRackPoints, Player, removePlayerLetters } from '@app/classes/player';
import { ScrabbleLetter } from './scrabble-letter';

describe('Player', () => {
    let player: Player;
    beforeEach(() => {
        player = new Player('Sara');
        player.letters = [
            new ScrabbleLetter('a', 1),
            new ScrabbleLetter('b', 1),
            new ScrabbleLetter('a', 1),
            new ScrabbleLetter('a', 1)
        ];
    });

    it('should remove the given letters', () => {
        const result = removePlayerLetters('aa', player);
        expect(result).toBeTruthy();
        expect(player.letters).toEqual([
            new ScrabbleLetter('b', 1),
            new ScrabbleLetter('a', 1),
        ]);
    });

    it('should return false if the letter to remove is not  in the rack', () => {
        expect(removePlayerLetters('c', player)).toBeFalse();
        expect(player.letters).toEqual([
            new ScrabbleLetter('a', 1),
            new ScrabbleLetter('b', 1),
            new ScrabbleLetter('a', 1),
            new ScrabbleLetter('a', 1)
        ]);
    });

    it('should calculate rack points', () => {
        expect(calculateRackPoints(player)).toEqual(4);
    });
    it('should calculate no rack points', () => {
        player.letters = [];
        expect(calculateRackPoints(player)).toEqual(0);
    });
});
