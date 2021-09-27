import { LocalPlayer } from './local-player';

describe('LocalPlayer', () => {
    it('should create an instance', () => {
        expect(new LocalPlayer('Etienne')).toBeTruthy();
    });
});
