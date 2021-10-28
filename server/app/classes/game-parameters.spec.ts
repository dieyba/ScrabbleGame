import { expect } from 'chai';
import { GameParameters } from './game-parameters';
import { Player } from './player';

describe('GameParameters', () => {
    let game: GameParameters;
    beforeEach(async () => {
        game = new GameParameters('dieyba', 60, 0);
    });
    it('should create a game parameters', () => {
        expect(game).to.exist;
    });
    it('should add Player', () => {
        let player = new Player('dieyba', '');
        let player1 = new Player('erika', '');
        let player2 = new Player('Sara', '');
        player.setRoomId(game.gameRoom.idGame);
        game.addPlayer(player);
        expect(game.gameRoom.playersName.length).to.be.equal(1);
        game.addPlayer(player1);
        game.addPlayer(player2);
        expect(game.gameRoom.playersName.length).to.be.equal(2);
    });
    it('should set idGame', () => {
        game.setIdGame(1);
        expect(game.gameRoom.idGame).to.equal(1);
    });
    it('should set playerName in the list', () => {
        game.setPlayerName('dieyba');
        expect(game.gameRoom.playersName.length).to.equal(1);
    });
});
