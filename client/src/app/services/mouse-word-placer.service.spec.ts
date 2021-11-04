import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { CommandInvokerService } from './command-invoker.service';
import { GameService } from './game.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, GridService } from './grid.service';
import { MouseWordPlacerCompanionService } from './mouse-word-placer-companion.service';
import { MouseWordPlacerService } from './mouse-word-placer.service';
import { RackService } from './rack.service';

describe('MouseWordPlacerService', () => {
    let service: MouseWordPlacerService;
    let ctxSpy: CanvasRenderingContext2D;
    let gridSpy: jasmine.SpyObj<GridService>;
    let rackSpy: jasmine.SpyObj<RackService>;
    let gameSpy: jasmine.SpyObj<GameService>;
    let cmdSpy: jasmine.SpyObj<CommandInvokerService>;
    let companionSpy: jasmine.SpyObj<MouseWordPlacerCompanionService>;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                MouseWordPlacerService,
                { provide: GridService, useValue: gridSpy },
                { provide: RackService, useValue: rackSpy },
                { provide: GameService, useValue: gameSpy },
                { provide: CommandInvokerService, useValue: cmdSpy },
                { provide: MouseWordPlacerCompanionService, useValue: companionSpy },
            ],
        });
        gridSpy = jasmine.createSpyObj('GridService', ['getCell']); // Every method I need
        rackSpy = jasmine.createSpyObj('RackService', ['drawExistingLetters']);
        gameSpy = jasmine.createSpyObj('GameService', ['currentGameService']);
        cmdSpy = jasmine.createSpyObj('CommandInvokerService', ['']);
        companionSpy = jasmine.createSpyObj('MouseWordPlacerCompanionService', ['convertPositionToGridIndex', 'findPreviousSquare']);
        const soloSpy = jasmine.createSpyObj('SoloGameService', ['game']);
        const paramSpy = jasmine.createSpyObj('GameParameters', ['localPlayer']);
        const playerSpy = jasmine.createSpyObj('Player', ['isActive']);
        playerSpy.isActive = true;
        paramSpy.localPlayer = playerSpy;
        soloSpy.game = paramSpy;
        gameSpy.currentGameService = soloSpy;
        service = TestBed.inject(MouseWordPlacerService);
        ctxSpy = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.overlayContext = ctxSpy;
        const POSITION = 300;
        service.initialPosition = new Vec2(POSITION, POSITION);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('onKeyDown should only consider Backspace, Enter, Escape, or a letter on the keyboard', () => {
        const removeSpy = spyOn(service, 'removeLetter').and.callThrough();
        const confirmSpy = spyOn(service, 'confirmWord').and.callThrough();
        const blurSpy = spyOn(service, 'onBlur').and.callThrough();
        const findPlaceSpy = spyOn(service, 'findPlaceForLetter').and.callThrough();
        const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
        service.onKeyDown(backspaceEvent);
        expect(removeSpy).toHaveBeenCalled();
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        service.onKeyDown(enterEvent);
        expect(confirmSpy).toHaveBeenCalled();
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        service.onKeyDown(escapeEvent);
        expect(blurSpy).toHaveBeenCalled();
        const letterEvent = new KeyboardEvent('keydown', { key: 'a' });
        service.onKeyDown(letterEvent);
        expect(findPlaceSpy).toHaveBeenCalled();
        const noneEvent = new KeyboardEvent('keydown', { key: 'Alt' });
        service.onKeyDown(noneEvent);
        expect(removeSpy).not.toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
        expect(blurSpy).not.toHaveBeenCalled();
        expect(findPlaceSpy).not.toHaveBeenCalled();
    });
    it('onBlur should clear the canvas and remove all letters', () => {
        const removeSpy = spyOn(service, 'removeAllLetters').and.callThrough();
        const clearSpy = spyOn(service, 'clearOverlay').and.callThrough();
        service.onBlur();
        expect(removeSpy).toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalled();
    });
});
