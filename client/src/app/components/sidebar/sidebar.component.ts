import { Component } from '@angular/core';
import { SoloGameService } from '@app/services/solo-game.service';
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

    constructor(public sologameService: SoloGameService, public rackService: RackService, public gridService: GridService) {
        this.player1Name = this.sologameService.localPlayer.name;
        this.player2Name = this.sologameService.virtualPlayer.name;
    }

    getPlayer1LetterCount(): number {
        return this.sologameService.localPlayer.letters.length;
    }

    getPlayer2LetterCount(): number {
        return this.sologameService.virtualPlayer.letters.length;
    }

    getPlayer1Score(): number {
        return this.sologameService.localPlayer.score;
    }

    getPlayer2Score(): number {
        return this.sologameService.virtualPlayer.score;
    }

    getTimer(): string {
        return this.sologameService.timer;
    }

    isPlayer1Active(): boolean {
        return this.sologameService.localPlayer.isActive;
    }

    isPlayer2Active(): boolean {
        return this.sologameService.virtualPlayer.isActive;
    }
}
