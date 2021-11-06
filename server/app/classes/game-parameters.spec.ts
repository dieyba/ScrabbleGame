import { expect } from 'chai';
import { GameParameters } from './game-parameters';
import { Player } from './player';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-unused-expressions */
describe('GameParameters', () => {
    const game = new GameParameters('dieyba', 60, false, 0);
    it('should create a game parameters', () => {
        expect(game).to.exist;
    });
    it('should add Player', () => {
        const player = new Player('dieyba', '');
        const player1 = new Player('erika', '');
        const player2 = new Player('Sara', '');
        player.roomId = game.gameRoom.idGame;
        game.addPlayer(player);
        expect(game.gameRoom.playersName.length).to.be.equal(1);
        game.addPlayer(player1);
        game.addPlayer(player2);
        expect(game.gameRoom.playersName.length).to.be.equal(2);
    });
});
