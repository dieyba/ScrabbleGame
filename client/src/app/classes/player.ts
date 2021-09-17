import { Time } from '@angular/common';

export class Player {
    private name: string;
    private nameValid: boolean;
    private timer: Time;
    private bonus: boolean;
    constructor() {
        this.name = '';
        this.nameValid = false;
        this.timer= 00:00;
        this.bonus = false;
    }
    getName(): string {
        return this.name;
    }

    getNameValid(): boolean {
        return this.nameValid;
    }
    setName(name: string): void {
        this.name = name;
    }

    setNameValid(nameValid: boolean): void {
        this.nameValid = nameValid;
    }
    getTimer(): Time {
        return this.timer;
    }
    setTimer(time: Time): void {
        this.timer = time;
    }
}
