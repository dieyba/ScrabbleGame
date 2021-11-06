import { Square } from './square';

describe('Square', () => {
    let square = new Square(5, 3);
    it('should create an instance', () => {
        expect(square).toBeTruthy();
    });

    it('should the attributes with the parameters', () => {
        expect(square.position.x).toEqual(5);
        expect(square.position.y).toEqual(3);
    });
});
