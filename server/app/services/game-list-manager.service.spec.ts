import { GameParameters } from '@app/classes/game-parameters';
import { expect } from 'chai';
import { GameListManager } from './game-list-manager.service';

describe('GameListManager service', () => {
    let gameListMan: GameListManager;
    beforeEach(async () => {
        gameListMan = new GameListManager();
    });
    it('should create playerManagerService', () => {
        expect(gameListMan).to.exist;
        expect(gameListMan.existingRooms.length).to.be.equal(0);
    });
    it('should create add a player', () => {
        let room1 = new GameParameters('erika', 0, 0);
        let room2 = new GameParameters('Sara', 0, 0);
        gameListMan.addRoom(room2.creatorPlayer.name, 0);
        gameListMan.addRoom(room1.creatorPlayer.name, 0);
        expect(gameListMan.existingRooms.length).to.be.equal(2);
        gameListMan.getAllGames();
        expect(gameListMan.existingRooms.length).to.be.equal(2);
    });
    it('should create a room', () => {
        let room1 = new GameParameters('erika', 0, 0);
        let room2 = new GameParameters('Sara', 0, 0);
        gameListMan.createRoom(room2.creatorPlayer.name, 0);
        gameListMan.createRoom(room1.creatorPlayer.name, 0);
        expect(gameListMan.existingRooms.length).to.be.equal(2);
    });
    it('should remove a room', () => {
        let room1 = new GameParameters('erika', 0, 0);
        let room2 = new GameParameters('Sara', 0, 0);
        room1.setIdGame;
        gameListMan.createRoom(room2.creatorPlayer.name, 0);
        gameListMan.createRoom(room1.creatorPlayer.name, 0);
        gameListMan.deleteRoom(0);
        expect(gameListMan.existingRooms.length).to.be.equal(1);
        expect(gameListMan.existingRooms[0].creatorPlayer.name).to.be.equal('erika');
        gameListMan.deleteRoom(-1);
        expect(gameListMan.existingRooms.length).to.be.equal(1);
    });
});
