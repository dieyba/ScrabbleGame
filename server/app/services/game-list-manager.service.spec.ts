/* disable-lint*/
import { GameParameters } from '@app/classes/game-parameters';
import { Player } from '@app/classes/player';
import { expect } from 'chai';
import { GameListManager } from './game-list-manager.service';

describe('GameListManager service', () => {
    let gameListMan: GameListManager;
    const game1 = new GameParameters('dieyba', 60, false, 1);
    const game2 = new GameParameters('kevin', 60, false, 2);
    const game3 = new GameParameters('erika', 0, false, 3);
    const game4 = new GameParameters('Sara', 0, false, 4);
    beforeEach(async () => {
        gameListMan = new GameListManager();
    });
    it('should create playerManagerService', () => {
        expect(gameListMan).to.exist;
        expect(gameListMan.existingRooms.length).to.be.equal(0);
    });
    it('should create add a player', () => {
        gameListMan.addRoom(game3);
        gameListMan.addRoom(game4);
        expect(gameListMan.existingRooms.length).to.be.equal(2);
        gameListMan.getAllGames();
        expect(gameListMan.existingRooms.length).to.be.equal(2);
    });
    it('should create a room', () => {
        gameListMan.createRoom(game3);
        gameListMan.createRoom(game4);
        expect(gameListMan.existingRooms.length).to.be.equal(2);
    });
    it('getGameFromExistingRooms should return the right game with the given id ', () => {
        gameListMan.existingRooms.push(game1);
        gameListMan.existingRooms.push(game2);
        expect(gameListMan.getGameFromExistingRooms(2)).to.equal(game2);
    });
    it('getCurrentGame should return the right game with the given id ', () => {
        gameListMan.currentGames.push(game1);
        gameListMan.currentGames.push(game2);
        expect(gameListMan.getCurrentGame(2)).to.equal(game2);
    });
    it('getOtherPlayer should return the opponent in a room', () => {
        gameListMan.currentGames.push(game1);
        gameListMan.currentGames.push(game2);
        gameListMan.currentGames[0].players[0] = new Player('dieyba', 'bd72eydbey');
        gameListMan.currentGames[0].players[1] = new Player('ariane', 'fbie4737d');
        gameListMan.currentGames[0].players[0].roomId = 1;
        gameListMan.currentGames[0].players[0].roomId = 1;
        expect(gameListMan.getOtherPlayer('bd72eydbey', 1)).to.equal(game1.players[1]);
        expect(gameListMan.getOtherPlayer('fbie4737d', 1)).to.equal(game1.players[0]);
    });
    it('getOtherPlayer should return undefined', () => {
        gameListMan.currentGames.push(game1);
        gameListMan.currentGames.push(game2);
        gameListMan.currentGames[0].players[0] = new Player('dieyba', 'bd72eydbey');
        gameListMan.currentGames[0].players[1] = new Player('ariane', 'fbie4737d');
        gameListMan.currentGames[0].players[0].roomId = 1;
        gameListMan.currentGames[0].players[0].roomId = 1;
        expect(gameListMan.getOtherPlayer('bd72eydbey', -1)).to.equal(undefined);
    });
    it('deleteRoom should remove room', () => {
        gameListMan.existingRooms.push(game1);
        gameListMan.existingRooms.push(game2);
        gameListMan.existingRooms.push(game3);
        gameListMan.existingRooms.push(game4);
        gameListMan.deleteExistingRoom(1);
        expect(gameListMan.existingRooms.length).to.equal(3);
    });
    it('deleteRoom should not remove room', () => {
        gameListMan.existingRooms.push(game1);
        gameListMan.existingRooms.push(game2);
        gameListMan.existingRooms.push(game3);
        gameListMan.existingRooms.push(game4);
        gameListMan.deleteExistingRoom(-1);
        expect(gameListMan.existingRooms.length).to.equal(4);
    });
    // it('should remove a room', () => {
    //     const room1 = new GameParameters('erika', 0, false, 0);
    //     const room2 = new GameParameters('Sara', 0, false, 0);
    //     room1.setIdGame(0);
    //     gameListMan.createRoom(room2.creatorPlayer.name, 0, false);
    //     gameListMan.createRoom(room1.creatorPlayer.name, 0, false);
    //     gameListMan.deleteRoom(0);
    //     expect(gameListMan.existingRooms.length).to.be.equal(1);
    //     expect(gameListMan.existingRooms[0].creatorPlayer.name).to.be.equal('erika');
    //     gameListMan.deleteRoom(-1);
    //     expect(gameListMan.existingRooms.length).to.be.equal(1);
    // });
});
