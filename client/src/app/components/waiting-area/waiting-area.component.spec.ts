import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WaitingAreaComponent } from './waiting-area.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
describe('WaitingAreaComponent', () => {
    let component: WaitingAreaComponent;
    let fixture: ComponentFixture<WaitingAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingAreaComponent],
            imports: [
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                RouterTestingModule,
                MatDialogModule,
            ],
            providers: [
                { provide: MatDialogRef, useValue: { close: () => {} } }, // eslint-disable-line @typescript-eslint/no-empty-function
                { provide: Router, useValue: { navigate: () => new Observable() } },
                { provide: MatDialog, useValue: { open: () => new Observable() } }
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
