import { Player } from '@app/classes/player';
import { expect } from 'chai';
import { PlayerManagerService } from './player-manager.service';

describe('PlayerManager service', () => {
    let playerManagerService: PlayerManagerService;

    beforeEach(async () => {
        playerManagerService = new PlayerManagerService();
    });
    it('should create playerManagerService', () => {
        expect(playerManagerService).to.exist;
        expect(playerManagerService.allPlayers.length).to.be.equal(0);
    });
    it('should create add a player', () => {
        let player1 = new Player('erika', '');
        let player2 = new Player('Sara', '');
        playerManagerService.addPlayer(player1.name, player1.getSocketId());
        playerManagerService.addPlayer(player2.name, player2.getSocketId());
        expect(playerManagerService.allPlayers.length).to.be.equal(2);
    });
});
