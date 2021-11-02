import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { GameParameters, GameType } from '@app/classes/game-parameters';
import { LetterStock } from '@app/services/letter-stock.service';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { GameService } from '@app/services/game.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;

    beforeEach(async () => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['currentGameService', 'initializeGameType']);
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [MatCardModule],
            providers: [{ provide: GameService, useValue: gameServiceSpy }],
        }).compileComponents();

        const firstLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const secondLetter: ScrabbleLetter = new ScrabbleLetter('p', 3);
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('u', 4);
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter('m', 3);

        gameServiceSpy.initializeGameType(GameType.Solo);
        gameServiceSpy.currentGameService.game = new GameParameters('Ariane', 60, false);
        gameServiceSpy.currentGameService.game.creatorPlayer = new LocalPlayer('Ariane');
        gameServiceSpy.currentGameService.game.creatorPlayer.score = 73;
        gameServiceSpy.currentGameService.game.creatorPlayer.letters = [firstLetter, secondLetter, thirdLetter, fourthLetter];

        gameServiceSpy.currentGameService.game.opponentPlayer = new VirtualPlayer('Sara', Difficulty.Easy);
        gameServiceSpy.currentGameService.game.opponentPlayer.score = 70;
        gameServiceSpy.currentGameService.game.opponentPlayer.letters = [firstLetter, thirdLetter, firstLetter];
        gameServiceSpy.currentGameService.game.stock = new LetterStock();
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
