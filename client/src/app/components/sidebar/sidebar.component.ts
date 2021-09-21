import { Component } from '@angular/core';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';

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

    constructor() {
        this.initializePlayers();
    }

    initializePlayers(/*players: Player[]*/): void {
        /*this.player1 = players[0];
        this.player2 = players[1];*/
        let firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'a';
        let secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = 'p';
        let thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'u';
        let fourthLetter: ScrabbleLetter = new ScrabbleLetter();
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
}
