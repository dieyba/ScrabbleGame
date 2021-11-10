// TODO: see if we want vp service on server or client
// Would make sense on server, but see what are the dependency of vp service and client services.

import { Player } from './player';

export enum Difficulty {
    Easy = 'easy',
    Difficult = 'difficult',
}

export class VirtualPlayer extends Player {
    difficulty: Difficulty;

    constructor(name: string, socketId: string, difficulty: Difficulty) {
        super(name, socketId)
        this.difficulty = difficulty;
    }

}
