// TODO: to delete and just use non abstract player and vp extend player (like in server)

import { Player } from './player';

export class LocalPlayer extends Player {
    roomId: number;
}
