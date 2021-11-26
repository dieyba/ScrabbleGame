import { ERROR_NUMBER } from './utilities';

const DOUBLE_DIGIT = 10;
const MINUTE_IN_SEC = 60;
export const UNDEFINED_TIMER = '';

export class GameTimer {
    totalCountDown: number;
    timer: string; // used for the ui
    timerMs: number;
    intervalValue: NodeJS.Timeout;

    constructor() {
        this.totalCountDown = 0;
        this.timerMs = this.totalCountDown;
        this.timer = UNDEFINED_TIMER;
    }
    initializeTotalCountDown(totalCountDown: number) {
        if (totalCountDown > ERROR_NUMBER) {
            this.totalCountDown = totalCountDown;
            this.timerMs = totalCountDown;
            this.secondsToMinutes();
        }
    }
    secondsToMinutes() {
        const s = this.timerMs >= 0 ? Math.floor(this.timerMs / MINUTE_IN_SEC) : 0;
        const ms = this.timerMs >= 0 ? this.timerMs % MINUTE_IN_SEC : 0;
        if (ms < DOUBLE_DIGIT) {
            this.timer = s + ':' + 0 + ms;
        } else {
            this.timer = s + ':' + ms;
        }
    }
}
