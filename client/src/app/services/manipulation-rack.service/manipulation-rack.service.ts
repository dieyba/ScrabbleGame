import { Injectable } from '@angular/core';
import { ERROR_NUMBER } from '@app/classes/utilities/utilities';
import { RackService } from '@app/services/rack.service/rack.service';

@Injectable({
    providedIn: 'root',
})
export class ManipulationRackService {
    private letterSelectedPosition: number;
    private firstOccurrencePosition: number;

    constructor(private readonly rackService: RackService) {
        this.letterSelectedPosition = ERROR_NUMBER;
        this.firstOccurrencePosition = ERROR_NUMBER;
    }

    handleSelection(position: number) {
        if (this.rackService.handlingSelected[position - 1] === false) {
            if (this.rackService.exchangeSelected[position - 1] === true) {
                this.rackService.exchangeSelected[position - 1] = false;
            }
            this.rackService.select(position, this.rackService.gridContext, false);
            this.letterSelectedPosition = position - 1;
        }
    }

    clearManipulationValues() {
        this.letterSelectedPosition = ERROR_NUMBER;
        this.firstOccurrencePosition = ERROR_NUMBER;
    }

    findFirstOccurrence(letterToFind: string) {
        for (let i = 0; i < this.rackService.rackLetters.length; i++) {
            if (this.rackService.rackLetters[i].character === letterToFind) {
                this.firstOccurrencePosition = i;
                break;
            }
        }
    }

    selectByLetter(letterToSelect: string) {
        let i: number;

        if (this.firstOccurrencePosition === ERROR_NUMBER) {
            this.findFirstOccurrence(letterToSelect);
            i = this.firstOccurrencePosition;
        } else if (this.rackService.rackLetters[this.firstOccurrencePosition].character !== letterToSelect) {
            this.firstOccurrencePosition = ERROR_NUMBER;
            this.findFirstOccurrence(letterToSelect);
            i = this.firstOccurrencePosition;
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
                    i = this.firstOccurrencePosition;
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
                this.rackService.rackLetters.shift();
                this.rackService.rackLetters.push(letterToSwitchLeft);
                this.letterSelectedPosition = this.rackService.rackLetters.length - 1;
                this.rackService.redrawRack();
                this.rackService.select(this.rackService.rackLetters.length, this.rackService.gridContext, false);
            } else {
                this.rackService.rackLetters[this.letterSelectedPosition] = this.rackService.rackLetters[this.letterSelectedPosition - 1];
                this.rackService.rackLetters[this.letterSelectedPosition - 1] = letterToSwitchLeft;
                this.letterSelectedPosition = this.letterSelectedPosition - 1;
                this.rackService.redrawRack();
                this.rackService.select(this.letterSelectedPosition + 1, this.rackService.gridContext, false);
            }
        }
    }

    switchRight() {
        if (this.rackService.handlingSelected[this.letterSelectedPosition] === true) {
            const letterToSwitchRight = this.rackService.rackLetters[this.letterSelectedPosition];

            if (this.letterSelectedPosition === this.rackService.rackLetters.length - 1) {
                // Removing last letter
                this.rackService.rackLetters.pop();
                // Placing letter at the beginning
                this.rackService.rackLetters.unshift(letterToSwitchRight);
                this.letterSelectedPosition = 0;
                this.rackService.redrawRack();
                this.rackService.select(1, this.rackService.gridContext, false);
            } else {
                this.rackService.rackLetters[this.letterSelectedPosition] = this.rackService.rackLetters[this.letterSelectedPosition + 1];
                this.rackService.rackLetters[this.letterSelectedPosition + 1] = letterToSwitchRight;
                this.letterSelectedPosition = this.letterSelectedPosition + 1;
                this.rackService.redrawRack();
                this.rackService.select(this.letterSelectedPosition + 1, this.rackService.gridContext, false);
            }
        }
    }
}
