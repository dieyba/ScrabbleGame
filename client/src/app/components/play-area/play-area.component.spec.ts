import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';

/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [MatCardModule],
        });
        gridServiceSpy = jasmine.createSpyObj('GridService', ['sizeUpLetters', 'sizeDownLetters', 'drawGrid', 'drawColors', 'drawLetter']);
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', [
            'localPlayer',
            'virtualPlayer',
            'createNewGame',
            'passTurn',
            'changeActivePlayer',
            'removeRackLetter',
        ]);
        // pour les properties, cette faôn de faire empêche les modifs. check sur le lien suivant pour modifer ça.
        // https://stackoverflow.com/questions/64560390/jasmine-createspyobj-with-properties
        rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'deselectForExchange', 'selectForExchange'], {
            ['exchangeSelected']: [false, false, false, false, false, false, false],
        });
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: SoloGameService, useValue: soloGameServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
            ],
        }).compileComponents();

        gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
        const letter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        soloGameServiceSpy.game.creatorPlayer = new LocalPlayer('Ariane');
        soloGameServiceSpy.game.creatorPlayer.score = 73;
        soloGameServiceSpy.game.creatorPlayer.letters = [letter];
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit should call drawGrid and drawColors', () => {
        component.ngAfterViewInit();
        expect(soloGameServiceSpy.createNewGame).toHaveBeenCalled();
        expect(gridServiceSpy.drawGrid).toHaveBeenCalled();
        expect(gridServiceSpy.drawColors).toHaveBeenCalled();
    });

    it('sizeUpLetters should call gridservices sizeUpLetters', () => {
        component.sizeUpLetters();
        expect(gridServiceSpy.sizeUpLetters).toHaveBeenCalled();
    });

    it('sizeDownLetters should call gridservices sizeDownLetters', () => {
        component.sizeDownLetters();
        expect(gridServiceSpy.sizeDownLetters).toHaveBeenCalled();
    });

    it('passTurn should call soloGameservices passTurn', () => {
        component.passTurn();
        expect(soloGameServiceSpy.passTurn).toHaveBeenCalled();
    });
});
