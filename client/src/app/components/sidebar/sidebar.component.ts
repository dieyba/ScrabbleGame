import { Component } from '@angular/core';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';

const COUNTDOWN_INTERVAL = 60;
const TIMER_INTERVAL = 1000;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    player1: Player;
    player1LetterCount: number;
    player2: Player;
    player2LetterCount: number;
    lettersLeftCount: number = 15; // TODO - get actual value
    countDown: number;
    timer: string;
    timerMs: number = COUNTDOWN_INTERVAL;

    constructor() {
        this.initializePlayers();
        this.startCountdown();
    }

    initializePlayers(/* players: Player[]*/): void {
        /* this.player1 = players[0];
        this.player2 = players[1];*/
        // TODO : Remove tests and use code above
        const firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'a';
        const secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = 'p';
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'u';
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 'm';
        this.player1 = {
            name: 'Ariane',
            score: 73,
            letters: [firstLetter, secondLetter, thirdLetter, fourthLetter],
            isActive: false,
        };

        this.player2 = {
            name: 'Sara',
            score: 70,
            letters: [firstLetter, thirdLetter, firstLetter],
            isActive: true,
        };

        this.getPlayer1LetterCount();
        this.getPlayer2LetterCount();
    }

    getPlayer1LetterCount(): void {
        this.player1LetterCount = this.player1.letters.length;
    }

    getPlayer2LetterCount(): void {
        this.player2LetterCount = this.player2.letters.length;
    }

    startCountdown() {
        this.timer = '1:0';
        setInterval(() => {
            this.timerMs--;
            const time = new Date(this.timerMs);
            const s = time.getSeconds();
            const ms = time.getMilliseconds();
            this.timer = s + ':' + ms;
            if (this.timerMs < 0) {
                this.timerMs = COUNTDOWN_INTERVAL;
                this.timer = '1:0';
            }
        }, TIMER_INTERVAL);
    }
}
