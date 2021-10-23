import { Injectable } from '@angular/core';
import { MouseHandlerService } from './mouse-handler.service';
import { RackService } from './rack.service';

@Injectable({
    providedIn: 'root',
})
export class ManipulationRackService {
    constructor(private readonly mouseService: MouseHandlerService, private readonly rackService: RackService) {}

    handleSelection(rackContext: CanvasRenderingContext2D) {
        const position = this.mouseService.selectedLetterPosition();

        if (this.rackService.handlingSelected[position - 1] === false) {
            if (this.rackService.exchangeSelected[position - 1] === true) {
                this.rackService.exchangeSelected[position - 1] = false;
            }

            for (let i = 0; i < this.rackService.handlingSelected.length; i++) {
                this.rackService.deselect(i + 1, rackContext, false);
            }
            this.rackService.select(position, rackContext, false);
        }
    }
}
