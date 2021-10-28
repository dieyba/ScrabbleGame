import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { MouseWordPlacerService } from '@app/services/mouse-word-placer.service';
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
    @ViewChild('rackCanvas', { static: false }) private rackCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('overlayCanvas', { static: false }) private overlayCanvas!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = new Vec2(0, 0);
    buttonPressed = '';
    private canvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    private rackSize = new Vec2(RACK_WIDTH, RACK_HEIGHT);

    constructor(
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        private readonly soloGameService: SoloGameService, // private readonly validationService: ValidationService,
        private readonly mouseWordPlacerService: MouseWordPlacerService,
    ) {}
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.mouseWordPlacerService.onKeyDown(event);
    }
    @HostListener('focusout', ['$event'])
    onBlur() {
        this.mouseWordPlacerService.onBlur();
    }
    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.gridContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.mouseWordPlacerService.overlayContext = this.overlayCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.soloGameService.createNewGame();
        this.gridService.drawGrid();
        this.gridService.drawColors();
        this.rackService.drawRack();
        // TODO : Remove tests validation
        // const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
        // this.gridService.drawLetter(letter1, 0, 0);
        // const letter2: ScrabbleLetter = new ScrabbleLetter('é', 2);
        // this.gridService.drawLetter(letter2, 1, 0);
        // // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        // const letter3: ScrabbleLetter = new ScrabbleLetter('j', 4);
        // this.gridService.drawLetter(letter3, 2, 0);
        // const letter4: ScrabbleLetter = new ScrabbleLetter('à', 3);
        // this.gridService.drawLetter(letter4, 3, 0);
        // const letter5: ScrabbleLetter = new ScrabbleLetter('a', 1);
        // this.gridService.drawLetter(letter5, 0, 2);
        // const letter6: ScrabbleLetter = new ScrabbleLetter('m', 2);
        // this.gridService.drawLetter(letter6, 0, 3);
        // // Uncomment next two lines for words to be valid
        // // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        // const letter7: ScrabbleLetter = new ScrabbleLetter('i', 4);
        // // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        // this.gridService.drawLetter(letter7, 0, 4);
        // const word1: ScrabbleWord = new ScrabbleWord();
        // word1.content = [letter1, letter2, letter3, letter4];
        // word1.startPosition = new Vec2(0, 0);
        // word1.orientation = WordOrientation.Horizontal;
        // const word2: ScrabbleWord = new ScrabbleWord();
        // word2.content = [letter5, letter6, letter7];
        // word2.startPosition = new Vec2(0, 2);
        // word2.orientation = WordOrientation.Vertical;
        // const words: ScrabbleWord[] = [word1, word2];
        // this.soloGameService.removeLetter(this.soloGameService.localPlayer.letters[0]);
        // this.soloGameService.removeLetter(this.soloGameService.localPlayer.letters[0]);
        // this.soloGameService.removeLetter(this.soloGameService.localPlayer.letters[0]);
        // this.soloGameService.removeLetter(this.soloGameService.localPlayer.letters[0]);
        // this.soloGameService.removeLetter(this.soloGameService.localPlayer.letters[0]);
        // this.soloGameService.removeLetter(this.soloGameService.localPlayer.letters[0]);
        // this.soloGameService.removeLetter(this.soloGameService.localPlayer.letters[0]);
        // this.validationService.updatePlayerScore(words, this.soloGameService.localPlayer);
        // this.gridCanvas.nativeElement.focus();
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
    onMouseDown(event: MouseEvent) {
        this.mouseWordPlacerService.onMouseClick(event);
    }
}
