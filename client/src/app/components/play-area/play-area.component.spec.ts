import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { ExchangeService } from '@app/services/exchange.service';
import { GridService } from '@app/services/grid.service';
import { ManipulationRackService } from '@app/services/manipulation-rack.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';

/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let manipulateRackServiceSpy: jasmine.SpyObj<ManipulationRackService>;
    let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [MatCardModule],
        });
        gridServiceSpy = jasmine.createSpyObj('GridService', ['sizeUpLetters', 'sizeDownLetters', 'drawGrid', 'drawColors', 'drawLetter']);
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', [
            'localPlayer',
            'virtualPlayer',
            'createNewGame',
            'passTurn',
            'changeActivePlayer',
            'removeRackLetter',
            'stock',
            'exchangeLettersSelected',
        ]);
        // pour les properties, cette faôn de faire empêche les modifs. check sur le lien suivant pour modifer ça.
        // https://stackoverflow.com/questions/64560390/jasmine-createspyobj-with-properties
        rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'select', 'deselect', 'deselectAll', 'handleExchangeSelection'], {
            ['exchangeSelected']: [false, false, false, false, false, false, false],
        });
        manipulateRackServiceSpy = jasmine.createSpyObj('ManipulationRackService', [
            'handleSelection',
            'clearManipValues',
            'selectByLetter',
            'switchLeft',
            'switchRight',
        ]);
        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['handleSelection', 'exchange', 'cancelExchange', 'atLeastOneLetterSelected']);
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: SoloGameService, useValue: soloGameServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
                { provide: ManipulationRackService, useValue: manipulateRackServiceSpy },
                { provide: ExchangeService, useValue: exchangeServiceSpy },
            ],
        }).compileComponents();

        gridServiceSpy.scrabbleBoard = new ScrabbleBoard();
        const letter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        soloGameServiceSpy.localPlayer = new LocalPlayer('Arianne');
        soloGameServiceSpy.localPlayer.score = 73;
        soloGameServiceSpy.localPlayer.letters = [letter];
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit should call drawGrid and drawColors', () => {
        component.ngAfterViewInit();
        expect(soloGameServiceSpy.createNewGame).toHaveBeenCalled();
        expect(gridServiceSpy.drawGrid).toHaveBeenCalled();
        expect(gridServiceSpy.drawColors).toHaveBeenCalled();
    });

    it('passTurn should call soloGameservices passTurn', () => {
        component.passTurn();
        expect(soloGameServiceSpy.passTurn).toHaveBeenCalled();
    });

    it('width should return the width of the canvas', () => {
        expect(component.width).toEqual(DEFAULT_WIDTH);
    });

    it('height should return the height of the canvas', () => {
        expect(component.height).toEqual(DEFAULT_HEIGHT);
    });

    // it('rackWidth should return the width of the rack', () => {
    //     expect(component.rackWidth).toEqual(RACK_WIDTH);
    // });

    // it('rackHeight should return the height of the rack', () => {
    //     expect(component.rackHeight).toEqual(RACK_HEIGHT);
    // });

    it('sizeUpLetters should call gridservices sizeUpLetters', () => {
        component.sizeUpLetters();
        expect(gridServiceSpy.sizeUpLetters).toHaveBeenCalled();
    });

    it('sizeDownLetters should call gridservices sizeDownLetters', () => {
        component.sizeDownLetters();
        expect(gridServiceSpy.sizeDownLetters).toHaveBeenCalled();
    });

    it('atLeastOneLetterSelected should call exchangeService atLeastOneLetterSelected', () => {
        component.atLeastOneLetterSelected();
        expect(exchangeServiceSpy.atLeastOneLetterSelected).toHaveBeenCalled();
    });

    // it('buttonDetect should call manipulateRackService switchLeft if we press arrow left button', () => {
    //     const testEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    //     fixture.nativeElement.dispatchEvent(testEvent);
    //     expect(manipulateRackServiceSpy.switchLeft).toHaveBeenCalled();
    //     expect(manipulateRackServiceSpy.switchRight).not.toHaveBeenCalled();
    //     expect(manipulateRackServiceSpy.selectByLetter).not.toHaveBeenCalled();
    // });

    // it('buttonDetect should call manipulateRackService switchRight if we press arrow right button', () => {
    //     const testEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    //     fixture.nativeElement.dispatchEvent(testEvent);
    //     expect(manipulateRackServiceSpy.switchRight).toHaveBeenCalled();
    //     expect(manipulateRackServiceSpy.switchLeft).not.toHaveBeenCalled();
    //     expect(manipulateRackServiceSpy.selectByLetter).not.toHaveBeenCalled();
    // });

    // it('buttonDetect should call manipulateRackService selectByLetter if we press a button else than left or right arrow', () => {
    //     const testEvent = new KeyboardEvent('keydown', { key: 'Space' });
    //     fixture.nativeElement.dispatchEvent(testEvent);
    //     expect(manipulateRackServiceSpy.selectByLetter).toHaveBeenCalled();
    //     expect(manipulateRackServiceSpy.switchLeft).not.toHaveBeenCalled();
    //     expect(manipulateRackServiceSpy.switchRight).not.toHaveBeenCalled();
    // });

    // il faut verifier l appel a focus() mais comment je fais avec le view child ?
    // it('buttonDetect should call ', () => {
    //     let element: ElementRef<HTMLCanvasElement>;
    //     element = jasmine.createSpyObj('ElementRef<HTMLCanvasElement>', ['nativeElement']);
    //     component.rackCanvas = element;
    //     // element.nativeElement

    //     // let canvasElement: HTMLCanvasElement;
    //     // canvasElement = jasmine.createSpyObj('HTMLCanvasElement', ['focus']);
    //     // component.rackCanvas.nativeElement = canvasElement;
    //     // expect(canvasElement.focus).toHaveBeenCalled();

    //     const testEvent = new KeyboardEvent('keydown', { key: 'Space' });
    //     fixture.nativeElement.dispatchEvent(testEvent);

    //     let nativeElement: HTMLCanvasElement;
    //     nativeElement = component.rackCanvas.nativeElement;
    //     const spy = spyOn(nativeElement, 'focus');
    //     expect(spy).toHaveBeenCalled();

    //     // component.rackCanvas = new ElementRef({element: jasmine.createSpyObj('ElementRef<HTMLCanvasElement>', ['nativeElement'])});
    // });

    it('lessThanSevenLettersInStock should return true if there is less than seven letters in the letter stock', () => {
        soloGameServiceSpy.stock.letterStock = [new ScrabbleLetter('j'), new ScrabbleLetter('p')];
        expect(component.lessThanSevenLettersInStock()).toBeTrue();

        soloGameServiceSpy.stock.letterStock = [
            new ScrabbleLetter('j'),
            new ScrabbleLetter('p'),
            new ScrabbleLetter('b'),
            new ScrabbleLetter('l'),
            new ScrabbleLetter('d'),
            new ScrabbleLetter('w'),
            new ScrabbleLetter('z'),
        ];
        expect(component.lessThanSevenLettersInStock()).toBeFalse();
    });

    it('exchange should call exchangeServiceSpy exchange', () => {
        component.exchange();
        expect(exchangeServiceSpy.exchange).toHaveBeenCalled();
    });

    // meme problème, comment je récupère un element du html
    // it('exchange should be called when we click on exchange button', () => {
    //     let button = fixture.nativeElement.querySelector('exchangeButton');
    //     button.click();
    //     expect(exchangeServiceSpy.exchange).toHaveBeenCalled();
    // });

    it('cancelExchange should call exchangeServiceSpy cancelExchange', () => {
        component.cancelExchange();
        expect(exchangeServiceSpy.cancelExchange).toHaveBeenCalled();
    });

    // meme probleme de html
    // it('cancelExchange should be called when we click on cancel button', () => {

    // });
});
