import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { PlayerType, VirtualPlayer } from '@app/classes/virtual-player';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { SoloGameService } from '@app/services/solo-game.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;

    beforeEach(async () => {
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['localPlayer', 'virtualPlayer']);
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
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
});
