import { Player } from './player';

export enum Difficulty {
    Easy = 'easy',
    Difficult = 'difficult',
}

// TODO: see if we keep it on the client or we just merge local player and player class and that's all the client needs.
// only server neeeds to know vp difficulty if vp service is on the server.
export class VirtualPlayer extends Player {
    type: Difficulty;

    constructor(name: string, type: Difficulty) {
        super(name);
        this.type = type;
    }
}
