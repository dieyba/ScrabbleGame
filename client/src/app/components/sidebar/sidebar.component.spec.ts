import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { PlayerType } from '@app/classes/virtual-player';
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
        soloGameServiceSpy.localPlayer = {
            name: 'Ariane',
            score: 73,
            letters: [firstLetter, secondLetter, thirdLetter, fourthLetter],
            isActive: false,
        };

        soloGameServiceSpy.virtualPlayer = {
            name: 'Sara',
            score: 70,
            letters: [firstLetter, thirdLetter, firstLetter],
            isActive: true,
            type: PlayerType.Easy,
            // eslint-disable-next-line no-empty-function
            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
            playTurn() {
                /* Nothing */
            },
        };
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
