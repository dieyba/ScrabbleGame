import { Player } from '@app/classes/player/player';
import { ERROR_NUMBER } from '@app/classes/utilities/utilities';
import { Service } from 'typedi';

@Service()
export class PlayerManagerService {
    allPlayers: Player[];
    constructor() {
        this.allPlayers = [];
    }

    getPlayerBySocketID(socketId: string): Player | undefined {
        const playerArrayIndex = this.allPlayers.findIndex((p) => p.socketId === socketId);
        if (playerArrayIndex !== ERROR_NUMBER) {
            return this.allPlayers[playerArrayIndex];
        }
        return undefined;
    }

    addPlayer(socketId: string, playerName?: string): Player | undefined {
        let newPlayer = this.getPlayerBySocketID(socketId);
        if (newPlayer === undefined) {
            const name = playerName !== undefined ? playerName : '';
            newPlayer = new Player(name, socketId);
            this.allPlayers.push(newPlayer);
        }
        return newPlayer;
    }

    removePlayer(socketId: string) {
        const playerArrayIndex = this.allPlayers.findIndex((p) => p.socketId === socketId);
        if (playerArrayIndex !== ERROR_NUMBER) {
            this.allPlayers.splice(playerArrayIndex, 1);
        }
    }
}
