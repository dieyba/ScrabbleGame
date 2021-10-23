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

    selection(event: MouseEvent) {
        event.preventDefault();
    }

    get rackWidth(): number {
        return this.rackSize.x;
    }

    get rackHeight(): number {
        return this.rackSize.y;
    }
}
