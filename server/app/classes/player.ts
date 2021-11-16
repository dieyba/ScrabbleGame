import { ScrabbleLetter } from './scrabble-letter';
import { ERROR_NUMBER } from './utilities';

export class Player {
    socketId: string;
    roomId: number;
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean;
    isWinner: boolean;

    constructor(name: string, socketId: string, roomId?: number) {
        this.name = name;
        this.socketId = socketId;
        this.roomId = roomId !== undefined ? roomId : ERROR_NUMBER;
        this.isActive = false;
        this.score = 0;
        this.letters = [];
    }
}
