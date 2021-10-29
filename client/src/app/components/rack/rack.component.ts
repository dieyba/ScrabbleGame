import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ExchangeService } from '@app/services/exchange.service';
import { ManipulationRackService } from '@app/services/manipulation-rack.service';
import { RackService } from '@app/services/rack.service';

export const RACK_WIDTH = 500;
export const RACK_HEIGHT = 60;
const NUMBER_OF_LETTERS = 7;

@Component({
    selector: 'app-rack',
    templateUrl: './rack.component.html',
    styleUrls: ['./rack.component.scss'],
})
export class RackComponent implements AfterViewInit {
    @ViewChild('rackCanvas', { static: false }) private rackCanvas!: ElementRef<HTMLCanvasElement>;

    private rackSize = new Vec2(RACK_WIDTH, RACK_HEIGHT);
    private rackContext: CanvasRenderingContext2D;

    constructor(
        private rackService: RackService,
        private manipulationRackService: ManipulationRackService,
        private exchangeService: ExchangeService,
    ) {}

    get rackCanvasElement(): HTMLCanvasElement {
        return this.rackCanvas.nativeElement;
    }

    ngAfterViewInit(): void {
        this.rackService.gridContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        return;
    }

    onLeftClick(event: Event) {
        const position = this.selectedLetterPosition(event as MouseEvent);
        this.manipulationRackService.handleSelection(position);
    }

    onRightClick(event: Event) {
        event.preventDefault();
        const position = this.selectedLetterPosition(event as MouseEvent);
        this.manipulationRackService.clearManipValues();
        this.exchangeService.handleSelection(position);
    }

    onFocusOut(event: Event) {
        const evt = event as FocusEvent;
        let newFocus: string;
        // Is the user didn't change tab or window, do something
        if (document.hasFocus()) {
            if (evt.relatedTarget !== null) {
                // console.log('target : ', evt.relatedTarget);
                newFocus = (evt.relatedTarget as HTMLElement).id;
                if (newFocus !== 'exchangeButton') {
                    // If the exchangeButton is pressed, play-area.component will handle the call to exchange letters
                    this.rackService.deselectAll(this.rackContext);
                }
            } else {
                this.rackService.deselectAll(this.rackContext);
            }
            this.manipulationRackService.clearManipValues();
        }
    }

    onKeyDown(event: Event) {
        event.preventDefault();
        const evt = event as KeyboardEvent;
        const buttonPressed = evt.key;
        if (buttonPressed === 'ArrowLeft') {
            this.manipulationRackService.switchLeft();
        } else if (buttonPressed === 'ArrowRight') {
            this.manipulationRackService.switchRight();
        } else {
            // If the key is a letter, number or special character
            if (evt.key.length === 1) {
                this.manipulationRackService.selectByLetter(buttonPressed);
                this.rackCanvas.nativeElement.focus();
            }
        }
    }

    onWheel(event: Event) {
        event.preventDefault();
        const evt = event as WheelEvent;
        if (evt.deltaY > 0) {
            this.manipulationRackService.switchRight();
        } else {
            this.manipulationRackService.switchLeft();
        }
    }

    get rackWidth(): number {
        return this.rackSize.x;
    }

    get rackHeight(): number {
        return this.rackSize.y;
    }

    selectedLetterPosition(event: MouseEvent): number {
        let positionStart = 0;
        let positionEnd = RACK_WIDTH / NUMBER_OF_LETTERS;
        let letterSelectedPosition = 1;

        while (positionEnd <= RACK_WIDTH) {
            if (event.offsetX >= positionStart && event.offsetX < positionEnd) {
                return letterSelectedPosition;
            } else {
                positionStart = (RACK_WIDTH / NUMBER_OF_LETTERS) * letterSelectedPosition;
                letterSelectedPosition++;
                positionEnd = (RACK_WIDTH / NUMBER_OF_LETTERS) * letterSelectedPosition;
            }
        }

        return 0;
    }
}
