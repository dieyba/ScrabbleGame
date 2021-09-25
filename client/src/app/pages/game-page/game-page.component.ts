import { Component } from '@angular/core';
import { Player } from '../../classes/player';
import { LetterStock } from '../../classes/letter-stock';
import { RackService } from '../../services/rack.service'

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(easel: RackService) {
        this.playerEasel = easel;
    };

    player: Player = new Player();
    virtualPlayer: Player = new Player();
    stock: LetterStock = new LetterStock();
    playerEasel: RackService;

    chooseFirstPlayer(): void {
        let choice: number = Math.random();
        if (choice < 0.5) {
            this.player.isActive = true;
        }
        else {
            this.virtualPlayer.isActive = true;
        }
    }

    distributeLetters(): void {

        this.player.letters = this.stock.takeLettersFromStock(7);

        for (let i: number = 0; i < this.player.letters.length; i++) {
            this.player.letters[i].square.position.x = i;
            this.playerEasel.drawLetter(this.player.letters[i]);
        }

        this.virtualPlayer.letters = this.stock.takeLettersFromStock(7);

    }

}