import { Injectable } from '@angular/core';
import { MouseHandlerService } from './mouse-handler.service';
import { RackService } from './rack.service';

const ERROR_NUMBER = -1;

@Injectable({
    providedIn: 'root',
})
export class ManipulationRackService {
    private letterSelectedPosition = ERROR_NUMBER;

    constructor(private readonly mouseService: MouseHandlerService, private readonly rackService: RackService) {}

    handleSelection(rackContext: CanvasRenderingContext2D) {
        const position = this.mouseService.selectedLetterPosition();

        if (this.rackService.handlingSelected[position - 1] === false) {
            if (this.rackService.exchangeSelected[position - 1] === true) {
                this.rackService.exchangeSelected[position - 1] = false;
            }

            // for (let i = 0; i < this.rackService.handlingSelected.length; i++) {
            //     this.rackService.deselect(i + 1, rackContext, false);
            // }
            this.rackService.select(position, rackContext, false);
            this.letterSelectedPosition = position - 1;
        }
    }

    // selectByLetter(letterToSelect: string) {
    //     let i: number;
    //     let firstOccurencePosition: number;
    //     for (i = 0; i < this.rackService.rackLetters.length; i++) {
    //         if (this.rackService.rackLetters[i].character === letterToSelect) {
    //             firstOccurencePosition = i;
    //             break;
    //         }
    //     }

    //     if (this.rackService.handlingSelected[i] === false) {
    //         if (this.rackService.exchangeSelected[i] === true) {
    //             this.rackService.exchangeSelected[i] = false;
    //         }
    //     } else {
    //         for (i; i < this.rackService.rackLetters.length; i++) {
    //             if (this.rackService.rackLetters[i].character === letterToSelect) {
    //                 break;
    //             }
    //         }
    //         if (i === this.rackService.rackLetters.length && this.rackService.rackLetters[i].character !== letterToSelect) {
    //             i = firstOccurencePosition;
    //         }
    //     }

    //     this.rackService.select(i + 1, this.rackService.gridContext, false);
    //     this.letterSelectedPosition = i;
    // }

    switchLeft() {
        if (this.rackService.handlingSelected[this.letterSelectedPosition] === true) {
            const letterToSwitchLeft = this.rackService.rackLetters[this.letterSelectedPosition];

            if (this.letterSelectedPosition === 0) {
                this.rackService.rackLetters[this.letterSelectedPosition] = this.rackService.rackLetters[this.rackService.rackLetters.length - 1];
                this.rackService.rackLetters[this.rackService.rackLetters.length - 1] = letterToSwitchLeft;
                this.letterSelectedPosition = this.rackService.rackLetters.length - 1;
                this.rackService.clearRack();
                this.rackService.select(this.rackService.rackLetters.length, this.rackService.gridContext, false);
            } else {
                this.rackService.rackLetters[this.letterSelectedPosition] = this.rackService.rackLetters[this.letterSelectedPosition - 1];
                this.rackService.rackLetters[this.letterSelectedPosition - 1] = letterToSwitchLeft;
                this.letterSelectedPosition = this.letterSelectedPosition - 1;
                this.rackService.clearRack();
                this.rackService.select(this.letterSelectedPosition + 1, this.rackService.gridContext, false);
            }
        }
    }

    switchRight() {
        if (this.rackService.handlingSelected[this.letterSelectedPosition] === true) {
            const letterToSwitchRight = this.rackService.rackLetters[this.letterSelectedPosition];

            if (this.letterSelectedPosition === this.rackService.rackLetters.length - 1) {
                this.rackService.rackLetters[this.letterSelectedPosition] = this.rackService.rackLetters[0];
                this.rackService.rackLetters[0] = letterToSwitchRight;
                this.letterSelectedPosition = 0;
                this.rackService.clearRack();
                this.rackService.select(1, this.rackService.gridContext, false);
            } else {
                this.rackService.rackLetters[this.letterSelectedPosition] = this.rackService.rackLetters[this.letterSelectedPosition + 1];
                this.rackService.rackLetters[this.letterSelectedPosition + 1] = letterToSwitchRight;
                this.letterSelectedPosition = this.letterSelectedPosition + 1;
                this.rackService.clearRack();
                this.rackService.select(this.letterSelectedPosition + 1, this.rackService.gridContext, false);
            }
        }
    }
}
