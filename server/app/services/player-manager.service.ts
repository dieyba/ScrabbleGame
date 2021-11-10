import { Player } from '@app/classes/player';
import { ERROR_NUMBER } from '@app/classes/utilities';
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

    addPlayer(playerName: string, socketId: string): Player {
        const newPlayer = new Player(playerName, socketId);
        this.allPlayers.push(newPlayer);
        return newPlayer;
    }

    // // TODO: do we need a remove player method too?
    // removePlayer(socketId: string) {
    //     const playerArrayIndex = this.allPlayers.findIndex((p) => p.socketId === socketId);
    //     if (playerArrayIndex !== ERROR_NUMBER) {
    //         this.allPlayers.splice(playerArrayIndex, 1);
    //     }
    // }

}
