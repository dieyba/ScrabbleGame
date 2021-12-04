import { expect } from 'chai';
import { Player } from './player';
describe('Player', () => {
    const player = new Player('DIEYBA', '');
    it('should create a player', () => {
        expect(player).to.not.equals(undefined);
    });

    it('should reset a player info', () => {
        player.resetPlayer()
        expect(player.name).to.equals('');
        expect(player.roomId).to.equals(-1);
        expect(player.isActive).to.equals(false);
        expect(player.score).to.equals(0);
        expect(player.letters.length).to.equals(0);




    });
});
