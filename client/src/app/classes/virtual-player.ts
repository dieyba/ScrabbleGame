import { Player } from './player';

export enum Difficulty {
    Easy = 'easy',
    Difficult = 'difficult',
}

export class VirtualPlayer extends Player {
    type: Difficulty;

    constructor(name: string, type: Difficulty) {
        super(name);
        this.type = type;
    }

    playTurn() {
        // What do we do with this?
    }
}
