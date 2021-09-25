import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    player1Name: string;
    player2Name: string;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    lettersLeftCount: number = 15; // TODO - get actual value

    constructor(public gameService: GameService, public rackService: RackService, public gridService: GridService) {
        this.player1Name = this.gameService.players[0].name;
        this.player2Name = this.gameService.players[1].name;
    }

    getPlayer1LetterCount(): number {
        return this.gameService.players[0].letters.length;
    }

    getPlayer2LetterCount(): number {
        return this.gameService.players[1].letters.length;
    }

    getPlayer1Score(): number {
        return this.gameService.players[0].score;
    }

    getPlayer2Score(): number {
        return this.gameService.players[1].score;
    }

    getTimer(): string {
        return this.gameService.timer;
    }

    isPlayer1Active(): boolean {
        return this.gameService.players[0].isActive;
    }

    isPlayer2Active(): boolean {
        return this.gameService.players[1].isActive;
    }
}
