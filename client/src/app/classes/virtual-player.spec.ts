import { PlayerType, VirtualPlayer } from './virtual-player';

describe('VirtualPlayer', () => {
    it('should create an instance', () => {
        expect(new VirtualPlayer('Sara', PlayerType.Difficult)).toBeTruthy();
    });
});
