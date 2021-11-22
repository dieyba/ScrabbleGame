import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualPlayerNameManagerComponent } from './virtual-player-name-manager.component';

describe('VirtualPlayerNameManagerComponent', () => {
  let component: VirtualPlayerNameManagerComponent;
  let fixture: ComponentFixture<VirtualPlayerNameManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualPlayerNameManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualPlayerNameManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
