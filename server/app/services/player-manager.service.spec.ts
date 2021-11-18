import { Player } from '@app/classes/player';
import { expect } from 'chai';
import { PlayerManagerService } from './player-manager.service';

describe('PlayerManager service', () => {
    let playerManagerService: PlayerManagerService;

    beforeEach(async () => {
        playerManagerService = new PlayerManagerService();
    });
    it('should create playerManagerService', () => {
        /* eslint-disable @typescript-eslint/no-unused-expressions*/
        /* eslint-disable  no-unused-expressions */
        expect(playerManagerService).to.exist;
        expect(playerManagerService.allPlayers.length).to.be.equal(0);
    });
    it('should create add a player', () => {
        const player1 = new Player('erika', '');
        const player2 = new Player('Sara', '');
        playerManagerService.addPlayer(player1.name, player1.socketId);
        playerManagerService.addPlayer(player2.name, player2.socketId);
        expect(playerManagerService.allPlayers.length).to.be.equal(2);
    });
    it('getPlayerBySocketID should get the right socketId of a player', () => {
        const player1 = new Player('erika', 'jbf63q3hed');
        const player2 = new Player('Sara', 'fjc8e8r7');
        playerManagerService.allPlayers.push(player2);
        playerManagerService.allPlayers.push(player1);
        expect(playerManagerService.getPlayerBySocketID('jbf63q3hed')).to.be.equal(player1);
    });
    it(' getPlayerBySocketID should return undefined', () => {
        const player1 = new Player('erika', 'jbf63q3hed');
        const player2 = new Player('Sara', 'fjc8e8r7');
        playerManagerService.allPlayers.push(player2);
        playerManagerService.allPlayers.push(player1);
        expect(playerManagerService.getPlayerBySocketID('ifjeir8339')).to.be.equal(undefined);
    });
});
