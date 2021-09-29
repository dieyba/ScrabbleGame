import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { PlayerType, VirtualPlayer } from '@app/classes/virtual-player';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

describe('GameService', () => {
    let service: SoloGameService;
    let changeActivePlayerSpy: jasmine.Spy<any>;
    let secondsToMinutesSpy: jasmine.Spy<any>;
    let startCountdownSpy: jasmine.Spy<any>;
    let drawRackLettersSpy: jasmine.Spy<any>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        rackServiceSpy = jasmine.createSpyObj('RackService', ['gridContext', 'drawLetter']);
        TestBed.configureTestingModule({
            providers: [{ provide: RackService, useValue: rackServiceSpy }],
        });
        service = TestBed.inject(SoloGameService);
        changeActivePlayerSpy = spyOn<any>(service, 'changeActivePlayer').and.callThrough();
        secondsToMinutesSpy = spyOn<any>(service, 'secondsToMinutes').and.callThrough();
        startCountdownSpy = spyOn<any>(service, 'startCountdown').and.callThrough();
        drawRackLettersSpy = spyOn<any>(service, 'drawRackLetters').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeGame should set variables to right value', () => {
        const level = new FormControl('easy', [Validators.required]);
        const name = new FormControl('Ariane', [Validators.required, Validators.pattern('[a-zA-Z]*')]);
        const timer = new FormControl('60', [Validators.required]);
        const bonus = new FormControl(false);
        const dictionaryForm = new FormControl('0', [Validators.required]);
        const opponent = new FormControl('Sara');
        const myForm = new FormGroup({
            name: name,
            timer: timer,
            bonus: bonus,
            dictionaryForm: dictionaryForm,
            level: level,
            opponent: opponent,
        });
        service.initializeGame(myForm);
        expect(service.localPlayer.name).toEqual('Ariane');
        expect(service.localPlayer.letters.length).toEqual(7);
        expect(service.localPlayer.isActive).toEqual(true);
        expect(service.virtualPlayer.name).toEqual('Sara');
        expect(service.virtualPlayer.letters.length).toEqual(7);
        expect(service.totalCountDown).toEqual(60);
        expect(service.timerMs).toEqual(60);
        expect(service.dictionary.title).toEqual('Mon dictionnaire');
        expect(service.randomBonus).toEqual(false);
    });

    it('createNewGame should clear scrabble board ans fill rack', () => {
        service.localPlayer = new LocalPlayer('Ariane');
        const firstLetter: ScrabbleLetter = new ScrabbleLetter('D', 1);
        const secondLetter: ScrabbleLetter = new ScrabbleLetter('e', 2);
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('j', 3);
        service.localPlayer.letters = [firstLetter, secondLetter, thirdLetter];
        rackServiceSpy.gridContext = ctxStub;
        service.createNewGame();
        expect(rackServiceSpy.drawLetter).toHaveBeenCalled();
        expect(drawRackLettersSpy).toHaveBeenCalled();
        expect(startCountdownSpy).toHaveBeenCalled();
    });

    it('secondsToMinutes should convert ms to string format ss:msms', () => {
        service.timerMs = 150;
        service.secondsToMinutes();
        expect(service.timer).toEqual('2:30');
    });

    it('secondsToMinutes should convert ms to string format ss:0ms', () => {
        service.timerMs = 67;
        service.secondsToMinutes();
        expect(service.timer).toEqual('1:07');
    });

    it('when localPlayer is active, changeActivePlayer should set virtualPlayer to active', () => {
        service.localPlayer = new LocalPlayer('Ariane');
        service.virtualPlayer = new VirtualPlayer('Sara', PlayerType.Easy);
        service.localPlayer.isActive = true;
        service.changeActivePlayer();
        expect(secondsToMinutesSpy).toHaveBeenCalled();
        expect(startCountdownSpy).toHaveBeenCalled();
        expect(service.localPlayer.isActive).toEqual(false);
        expect(service.virtualPlayer.isActive).toEqual(true);
    });

    it('when virtualPlayer is active, changeActivePlayer should set localPlayer to active', () => {
        service.localPlayer = new LocalPlayer('Ariane');
        service.virtualPlayer = new VirtualPlayer('Sara', PlayerType.Easy);
        service.virtualPlayer.isActive = true;
        service.changeActivePlayer();
        expect(service.localPlayer.isActive).toEqual(true);
        expect(service.virtualPlayer.isActive).toEqual(false);
    });

    it('passTurn should make virtualPlayer active and clear interval', () => {
        service.localPlayer = new LocalPlayer('Ariane');
        service.virtualPlayer = new VirtualPlayer('Sara', PlayerType.Easy);
        service.localPlayer.isActive = true;
        service.passTurn();
        expect(changeActivePlayerSpy).toHaveBeenCalled();
        expect(secondsToMinutesSpy).toHaveBeenCalled();
        expect(service.localPlayer.isActive).toEqual(false);
        expect(service.virtualPlayer.isActive).toEqual(true);
    });
});