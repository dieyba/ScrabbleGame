export class Vec2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number) {
        this.x = 0;
        this.y = 0;
        if (x !== undefined) {
            this.x = x;
        }
        if (y !== undefined) {
            this.y = y;
        }
    }

    clone(vec: Vec2) {
        this.x = vec.x;
        this.y = vec.y;
    }
}
