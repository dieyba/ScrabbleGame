import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClassicModeComponent } from './classic-mode.component';
// import SpyObj = jasmine.SpyObj;
// class MockMatDialog {}
describe('ClassicModeComponent', () => {
    let component: ClassicModeComponent;
    let fixture: ComponentFixture<ClassicModeComponent>;
    // let mock : SpyObj<ClassicModeComponent>;
    // let mockDialogRef = {
    //     dialog: jasmine.createSpyObj('dialog', ['open']),
    // };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClassicModeComponent],
            imports: [BrowserAnimationsModule, MatDialogModule],
        }).compileComponents();
        // component = TestBed.get(ClassicModeComponent);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassicModeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    // it('should call openDialog', () => {
    //     component.openDialog();
    //     expect(mockDialogRef.dialog.open()).toHaveBeenCalled();
    // });
});
