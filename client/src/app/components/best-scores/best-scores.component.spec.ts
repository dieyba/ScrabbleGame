import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestScoresComponent } from './best-scores.component';

describe('BestScoresComponent', () => {
  let component: BestScoresComponent;
  let fixture: ComponentFixture<BestScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestScoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
