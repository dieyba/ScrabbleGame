import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClassicModeComponent } from './classic-mode.component';

describe('ClassicModeComponent', () => {
    let component: ClassicModeComponent;
    let fixture: ComponentFixture<ClassicModeComponent>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClassicModeComponent],
            imports: [BrowserAnimationsModule, MatDialogModule],
        }).compileComponents();
        component = TestBed.get(ClassicModeComponent);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassicModeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call openDialog', () => {
        component.openDialog();
        expect(mockDialogRef.open()).toHaveBeenCalled();
    });
});
