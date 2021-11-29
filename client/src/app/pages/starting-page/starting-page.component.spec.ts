import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { StartingPageComponent } from './starting-page.component';

describe('StartingPageComponent', () => {
    let component: StartingPageComponent;
    let fixture: ComponentFixture<StartingPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartingPageComponent],
            imports: [MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StartingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
