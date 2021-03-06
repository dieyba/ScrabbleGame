import { expect } from 'chai';
import { Vec2 } from './vec2';

/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
describe('Vec2', () => {
    it('should create an instance', () => {
        expect(new Vec2()).to.exist;
    });

    it('clone should set vec', () => {
        const vec = new Vec2();
        const vec2 = new Vec2(2, 2);
        vec.clone(vec2);
        expect(vec.x).to.equal(2);
        expect(vec.y).to.equal(2);
    });
});
