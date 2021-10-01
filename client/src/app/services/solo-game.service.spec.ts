import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ErrorType } from '@app/classes/errors';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { PlayerType, VirtualPlayer } from '@app/classes/virtual-player';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
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
        rackServiceSpy = jasmine.createSpyObj('RackService', ['gridContext', 'drawLetter', 'removeLetter']);
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
        const myForm = new FormGroup({ name, timer, bonus, dictionaryForm, level, opponent });
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

    it('createNewGame should clear scrabble board and fill rack', () => {
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

    it('passTurn not possible when local player is not active', () => {
        service.localPlayer = new LocalPlayer('Ariane');;
        service.localPlayer.isActive = false;
        let error = ErrorType.ImpossibleCommand;
        expect(service.passTurn()).toEqual(error);
    });

    // Test pour la fonction exchangeLetters
    it('exchangeLetter should call removeLetter of class Player if he is active and if there is at least 7 letters', () => {
        let spyPlayer: LocalPlayer = new LocalPlayer('sara');
        spyPlayer.letters = [new ScrabbleLetter('a', 1)];
        service.localPlayer = spyPlayer;

        const spy = spyOn(service.localPlayer, 'removeLetter').and.callThrough();
        expect(spy).not.toHaveBeenCalled();

        service.localPlayer.isActive = true;
        service.exchangeLetters('a');

        expect(spy).toHaveBeenCalled();
    });

    it('exchangeLetter should call addLetter, removeLetter(rack service) and drawLetter if the letters to exchange are removed with success', () => {
        let spyPlayer: LocalPlayer = new LocalPlayer('sara');
        spyPlayer.letters = [new ScrabbleLetter('a', 1)];
        service.localPlayer = spyPlayer;
        service.localPlayer.isActive = true;

        const spy = spyOn(service.localPlayer, 'addLetter').and.callThrough();
        service.exchangeLetters('b');
        expect(spy).not.toHaveBeenCalled();
        expect(rackServiceSpy.removeLetter).not.toHaveBeenCalled();
        expect(rackServiceSpy.drawLetter).not.toHaveBeenCalled();

        service.exchangeLetters('a');
        expect(spy).toHaveBeenCalled();
        expect(rackServiceSpy.removeLetter).toHaveBeenCalled();
        expect(rackServiceSpy.drawLetter).toHaveBeenCalled();
    });

    it('exchange not possible when local player dont have the letters or stock barely empty', () => {
        let spyPlayer: LocalPlayer = new LocalPlayer('sara');
        spyPlayer.letters = [new ScrabbleLetter('o', 1)];
        spyPlayer.isActive = true;
        service.localPlayer = spyPlayer;
        let error = ErrorType.ImpossibleCommand;
        expect(service.exchangeLetters('a')).toEqual(error);
    });

    it('exchange not possible when local player not active', () => {
        let spyPlayer: LocalPlayer = new LocalPlayer('sara');
        spyPlayer.isActive = false;
        service.localPlayer = spyPlayer;
        let error = ErrorType.ImpossibleCommand;

        expect(service.exchangeLetters('a')).toEqual(error);
    });
});
