import { Square, SquareColor } from '@app/classes/square';

describe('Square', () => {

    const square = new Square(0, 0);

    it('should create an instance', () => {
        expect(square).toBeTruthy();
    });

    it('getColor should return the color of the square', () => {
        const color = SquareColor.None;
        expect(square.getColor()).toEqual(color);
    });
});