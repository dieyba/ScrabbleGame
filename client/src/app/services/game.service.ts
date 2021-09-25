import { Injectable } from '@angular/core';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { GridService } from './grid.service';
import { RackService } from './rack.service';

const COUNTDOWN_INTERVAL = 60;
const TIMER_INTERVAL = 1000;

@Injectable({
    providedIn: 'root',
})
export class GameService {
    players: Player[];
    countDown: number;
    timer: string;
    timerMs: number = COUNTDOWN_INTERVAL;

    constructor(public gridService: GridService, public rackService: RackService) {
        // TODO : Remove tests and call initializePlayers in another class
        const firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'a';
        const secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = 'p';
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'u';
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 'm';
        let player1: Player = {
            name: 'Ariane',
            score: 73,
            letters: [firstLetter, secondLetter, thirdLetter, fourthLetter],
            isActive: false,
        };

        let player2: Player = {
            name: 'Sara',
            score: 70,
            letters: [firstLetter, thirdLetter, firstLetter],
            isActive: true,
        };
        this.createNewGame();
        this.initializePlayers([player1, player2]);
    }

    createNewGame() {
      this.rackService.clearRack();
      this.gridService.clearBoard();
      this.startCountdown();
    }

    initializePlayers(players: Player[]): void {
        this.players = [];
        this.players[0] = players[0];
        this.players[1] = players[1];

        this.startCountdown();
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
                this.changeActivePlayer();
            }
        }, TIMER_INTERVAL);
    }

    changeActivePlayer() {
        if (this.players[0].isActive === true) {
            this.players[0].isActive = false;
            this.players[1].isActive = true;
        } else {
            this.players[1].isActive = false;
            this.players[0].isActive = true;
        }
    }
}
