import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { Dictionary } from '@app/classes/dictionary';
import { GameParameters, GameType } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { CommandInvokerService } from '@app/services/command-invoker.service';
import { ExchangeService } from '@app/services/exchange.service';
import { GameService } from '@app/services/game.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, GridService } from '@app/services/grid.service';
import { LetterStock } from '@app/services/letter-stock.service';
import { MouseWordPlacerService } from '@app/services/mouse-word-placer.service';
import { RackService, RACK_HEIGHT, RACK_WIDTH } from '@app/services/rack.service';
import { DEFAULT_LETTER_COUNT, SoloGameService } from '@app/services/solo-game.service';
import { BehaviorSubject, Observable } from 'rxjs';

/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let commandInvokerServiceSpy: jasmine.SpyObj<CommandInvokerService>;
    let mouseWordPlacerServiceSpy: jasmine.SpyObj<MouseWordPlacerService>;
    let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [MatCardModule, RouterModule],
        });
        gridServiceSpy = jasmine.createSpyObj('GridService', ['sizeUpLetters', 'sizeDownLetters', 'drawGrid', 'drawColors', 'drawLetter']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['currentGameService', 'initializeGameType']);
        commandInvokerServiceSpy = jasmine.createSpyObj('CommandInvokerService', ['executeCommand']);
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['initializeGame', 'createNewGame', 'getLettersSelected']);
        mouseWordPlacerServiceSpy = jasmine.createSpyObj('MouseWordPlacerService', ['onKeyDown', 'onBlur', 'onMouseClick']);
        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['atLeastOneLetterSelected', 'exchange', 'cancelExchange']);
        // pour les properties, cette faôn de faire empêche les modifs. check sur le lien suivant pour modifer ça.
        // https://stackoverflow.com/questions/64560390/jasmine-createspyobj-with-properties
        rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'select', 'deselect', 'deselectAll', 'handleExchangeSelection'], {
            ['exchangeSelected']: [false, false, false, false, false, false, false],
        });
        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['handleSelection', 'exchange', 'cancelExchange', 'atLeastOneLetterSelected']);
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: SoloGameService, useValue: soloGameServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
                { provide: CommandInvokerService, useValue: commandInvokerServiceSpy },
                { provide: MouseWordPlacerService, useValue: mouseWordPlacerServiceSpy },
                { provide: ExchangeService, useValue: exchangeServiceSpy },
                { provide: Router, useValue: { navigate: () => new Observable() } },
            ],
        }).compileComponents();

        gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
        gameServiceSpy.initializeGameType(GameType.Solo);
        gameServiceSpy.currentGameService = soloGameServiceSpy;
        const form = new FormGroup({
            name: new FormControl('dieyna'),
            timer: new FormControl('1:00'),
            bonus: new FormControl(true),
            level: new FormControl('easy'),
            dictionaryForm: new FormControl('Francais'),
            opponent: new FormControl('Sara'),
        });
        gameServiceSpy.currentGameService.game = new GameParameters(form.controls.name.value, +form.controls.timer.value, form.controls.bonus.value);
        gameServiceSpy.currentGameService.game.creatorPlayer = new LocalPlayer(form.controls.name.value);
        gameServiceSpy.currentGameService.game.creatorPlayer.isActive = true;
        gameServiceSpy.currentGameService.stock = new LetterStock();
        gameServiceSpy.currentGameService.game.localPlayer = new LocalPlayer(form.controls.name.value);
        gameServiceSpy.currentGameService.game.creatorPlayer = gameServiceSpy.currentGameService.game.localPlayer;
        gameServiceSpy.currentGameService.game.opponentPlayer = new VirtualPlayer(form.controls.opponent.value, form.controls.level.value);
        const localLetters = gameServiceSpy.currentGameService.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        gameServiceSpy.currentGameService.game.localPlayer.letters = localLetters;
        const opponentLetters = gameServiceSpy.currentGameService.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        gameServiceSpy.currentGameService.game.opponentPlayer.letters = opponentLetters;
        gameServiceSpy.currentGameService.game.dictionary = new Dictionary(+form.controls.dictionaryForm.value);
        gameServiceSpy.currentGameService.game.randomBonus = form.controls.bonus.value;
        gameServiceSpy.currentGameService.game.totalCountDown = form.controls.timer.value;
        gameServiceSpy.currentGameService.game.timerMs = form.controls.timer.value;
        gameServiceSpy.currentGameService.game.localPlayer = gameServiceSpy.currentGameService.game.creatorPlayer;
        soloGameServiceSpy.virtualPlayerSubject = new BehaviorSubject<boolean>(gameServiceSpy.currentGameService.game.localPlayer.isActive);
        soloGameServiceSpy.isVirtualPlayerObservable = soloGameServiceSpy.virtualPlayerSubject.asObservable();
        soloGameServiceSpy.virtualPlayerSubject.next(true);
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
        expect(gameServiceSpy.currentGameService.createNewGame).toHaveBeenCalled();
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

    it('passTurn should call commandInvokerService.executeCommand', () => {
        component.passTurn();
        expect(commandInvokerServiceSpy.executeCommand).toHaveBeenCalled();
    });

    it('onKeyDown should call mouseWordPlacerService onKeyDown method', () => {
        const keyboardEvent = {
            code: 'a',
        } as KeyboardEvent;
        component.onKeyDown(keyboardEvent);
        expect(mouseWordPlacerServiceSpy.onKeyDown).toHaveBeenCalled();
    });

    it('onMouseDown should call mouseWordPlacerService onMouseClick method', () => {
        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component.onMouseDown(mouseEvent);
        expect(mouseWordPlacerServiceSpy.onMouseClick).toHaveBeenCalled();
    });

    it('rackHeight should return play area rack height', () => {
        expect(component.rackHeight).toEqual(RACK_HEIGHT);
    });

    it('rackWidth should return play area rack width', () => {
        expect(component.rackWidth).toEqual(RACK_WIDTH);
    });

    it('lessThanSevenLettersInStock should return the right value', () => {
        expect(component.lessThanSevenLettersInStock()).toEqual(false);
    });

    it('exchange should call exchangeService exchange method', () => {
        component.exchange();
        expect(exchangeServiceSpy.exchange).toHaveBeenCalled();
    });

    it('cancelExchange should call exchangeService cancelExchange method', () => {
        component.cancelExchange();
        expect(exchangeServiceSpy.cancelExchange).toHaveBeenCalled();
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
