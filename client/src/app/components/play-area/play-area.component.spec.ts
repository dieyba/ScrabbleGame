import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { GridService } from '@app/services/grid.service';
import { SoloGameService } from '@app/services/solo-game.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;

    beforeEach(async () => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['sizeUpLetters', 'sizeDownLetters', 'drawGrid', 'drawColors']);
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['localPlayer', 'virtualPlayer']);
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [{ provide: GridService, useValue: gridServiceSpy }, { provide: SoloGameService, useValue: soloGameServiceSpy }]
        }).compileComponents();

        const letter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        soloGameServiceSpy.localPlayer = {
            name: 'Ariane',
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            score: 73,
            letters: [letter],
            isActive: false,
        };
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it ('ngAfterViewInit should call drawGrid and drawColors', () => {
        component.ngAfterViewInit();
        expect(soloGameServiceSpy.createNewGame).toHaveBeenCalled;
        expect(gridServiceSpy.drawGrid).toHaveBeenCalled;
        expect(gridServiceSpy.drawColors).toHaveBeenCalled;
    });

    it ('sizeUpLetters should call gridservices sizeUpLetters', () => {
        component.sizeUpLetters();
        expect(gridServiceSpy.sizeUpLetters).toHaveBeenCalled;
    });

    it ('sizeDownLetters should call gridservices sizeDownLetters', () => {
        component.sizeDownLetters();
        expect(gridServiceSpy.sizeDownLetters).toHaveBeenCalled;
    });

    it ('passTurn should call soloGameservices passTurn', () => {
        component.passTurn();
        expect(soloGameServiceSpy.passTurn).toHaveBeenCalled;
    });
});
