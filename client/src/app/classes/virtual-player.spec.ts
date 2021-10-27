import { Difficulty, VirtualPlayer } from './virtual-player';

describe('VirtualPlayer', () => {
    it('should create an instance', () => {
        expect(new VirtualPlayer('Sara', Difficulty.Difficult)).toBeTruthy();
    });
});
