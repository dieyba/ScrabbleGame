import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { LetterStock } from '@app/classes/letter-stock';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { SoloGameService } from '@app/services/solo-game.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;

    beforeEach(async () => {
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['game']);
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [MatCardModule],
            providers: [{ provide: SoloGameService, useValue: soloGameServiceSpy }],
        }).compileComponents();

        const firstLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const secondLetter: ScrabbleLetter = new ScrabbleLetter('p', 3);
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('u', 4);
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter('m', 3);

        soloGameServiceSpy.game.creatorPlayer = new LocalPlayer('Arianne');
        soloGameServiceSpy.game.creatorPlayer.score = 73;
        soloGameServiceSpy.game.creatorPlayer.letters = [firstLetter, secondLetter, thirdLetter, fourthLetter];

        soloGameServiceSpy.game.opponentPlayer = new VirtualPlayer('Sara', Difficulty.Easy);
        soloGameServiceSpy.game.opponentPlayer.score = 70;
        soloGameServiceSpy.game.opponentPlayer.letters = [firstLetter, thirdLetter, firstLetter];
        soloGameServiceSpy.game.stock = new LetterStock();
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
