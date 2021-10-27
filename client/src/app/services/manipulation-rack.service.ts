import { Injectable } from '@angular/core';
import { MouseHandlerService } from './mouse-handler.service';
import { RackService } from './rack.service';

const ERROR_NUMBER = -1;

@Injectable({
    providedIn: 'root',
})
export class ManipulationRackService {
    private letterSelectedPosition = ERROR_NUMBER;
    private firstOccurencePosition = ERROR_NUMBER;

    constructor(private readonly mouseService: MouseHandlerService, private readonly rackService: RackService) {}

    handleSelection() {
        const position = this.mouseService.selectedLetterPosition();

        if (this.rackService.handlingSelected[position - 1] === false) {
            if (this.rackService.exchangeSelected[position - 1] === true) {
                this.rackService.exchangeSelected[position - 1] = false;
            }
            this.rackService.select(position, this.rackService.gridContext, false);
            this.letterSelectedPosition = position - 1;
        }
        // console.log(this.letterSelectedPosition);
    }

    clearManipValues() {
        this.letterSelectedPosition = ERROR_NUMBER;
        this.firstOccurencePosition = ERROR_NUMBER;
    }

    findFisrtOccurence(letterToFind: string) {
        for (let i = 0; i < this.rackService.rackLetters.length; i++) {
            if (this.rackService.rackLetters[i].character === letterToFind) {
                this.firstOccurencePosition = i;
                break;
            }
        }
    }

    selectByLetter(letterToSelect: string) {
        let i: number;

        if (this.firstOccurencePosition === ERROR_NUMBER) {
            this.findFisrtOccurence(letterToSelect);
            i = this.firstOccurencePosition;
        } else if (this.rackService.rackLetters[this.firstOccurencePosition].character !== letterToSelect) {
            this.firstOccurencePosition = ERROR_NUMBER;
            this.findFisrtOccurence(letterToSelect);
            i = this.firstOccurencePosition;
        } else {
            i = this.letterSelectedPosition;
        }

        if (i !== ERROR_NUMBER) {
            if (this.rackService.handlingSelected[i] === false) {
                if (this.rackService.exchangeSelected[i] === true) {
                    this.rackService.exchangeSelected[i] = false;
                }
            } else {
                for (i = i + 1; i < this.rackService.rackLetters.length; i++) {
                    if (this.rackService.rackLetters[i].character === letterToSelect) {
                        break;
                    }
                }
                if (i === this.rackService.rackLetters.length) {
                    i = this.firstOccurencePosition;
                }
            }
            this.rackService.select(i + 1, this.rackService.gridContext, false);
            this.letterSelectedPosition = i;
        } else {
            this.rackService.deselectAll(this.rackService.gridContext);
            this.letterSelectedPosition = ERROR_NUMBER;
        }
    }

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
        // console.log(this.letterSelectedPosition);
        // console.log(this.rackService.exchangeSelected);
        // console.log(this.rackService.handlingSelected);
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
        // console.log(this.letterSelectedPosition);
        // console.log(this.rackService.exchangeSelected);
        // console.log(this.rackService.handlingSelected);
    }
}
