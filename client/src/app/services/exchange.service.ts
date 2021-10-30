import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { RackService } from './rack.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeService {
    constructor(private readonly rackService: RackService, private readonly gameService: GameService) {}

    handleSelection(rackContext: CanvasRenderingContext2D, position: number) {
        if (this.rackService.handlingSelected[position - 1] === true) {
            this.rackService.handlingSelected[position - 1] = false;
        }

        // s'il faut désélectionner la lettre de manip quand celle de échanger
        // est sélectionnée, ce sera comme ça
        for (let i = 0; i < this.rackService.handlingSelected.length; i++) {
            if (this.rackService.handlingSelected[i] === true) {
                this.rackService.deselect(i + 1, rackContext, false);
            }
        }

        if (this.rackService.exchangeSelected[position - 1] === true) {
            this.rackService.deselect(position, rackContext, true);
        } else {
            this.rackService.select(position, rackContext, true);
        }
    }

    exchange() {
        this.gameService.currentGameService.exchangeLettersSelected(this.gameService.currentGameService.localPlayer);
    }

    cancelExchange(rackContext: CanvasRenderingContext2D) {
        for (let i = 1; i <= this.gameService.currentGameService.localPlayer.letters.length; i++) {
            this.rackService.deselect(i, rackContext, true);
        }
    }

    atLeastOneLetterSelected(): boolean {
        for (const selected of this.rackService.exchangeSelected) {
            if (selected === true) {
                return true;
            }
        }
        return false;
    }
}
