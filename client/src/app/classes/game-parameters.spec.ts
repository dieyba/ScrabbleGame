import { GameParameters } from './game-parameters';

describe('GameParameters', () => {
    let gameParameters = new GameParameters('Bob', 60, false);

    it('should create an instance', () => {
        expect(gameParameters).toBeTruthy();
    });

    it('should set the attributes with the given parameters', () => {
        expect(gameParameters.creatorPlayer.name).toEqual('Bob');
        expect(gameParameters.totalCountDown).toEqual(60);
        expect(gameParameters.randomBonus).toBeFalse();
    });
});