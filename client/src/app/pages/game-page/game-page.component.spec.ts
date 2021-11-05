import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { GameParameters, GameType } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ChatDisplayComponent } from '@app/components/chat-display/chat-display.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { GameService } from '@app/services/game.service';
import { LetterStock } from '@app/services/letter-stock.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;

    beforeEach(async () => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['currentGameService', 'initializeGameType']);
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['initializeGame', 'createNewGame', 'getLettersSelected']);
        rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'deselectForExchange', 'selectForExchange'], {
            ['exchangeSelected']: [false, false, false, false, false, false, false],
        });
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent, ChatDisplayComponent],
            imports: [RouterModule, MatDialogModule],
            providers: [
                { provide: Router, useValue: { navigate: () => new Observable() } },
                { provide: MatDialog, useValue: { open: () => new Observable() } },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
            ],
        }).compileComponents();
        const firstLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const secondLetter: ScrabbleLetter = new ScrabbleLetter('p', 3);
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('u', 4);
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter('m', 3);

        gameServiceSpy.initializeGameType(GameType.Solo);
        gameServiceSpy.currentGameService = soloGameServiceSpy;
        gameServiceSpy.currentGameService.game = new GameParameters('Ari', 60, false);
        gameServiceSpy.currentGameService.game.creatorPlayer = new LocalPlayer('Ariane');
        gameServiceSpy.currentGameService.game.creatorPlayer.score = 73;
        gameServiceSpy.currentGameService.game.creatorPlayer.letters = [firstLetter, secondLetter, thirdLetter, fourthLetter];
        gameServiceSpy.currentGameService.game.localPlayer = gameServiceSpy.currentGameService.game.creatorPlayer;
        gameServiceSpy.currentGameService.game.opponentPlayer = new LocalPlayer('Sara');
        gameServiceSpy.currentGameService.game.opponentPlayer.score = 70;
        gameServiceSpy.currentGameService.game.opponentPlayer.letters = [firstLetter, thirdLetter, firstLetter];
        gameServiceSpy.currentGameService.game.stock = new LetterStock();
        gameServiceSpy.currentGameService.game.opponentPlayer.isActive = false;
        gameServiceSpy.currentGameService.game.localPlayer.isActive = true;
        soloGameServiceSpy.opponentPlayerSubject = new BehaviorSubject<boolean>(gameServiceSpy.currentGameService.game.localPlayer.isActive);
        soloGameServiceSpy.opponentPlayerObservable = soloGameServiceSpy.opponentPlayerSubject.asObservable();
        soloGameServiceSpy.opponentPlayerSubject.next(true);
    });
    beforeEach(() => {
        TestBed.createComponent(SidebarComponent);
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
