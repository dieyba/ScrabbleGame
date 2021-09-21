import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { EaselService } from '@app/services/easel.service';
import { GridService } from '@app/services/grid.service';

// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH = 860;
export const DEFAULT_HEIGHT = 860;
export const EASEL_WIDTH = 700;
export const EASEL_HEIGHT = 100;

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
    @ViewChild('easelCanvas', { static: false }) private easelCanvas!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private easelSize = { x: EASEL_WIDTH, y: EASEL_HEIGHT};

    constructor(private readonly gridService: GridService, private readonly easelService: EaselService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.easelService.gridContext = this.easelCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawGrid();
        this.gridService.drawColors();
        this.easelService.drawEasel();
        this.gridCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    get easelWidth(): number {
        return this.easelSize.x;
    }

    get easelHeight(): number {
        return this.easelSize.y;
    }

    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
        }
    }

    sizeUpLetters(): void {
        this.gridService.sizeUpLetters();
    }
}
