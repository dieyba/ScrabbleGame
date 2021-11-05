import { expect } from 'chai';
import { GameParameters } from './game-parameters';
import { Player } from './player';

describe('GameParameters', () => {
    let game = new GameParameters('dieyba', 60, false, 0);;
    // game = new GameParameters('dieyba', 60, false, 0);
    // beforeEach(async () => {
    //     game = new GameParameters('dieyba', 60, false, 0);
    // });
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
