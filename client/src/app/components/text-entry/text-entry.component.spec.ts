import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEntryComponent } from './text-entry.component';

describe('TextEntryComponent', () => {
  let component: TextEntryComponent;
  let fixture: ComponentFixture<TextEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
