import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { RackService } from '@app/services/rack.service';

export const RACK_WIDTH = 500;
export const RACK_HEIGHT = 60;

@Component({
    selector: 'app-rack',
    templateUrl: './rack.component.html',
    styleUrls: ['./rack.component.scss'],
})
export class RackComponent implements AfterViewInit {
    @ViewChild('rackCanvas', { static: false }) private rackCanvas!: ElementRef<HTMLCanvasElement>;

    private rackSize = new Vec2(RACK_WIDTH, RACK_HEIGHT);

    constructor(private rackService: RackService) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngAfterViewInit(): void {
        this.rackService.gridContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        return;
    }

    onLeftClick(event: Event) {
        console.log('Left click');
        console.log(event);
    }

    onRightClick(event: Event) {
        event.preventDefault();
        console.log('Right click');
        console.log(event);
    }

    onFocusOut(event: Event) {
        console.log('Focus out');
        console.log(event);
    }

    onKeyUp(event: Event) {
        event.preventDefault();
        console.log('KeyUp');
        console.log(event);
    }

    onWheel(event: Event) {
        event.preventDefault();
        console.log('On wheel');
        console.log(event);
    }

    get rackWidth(): number {
        return this.rackSize.x;
    }

    get rackHeight(): number {
        return this.rackSize.y;
    }
}
