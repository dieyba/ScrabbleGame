import { Injectable } from '@angular/core';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeService {
    constructor(private readonly rackService: RackService, private readonly soloGameService: SoloGameService) {}

    handleSelection(position: number) {
        // s'il faut désélectionner la lettre de manip quand celle de échanger
        // est sélectionnée, ce sera comme ça
        for (let i = 0; i < this.rackService.handlingSelected.length; i++) {
            if (this.rackService.handlingSelected[i] === true) {
                this.rackService.deselect(i + 1, this.rackService.gridContext, false);
            }
        }

        if (this.rackService.handlingSelected[position - 1] === true) {
            this.rackService.handlingSelected[position - 1] = false;
        }

        if (this.rackService.exchangeSelected[position - 1] === true) {
            this.rackService.deselect(position, this.rackService.gridContext, true);
        } else {
            this.rackService.select(position, this.rackService.gridContext, true);
        }
    }

    exchange() {
        this.soloGameService.exchangeLettersSelected(this.soloGameService.localPlayer);
    }

    cancelExchange() {
        for (let i = 1; i <= this.soloGameService.localPlayer.letters.length; i++) {
            this.rackService.deselect(i, this.rackService.gridContext, true);
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
