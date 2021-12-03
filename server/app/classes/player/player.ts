import { GoalType } from '@app/classes/game-parameters/game-parameters';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ERROR_NUMBER } from '@app/classes/utilities/utilities';

export class Player {
    socketId: string;
    roomId: number;
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean;
    isWinner: boolean;
    goal: GoalType;

    constructor(name: string, socketId: string, roomId?: number) {
        this.name = name;
        this.socketId = socketId;
        this.roomId = roomId !== undefined ? roomId : ERROR_NUMBER;
        this.isActive = false;
        this.score = 0;
        this.letters = [];
    }
    // to be used when leaving a room (after abandon or quit). Only the socket id should remain
    resetPlayer() {
        this.name = '';
        this.roomId = ERROR_NUMBER;
        this.isActive = false;
        this.score = 0;
        this.letters = [];
    }
}
