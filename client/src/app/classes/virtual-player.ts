import { Player } from './player';

export enum PlayerType {
    Easy = 'easy',
    Difficult = 'difficult',
}

export class VirtualPlayer extends Player {
    type: PlayerType;

    constructor(name: string, type: PlayerType) {
        super(name);
        this.type = type;
    }

    playTurn() {
        // What do we do with this?
    }
}
