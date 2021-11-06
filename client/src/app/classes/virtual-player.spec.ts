import { Difficulty, VirtualPlayer } from './virtual-player';

describe('VirtualPlayer', () => {
    const virtualPlayer = new VirtualPlayer('Sara', Difficulty.Difficult);

    it('should create an instance', () => {
        expect(virtualPlayer).toBeTruthy();
    });

    it('should set the right difficulty level', () => {
        expect(virtualPlayer.type).toEqual(Difficulty.Difficult);
    });
});
