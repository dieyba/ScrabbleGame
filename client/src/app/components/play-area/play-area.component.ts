import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ExchangeService } from '@app/services/exchange.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';

// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH = 640;
export const DEFAULT_HEIGHT = 640;
export const RACK_WIDTH = 500;
export const RACK_HEIGHT = 60;

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = new Vec2(0, 0);
    private canvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    private rackSize = new Vec2(RACK_WIDTH, RACK_HEIGHT);
    private rackContext: CanvasRenderingContext2D;

    constructor(
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        private readonly soloGameService: SoloGameService, // private readonly validationService: ValidationService,
        private readonly exchangeService: ExchangeService,
    ) {}

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.soloGameService.createNewGame();
        this.gridService.drawGrid();
        this.gridService.drawColors();
        this.rackService.drawRack();
        this.rackContext = this.rackService.gridContext;
    }

    passTurn() {
        this.soloGameService.passTurn(this.soloGameService.localPlayer);
    }

    isLocalPlayerActive(): boolean {
        return this.soloGameService.localPlayer.isActive;
    }

    isEndGame(): boolean {
        return this.soloGameService.isEndGame;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    get rackWidth(): number {
        return this.rackSize.x;
    }

    get rackHeight(): number {
        return this.rackSize.y;
    }

    sizeUpLetters(): void {
        this.gridService.sizeUpLetters();
    }

    sizeDownLetters(): void {
        this.gridService.sizeDownLetters();
    }

    atLeastOneLetterSelected(): boolean {
        return this.exchangeService.atLeastOneLetterSelected();
    }

    lessThanSevenLettersInStock(): boolean {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return this.soloGameService.stock.letterStock.length < 7;
    }

    exchange() {
        this.exchangeService.exchange();
    }

    cancelExchange() {
        this.exchangeService.cancelExchange(this.rackContext);
    }
}
