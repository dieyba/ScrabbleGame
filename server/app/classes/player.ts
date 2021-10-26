import { ScrabbleLetter } from "./scrabble-letter";

export class Player {
    private socketId: string;
    roomId: number;
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True is it is this players turn, false if not.
    isWinner: boolean;

    constructor(name: string, socketId: string) {
        this.name = name;
        this.socketId = socketId;
        this.roomId = -1;
    }

    public getSocketId(): string {
        return this.socketId;
    }
}
