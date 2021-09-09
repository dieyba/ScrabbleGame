import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrabbleLetterComponent } from './scrabble-letter.component';

describe('ScrabbleLetterComponent', () => {
  let component: ScrabbleLetterComponent;
  let fixture: ComponentFixture<ScrabbleLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrabbleLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrabbleLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
