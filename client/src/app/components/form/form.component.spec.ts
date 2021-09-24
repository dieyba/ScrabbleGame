import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    let dialog: jasmine.SpyObj<MatDialogRef<FormComponent>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormComponent],
            imports: [MatSelectModule, FormsModule, ReactiveFormsModule, MatDialogModule],
        }).compileComponents();
        dialog = TestBed.get(MatDialogRef);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call openDialog', () => {
        spyOn(dialog, 'close');
        component.closeDialog();
        expect(dialog.close()).toHaveBeenCalled;
    });

    // it('should return a value between the minimum and the maxmimum', () => {
    //     const minimum: number = 3;
    //     const maximum: number = 10;

    //     expect(component.randomNumber(minimum, maximum)).toBeLessThan(maximum);
    //     expect(component.randomNumber(minimum, maximum)).toBeGreaterThanOrEqual(minimum);
    // });

    // it('should call randomNumber() method', () => {
    //     const spy = spyOn(component, 'randomNumber');
    //     let expertNameList: string[] = ['dieyna', 'kevin', 'arianne'];

    //     component.randomPlayer(expertNameList);
    //     expect(spy).toHaveBeenCalled();
    // });

    // it('should call closeDialog', () => {
    //     const fixture = TestBed.createComponent(FormComponent);
    //     const app = fixture.componentInstance;
    //     app.closeDialog();
    // });
});
