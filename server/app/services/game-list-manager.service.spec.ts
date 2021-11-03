import { GameParameters } from '@app/classes/game-parameters';
import { expect } from 'chai';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { GameListManager } from './game-list-manager.service';
import { ValidationService } from './validation.service';

describe('GameListManager service', () => {
    let gameListMan: GameListManager;
    let validationServiceStub: SinonStubbedInstance<ValidationService>;
    beforeEach(async () => {
        validationServiceStub = createStubInstance(ValidationService);
        validationServiceStub.validateWords.resolves(true);
        gameListMan = new GameListManager(validationServiceStub);
    });
    it('should create playerManagerService', () => {
        expect(gameListMan).to.exist;
        expect(gameListMan.existingRooms.length).to.be.equal(0);
    });
    it('should create add a player', () => {
        const room1 = new GameParameters('erika', 0, false, 0);
        const room2 = new GameParameters('Sara', 0, false, 0);
        gameListMan.addRoom(room2.creatorPlayer.name, 0, false);
        gameListMan.addRoom(room1.creatorPlayer.name, 0, false);
        expect(gameListMan.existingRooms.length).to.be.equal(2);
        gameListMan.getAllGames();
        expect(gameListMan.existingRooms.length).to.be.equal(2);
    });
    it('should create a room', () => {
        const room1 = new GameParameters('erika', 0, false, 0);
        const room2 = new GameParameters('Sara', 0, false, 0);
        gameListMan.createRoom(room2.creatorPlayer.name, 0, false);
        gameListMan.createRoom(room1.creatorPlayer.name, 0, false);
        expect(gameListMan.existingRooms.length).to.be.equal(2);
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
