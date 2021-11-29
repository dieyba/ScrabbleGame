import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { StartingPageComponent } from './starting-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('StartingPageComponent', () => {
    let component: StartingPageComponent;
    let fixture: ComponentFixture<StartingPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartingPageComponent],
            imports: [HttpClientModule, MatDialogModule, RouterTestingModule],
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
