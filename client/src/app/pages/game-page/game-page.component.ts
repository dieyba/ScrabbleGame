import { Component } from '@angular/core';
// import { GridService } from '@app/services/grid.service';
import { MouseHandlerService } from '@app/services/mouse-handler.service';
// import { RackService } from '@app/services/rack.service';
// import { SoloGameService } from '@app/services/solo-game.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(
        private readonly mouseService: MouseHandlerService
        // private readonly gridService: GridService,
        // private readonly rackService: RackService,
        // private readonly soloGameService: SoloGameService, // private readonly validationService: ValidationService,
    ) {}

    selection(event: MouseEvent) {
        this.mouseService.mouseHitDetect(event);
        // const position = this.mouseService.selectedLetterPosition();
        // if (this.soloGameService.localPlayer.exchangeSelected[position - 1] === true) {
        //     this.rackService.deselectForExchange(position, ctx, this.soloGameService.localPlayer);
        // } else {
        //     this.rackService.selectForExchange(position, ctx, this.soloGameService.localPlayer);
        // }

        // if (event.button === MouseButton.Left) {
        //     this.mousePosition.x = event.offsetX;
        //     this.mousePosition.y = event.offsetY;
        //     const ctx = this.rackCanvas.nativeElement.getContext('2d');
        //     if (!ctx?.fillStyle) return;
        //     // this.rackCanvas.nativeElement.style.background = 'orange';
        //     ctx.fillStyle = 'orange';
        //     // ctx.shadowColor = 'red';
        //     ctx.fillRect(0, 0, 71, 60);
        //     ctx.fillStyle = 'red';
        //     ctx.fillRect(71, 0, 71, 60);
        //     this.rackService.drawExistingLetters();
        //     // style="background-color: blue;"
        // }
        // // console.log('x : ', this.mousePosition.x);
        // // console.log('y : ', this.mousePosition.y);
    }
}
