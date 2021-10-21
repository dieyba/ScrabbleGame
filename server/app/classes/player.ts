export class Player {
    private name: string;
    private socketId: string;
    private roomId: number;

    constructor(name: string /*socketId: string*/) {
        this.name = name;
        // this.socketId = socketId;
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
