import { Player } from './player';

export enum Difficulty {
    Easy = 'easy',
    Difficult = 'difficult',
}
export class VirtualPlayer extends Player {
    type: Difficulty;

    constructor(name: string, difficulty?: Difficulty) {
        super(name)
        this.type = difficulty !== undefined ? difficulty : Difficulty.Easy; // by default, the difficulty is easy
    }
}
