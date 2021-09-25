import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    /*
    const firstLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
    const secondLetter: ScrabbleLetter = new ScrabbleLetter('p', 3);
    const thirdLetter: ScrabbleLetter = new ScrabbleLetter('u', 4);
    const fourthLetter: ScrabbleLetter = new ScrabbleLetter('m', 3);
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
    };*/

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
});
