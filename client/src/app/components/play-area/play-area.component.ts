import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';

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
    @ViewChild('rackCanvas', { static: false }) private rackCanvas!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = new Vec2(0, 0);
    buttonPressed = '';
    private canvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    private rackSize = new Vec2(RACK_WIDTH, RACK_HEIGHT);

    constructor(
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        private gameList: GameListService,
        private readonly gameService: GameService, // private readonly validationService: ValidationService,
    ) {}

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.gridContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // this.gameService.currentGameService.createNewGame();
        this.gridService.drawGrid();
        this.gridService.drawColors();
        this.rackService.drawRack();
    }

    passTurn() {
        this.gameService.currentGameService.passTurn(this.gameService.currentGameService.game.creatorPlayer);
    }

    isLocalPlayerActive(): boolean {
        return this.gameList.roomInfo.creatorPlayer.isActive;
    }

    isEndGame(): boolean {
        return this.gameService.currentGameService.game.isEndGame;
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
}
