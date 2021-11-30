import { ERROR_NUMBER } from '@app/classes/utilities/utilities';
import { GameTimer } from './game-timer';

const ONE_MINUTE = 60;
const THIRTY_SECONDS = 30;

describe('GameTimer', () => {
    let gameTimer: GameTimer;
    beforeEach(() => {
        gameTimer = new GameTimer();
    });

    it('should create an instance', () => {
        expect(gameTimer).toBeTruthy();
    });
    it('should not initialize timer', () => {
        gameTimer.initializeTotalCountDown(ERROR_NUMBER);
        expect(gameTimer.totalCountDown).toEqual(0);
        expect(gameTimer.timer).toEqual('');
    });
    it('should initialize timers to total countdown value', () => {
        gameTimer.initializeTotalCountDown(ONE_MINUTE);
        expect(gameTimer.totalCountDown).toEqual(ONE_MINUTE);
        expect(gameTimer.timer).toEqual('1:00');
    });
    it('should set the minutes timer to the right time', () => {
        gameTimer.timerMs = ONE_MINUTE + THIRTY_SECONDS;
        gameTimer.secondsToMinutes();
        expect(gameTimer.timer).toEqual('1:30');
    });
    it('should time of 0 instead of a negative time', () => {
        gameTimer.timerMs = -33333;
        gameTimer.secondsToMinutes();
        expect(gameTimer.timer).toEqual('0:00');
    });
});
