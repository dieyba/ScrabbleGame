import { Player } from '@app/classes/player';
import { Service } from 'typedi';

@Service()
export class PlayerManagerService {
    allPlayers: Player[];
    constructor() {
        this.allPlayers = [];
    }
    public addPlayer(playerName: string, socketId: string): Player {
        let newPlayer = new Player(playerName, socketId);
        this.allPlayers.push(newPlayer);
        return newPlayer;
    }

    public getPlayerBySocketID(socketId: string): Player{
        const playerArrayIndex = this.allPlayers.findIndex((p) => p.getSocketId() === socketId);
        return this.allPlayers[playerArrayIndex];
    }
}
