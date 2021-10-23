import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { MouseHandlerService } from '@app/services/mouse-handler.service';
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

    mousePosition: Vec2 = new Vec2(0, 0);
    buttonPressed = '';
    private canvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    private rackSize = new Vec2(RACK_WIDTH, RACK_HEIGHT);

    constructor(
        private readonly mouseService: MouseHandlerService,
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        private readonly soloGameService: SoloGameService, // private readonly validationService: ValidationService,
    ) {}

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
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
        this.soloGameService.passTurn();
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
        for (const selected of this.soloGameService.localPlayer.exchangeSelected) {
            if (selected === true) {
                return true;
            }
        }
        return false;
    }

    lessThanSevenLettersInStock(): boolean {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return this.soloGameService.stock.letterStock.length < 7;
    }

    exchange() {
        this.soloGameService.exchangeLettersSelected(this.soloGameService.localPlayer);
        // this.rackService.deselectAll(this.soloGameService.localPlayer);
    }

    cancelExchange() {
        const ctx = this.rackCanvas.nativeElement.getContext('2d');
        if (!ctx?.fillStyle) return;
        for (let i = 1; i <= this.soloGameService.localPlayer.letters.length; i++) {
            this.rackService.deselectForExchange(i, ctx, this.soloGameService.localPlayer);
        }
    }

    clickOutsideRack() {
        // const ctx = this.rackCanvas.nativeElement.getContext('2d');
        // if (!ctx?.fillStyle) return;
        // this.rackService.deselectAll(this.soloGameService.localPlayer, ctx);
    }

    selection(event: MouseEvent) {
        event.preventDefault();
        const ctx = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.mouseService.mouseHitDetect(event);
        const position = this.mouseService.selectedLetterPosition();
        if (this.soloGameService.localPlayer.exchangeSelected[position - 1] === true) {
            this.rackService.deselectForExchange(position, ctx, this.soloGameService.localPlayer);
        } else {
            this.rackService.selectForExchange(position, ctx, this.soloGameService.localPlayer);
        }

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
