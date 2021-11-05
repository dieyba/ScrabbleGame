import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameListService } from '@app/services/game-list.service';
import { EndGamePopupComponent } from './end-game-popup.component';


describe('EndGamePopupComponent', () => {
  let component: EndGamePopupComponent;
  let fixture: ComponentFixture<EndGamePopupComponent>;
  let gameListServiceSpy: jasmine.SpyObj<GameListService>;

  beforeEach(async () => {
    gameListServiceSpy = jasmine.createSpyObj('GameListService', ['disconnectUser']);
    await TestBed.configureTestingModule({
      declarations: [EndGamePopupComponent],
      providers: [{ provide: GameListService, useValue: gameListServiceSpy }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndGamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
