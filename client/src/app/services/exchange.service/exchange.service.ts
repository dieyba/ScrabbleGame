import { Injectable } from '@angular/core';
import { DefaultCommandParams } from '@app/classes/commands/commands';
import { ExchangeCmd } from '@app/classes/exchange-command/exchange-command';
import { CommandInvokerService } from '@app/services/command-invoker.service/command-invoker.service';
import { GameService } from '@app/services/game.service/game.service';
import { RackService } from '@app/services/rack.service/rack.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeService {
    constructor(
        private readonly rackService: RackService,
        private readonly gameService: GameService,
        private commandInvokerService: CommandInvokerService,
    ) {}

    handleSelection(position: number) {
        if (this.rackService.handlingSelected[position - 1]) {
            this.rackService.handlingSelected[position - 1] = false;
        }
        for (let i = 0; i < this.rackService.handlingSelected.length; i++) {
            if (this.rackService.handlingSelected[i]) {
                this.rackService.deselect(i + 1, this.rackService.gridContext, false);
            }
        }

        if (this.rackService.exchangeSelected[position - 1]) {
            this.rackService.deselect(position, this.rackService.gridContext, true);
        } else {
            this.rackService.select(position, this.rackService.gridContext, true);
        }
    }

    exchange() {
        const defaultParams: DefaultCommandParams = { player: this.gameService.game.getLocalPlayer(), serviceCalled: this.gameService };
        const letters = this.gameService.getLettersSelected();
        const command = new ExchangeCmd(defaultParams, letters);
        this.commandInvokerService.executeCommand(command);
    }

    cancelExchange() {
        for (let i = 1; i <= this.gameService.game.getLocalPlayer().letters.length; i++) {
            this.rackService.deselect(i, this.rackService.gridContext, true);
        }
    }

    atLeastOneLetterSelected(): boolean {
        for (const selected of this.rackService.exchangeSelected) {
            if (selected) {
                return true;
            }
        }
        return false;
    }
}
