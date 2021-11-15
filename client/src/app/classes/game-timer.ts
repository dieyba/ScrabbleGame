import { BehaviorSubject, Observable } from "rxjs";
import { ERROR_NUMBER } from "./utilities";

const TIMER_INTERVAL = 1000;
const DOUBLE_DIGIT = 10;
const MINUTE_IN_SEC = 60;
export const UNDEFINED_TIMER = '';

export class GameTimer {
    isTimerEndObservable: Observable<boolean>;
    isTimerEndSubject: BehaviorSubject<boolean>;
    timer: string; // used for the ui
    timerMs: number;
    intervalValue: NodeJS.Timeout;
    private totalCountDown: number;
    private isTimerEnd: boolean;

    constructor() {
        this.totalCountDown = 0;
        this.timerMs = this.totalCountDown;
        this.timer = UNDEFINED_TIMER;
        this.isTimerEndSubject = new BehaviorSubject<boolean>(this.isTimerEnd);
        this.isTimerEndObservable = this.isTimerEndSubject.asObservable();
    }

    initializeTotalCountDown(totalCountDown: number) {
        if (totalCountDown > ERROR_NUMBER) {
            this.totalCountDown = totalCountDown;
            this.timerMs = totalCountDown;
            this.secondsToMinutes();
        }
    }
    // TODO: or check if is end game in the turn manager service
    resetTimer(isEndGame: boolean) {
        this.timerMs = +this.totalCountDown;
        this.secondsToMinutes();
        clearInterval(this.intervalValue);
        this.startCountdown(isEndGame);
    }
    secondsToMinutes() {
        const s = Math.floor(this.timerMs / MINUTE_IN_SEC);
        const ms = this.timerMs % MINUTE_IN_SEC;
        if (ms < DOUBLE_DIGIT) {
            this.timer = s + ':' + 0 + ms;
        } else {
            this.timer = s + ':' + ms;
        }
    }
    startCountdown(isEndGame: boolean) {
        this.isTimerEnd = false;
        if (!isEndGame) {
            this.secondsToMinutes();
            this.intervalValue = setInterval(() => {
                this.timerMs--;
                if (this.timerMs < 0) {
                    this.timerMs = 0;
                    this.isTimerEnd = true;
                    this.isTimerEndSubject.next(this.isTimerEnd);
                }
                this.secondsToMinutes();
            }, TIMER_INTERVAL);
        }
    }
}
