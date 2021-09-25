import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    const firstLetter: ScrabbleLetter = new ScrabbleLetter();
    firstLetter.character = 'a';
    const secondLetter: ScrabbleLetter = new ScrabbleLetter();
    secondLetter.character = 'p';
    const thirdLetter: ScrabbleLetter = new ScrabbleLetter();
    thirdLetter.character = 'u';
    const fourthLetter: ScrabbleLetter = new ScrabbleLetter();
    fourthLetter.character = 'm';
    const player1 = {
        name: 'Ariane',
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        score: 73,
        letters: [firstLetter, secondLetter, thirdLetter, fourthLetter],
        isActive: false,
    };

    const player2 = {
        name: 'Sara',
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        score: 70,
        letters: [firstLetter, thirdLetter, firstLetter],
        isActive: true,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initializePlayers should set right values for player1 and player2', () => {
        component.initializePlayers(/* [player1, player2]*/);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(component.player1.score).toEqual(73);
        expect(component.player1.name).toEqual('Ariane');
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(component.player2.score).toEqual(70);
        expect(component.player2.name).toEqual('Sara');
        expect(component.player1.isActive).toEqual(false);
        expect(component.player2.isActive).toEqual(true);
    });

    it('getPlayer1LetterCount should get the right letter count', () => {
        component.player1 = player1;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(component.player1LetterCount).toEqual(4);
    });

    it('getPlayer2LetterCount should get the right letter count', () => {
        component.player1 = player2;
        expect(component.player2LetterCount).toEqual(3);
    });
});
