import { ScrabbleLetter } from "./scrabble-letter";

export class Player {
    name: string;
    private socketId: string;
    private roomId: number;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True is it is this players turn, false if not.
    isWinner: boolean;

    constructor(name: string, socketId: string) {
        this.name = name;
        this.socketId = socketId;
        this.roomId = -1;
    }
    public getName(): string {
        return this.name;
    }

    public getSocketId(): string {
        return this.socketId;
    }

    public getRoomId(): number {
        return this.roomId;
    }

    public setRoomId(roomId: number): void {
        this.roomId = roomId;
    }
}
