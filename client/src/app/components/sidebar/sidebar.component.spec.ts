import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { PlayerType, VirtualPlayer } from '@app/classes/virtual-player';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { LetterStock } from '@app/services/letter-stock.service';
import { SoloGameService } from '@app/services/solo-game.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-explicit-any */
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;

    beforeEach(async () => {
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['localPlayer', 'virtualPlayer', 'stock', 'isEndGame']);
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [MatCardModule],
            providers: [{ provide: SoloGameService, useValue: soloGameServiceSpy }],
        }).compileComponents();

        const firstLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const secondLetter: ScrabbleLetter = new ScrabbleLetter('p', 3);
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('u', 4);
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter('m', 3);

        soloGameServiceSpy.localPlayer = new LocalPlayer('Arianne');
        soloGameServiceSpy.localPlayer.score = 73;
        soloGameServiceSpy.localPlayer.letters = [firstLetter, secondLetter, thirdLetter, fourthLetter];

        soloGameServiceSpy.virtualPlayer = new VirtualPlayer('Sara', PlayerType.Easy);
        soloGameServiceSpy.virtualPlayer.score = 70;
        soloGameServiceSpy.virtualPlayer.letters = [firstLetter, thirdLetter, firstLetter];
        soloGameServiceSpy.stock = new LetterStock();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getPlayer1LetterCount should return the right count', () => {
        component.getPlayer1LetterCount();
        expect(component.getPlayer1LetterCount()).toEqual(4);
    });

    it('getPlayer1Score should return the right score', () => {
        component.getPlayer1Score();
        expect(component.getPlayer1Score()).toEqual(73);
    });

    it('isEndGame should return the right boolean representing the end of the game', () => {
        expect(component.isEndGame()).toEqual(soloGameServiceSpy.isEndGame);
    });

    it('isEndGame should call getWinnerName', () => {
        const spy = spyOn(component, 'getWinnerName');
        component.isEndGame();
        expect(spy).toHaveBeenCalled();
    });

    it('hasWinner should return true if at least one player is a winner', () => {
        soloGameServiceSpy.localPlayer.isWinner = false;
        soloGameServiceSpy.virtualPlayer.isWinner = false;
        expect(component.hasWinner()).toBeFalse();

        soloGameServiceSpy.localPlayer.isWinner = true;
        expect(component.hasWinner()).toBeTrue();

        soloGameServiceSpy.virtualPlayer.isWinner = true;
        expect(component.hasWinner()).toBeTrue();
    });

    it('isDrawnGame should return true if both players are winners', () => {
        soloGameServiceSpy.localPlayer.isWinner = false;
        soloGameServiceSpy.virtualPlayer.isWinner = false;
        expect(component.isDrawnGame()).toBeFalse();

        soloGameServiceSpy.localPlayer.isWinner = true;
        expect(component.isDrawnGame()).toBeFalse();

        soloGameServiceSpy.virtualPlayer.isWinner = true;
        expect(component.isDrawnGame()).toBeTrue();
    });

    it('getWinnerName should call isDrawnGame', () => {
        const spy = spyOn(component, 'isDrawnGame');
        component.getWinnerName();
        expect(spy).toHaveBeenCalled();
    });

    it('getWinnerName should return the name of the winner', () => {
        soloGameServiceSpy.localPlayer.isWinner = true;
        soloGameServiceSpy.virtualPlayer.isWinner = false;
        component.getWinnerName();
        expect(component.winnerName).toEqual(soloGameServiceSpy.localPlayer.name);

        soloGameServiceSpy.localPlayer.isWinner = false;
        soloGameServiceSpy.virtualPlayer.isWinner = true;
        component.getWinnerName();
        expect(component.winnerName).toEqual(soloGameServiceSpy.virtualPlayer.name);
    });

    it('getWinnerName should return names of both players if isDrawnGame', () => {
        soloGameServiceSpy.localPlayer.isWinner = true;
        soloGameServiceSpy.virtualPlayer.isWinner = true;
        component.getWinnerName();
        expect(component.winnerName).toEqual(soloGameServiceSpy.localPlayer.name + ' et ' + soloGameServiceSpy.virtualPlayer.name);
    });
});
