import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Vec2 } from '@app/classes/vec2';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
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

    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private rackSize = { x: RACK_WIDTH, y: RACK_HEIGHT };
    private game = new GamePageComponent(this.rackService);

    constructor(private readonly gridService: GridService, private readonly rackService: RackService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.gridContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawGrid();
        this.gridService.drawColors();

        // TODO - Remove Test
        const letter1 = new ScrabbleLetter();
        letter1.character = 'a';
        letter1.value = 1;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.gridService.drawLetter(letter1, 8, 9);

        const letter2 = new ScrabbleLetter();
        letter2.character = 'p';
        letter2.value = 10;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.gridService.drawLetter(letter2, 9, 9);

        const letter3 = new ScrabbleLetter();
        letter3.character = 'p';
        letter3.value = 3;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.gridService.drawLetter(letter3, 10, 9);

        const letter4 = new ScrabbleLetter();
        letter4.character = 'l';
        letter4.value = 1;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.gridService.drawLetter(letter4, 11, 9);

        const letter5 = new ScrabbleLetter();
        letter5.character = 'e';
        letter5.value = 2;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.gridService.drawLetter(letter5, 12, 9);
        this.rackService.drawRack();

        this.rackService.drawRack();
        this.game.distributeLetters();
        this.gridCanvas.nativeElement.focus();
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

    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
        }
    }

    sizeUpLetters(): void {
        this.gridService.sizeUpLetters();
    }

    sizeDownLetters(): void {
        this.gridService.sizeDownLetters();
    }
}
