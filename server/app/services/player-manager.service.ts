import { Player } from '@app/classes/player';
import { Service } from 'typedi';

@Service()
export class PlayerManagerService {
    allPlayers: Player[];
    constructor() {
        this.allPlayers = [];
    }
    addPlayer(playerName: string, socketId: string): Player {
        const newPlayer = new Player(playerName, socketId);
        this.allPlayers.push(newPlayer);
        return newPlayer;
    }

    getPlayerBySocketID(socketId: string): Player | undefined {
        const playerArrayIndex = this.allPlayers.findIndex((p) => p.socketId === socketId);
        if (playerArrayIndex > -1) {
            return this.allPlayers[playerArrayIndex];
        }
        return undefined;
    }
}
