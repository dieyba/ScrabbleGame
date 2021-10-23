import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton, RACK_HEIGHT, RACK_WIDTH } from '@app/components/play-area/play-area.component';

enum Case {
    FirstCaseValue = 71,
    SecondCaseValue = 141,
    ThirdCaseValue = 212,
    FourthCaseValue = 284,
    FifthCaseValue = 356,
    SixthCaseValue = 428,
    SeventhCaseValue = 501,
}

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    private mousePosition = new Vec2();
    private isLeftClick = false;

    // constructor(position: Vec2) {
    //     this.mousePosition = position;
    // }

    mouseHitDetect(event: MouseEvent): boolean {
        if (event.button === MouseButton.Left) {
            this.isLeftClick = true;
        } else if (event.button === MouseButton.Right) {
            this.isLeftClick = false;
        }

        this.mousePosition.x = event.offsetX;
        this.mousePosition.y = event.offsetY;
        // console.log('x : ', this.mousePosition.x);
        // console.log('y : ', this.mousePosition.y);

        return this.isLeftClick;
    }

    isCoordInsideRack(): boolean {
        const isLessThanMaxWidth = this.mousePosition.x <= RACK_WIDTH && this.mousePosition.x >= 0;
        const isLessThanMaxHeight = this.mousePosition.y <= RACK_HEIGHT && this.mousePosition.y >= 0;
        return isLessThanMaxWidth && isLessThanMaxHeight;
    }

    selectedLetterPosition(): number {
        if (this.isCoordInsideRack()) {
            if (this.mousePosition.x < Case.FirstCaseValue) {
                // case 1
                return 1;
            } else if (this.mousePosition.x < Case.SecondCaseValue && this.mousePosition.x >= Case.FirstCaseValue) {
                // case 2
                return 2;
            } else if (this.mousePosition.x < Case.ThirdCaseValue && this.mousePosition.x >= Case.SecondCaseValue) {
                // case 3
                return 3;
            } else if (this.mousePosition.x < Case.FourthCaseValue && this.mousePosition.x >= Case.ThirdCaseValue) {
                // case 4
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return 4;
            } else if (this.mousePosition.x < Case.FifthCaseValue && this.mousePosition.x >= Case.FourthCaseValue) {
                // case 5
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return 5;
            } else if (this.mousePosition.x < Case.SixthCaseValue && this.mousePosition.x >= Case.FifthCaseValue) {
                // case 6
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return 6;
            } else if (this.mousePosition.x < Case.SeventhCaseValue && this.mousePosition.x >= Case.SixthCaseValue) {
                // case 7
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return 7;
            }
        }
        return 0;
    }
}
