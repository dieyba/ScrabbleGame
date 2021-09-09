import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrabbleWordComponent } from './scrabble-word.component';

describe('ScrabbleWordComponent', () => {
  let component: ScrabbleWordComponent;
  let fixture: ComponentFixture<ScrabbleWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrabbleWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrabbleWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
