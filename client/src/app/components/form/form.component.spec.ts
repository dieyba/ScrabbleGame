import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    const list: string[] = ['dieyna', 'kevin', 'ariane'];
    let dialogSpy: jasmine.Spy;
    let matdialog: jasmine.Spy;
    // let dialog: jasmine.SpyObj<MatDialogRef<FormComponent>> = jasmine.createSpyObj('dialog', ['close']);
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                MatRadioModule,
                MatCardModule,
                MatCheckboxModule,
                MatFormFieldModule,
                MatInputModule,
                RouterTestingModule,
                MatSelectModule,
                FormsModule,
                ReactiveFormsModule,
                MatDialogModule,
                BrowserAnimationsModule,
                RouterModule,
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: { close: () => {} } }, // eslint-disable-line @typescript-eslint/no-empty-function
                { provide: Router, useValue: { navigate: () => new Observable() } },
                { provide: MatDialog, useValue: { open: () => new Observable() } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call close() ', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: true });
        dialogSpy = spyOn(TestBed.get(MatDialogRef), 'close').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.closeDialog();
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('should call randomPlayer() ', () => {
        component.selectedPlayer = 'dieyna';
        const spy = spyOn(component, 'randomPlayer').and.stub();
        component.name = new FormControl('dieyna');
        component.changeName(list);
        expect(spy).toHaveBeenCalled();
    });

    it('should not call randomPlayer() ', () => {
        component.selectedPlayer = 'kevin';
        const spy = spyOn(component, 'randomPlayer').and.stub();
        component.name = new FormControl('dieyna');
        component.changeName(list);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should return a value between the minimum and the maxmimum', () => {
        const minimum = 3;
        const maximum = 10;

        expect(component.randomNumber(minimum, maximum)).toBeLessThan(maximum);
        expect(component.randomNumber(minimum, maximum)).toBeGreaterThanOrEqual(minimum);
    });

    it('should call randomNumber() method', () => {
        const spy = spyOn(component, 'randomNumber');
        component.randomPlayer(list);
        expect(spy).toHaveBeenCalled();
    });

    it('form invalid when empty', () => {
        component.submit();
        expect(component.myForm.valid).toBeFalsy();
    });

    it('form valid when submit', () => {
        component.myForm.setValue({
            name: 'dieyna',
            timer: '1:00',
            bonus: true,
            level: 'easy',
            dictionaryForm: 'Francais',
            opponent: 'Sara',
        });
        component.submit();
        expect(component.myForm.valid).toBeTrue();
    });

    it('should call openDialog', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: false });
        matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.myForm.setValue({
            name: 'dieyna',
            timer: '1:00',
            bonus: true,
            level: 'easy',
            dictionaryForm: 'Francais',
            opponent: 'Sara',
        });
        component.isSolo = false;
        component.submit();
        expect(matdialog).toHaveBeenCalled();
    });

    it('should call router', () => {
        const routerRefSpyObj = jasmine.createSpyObj({ navigate: '/game' });
        const router = spyOn(TestBed.get(Router), 'navigate').and.returnValue(routerRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.myForm.setValue({
            name: 'dieyna',
            timer: '1:00',
            bonus: true,
            level: 'easy',
            dictionaryForm: 'Francais',
            opponent: 'Sara',
        });
        component.isSolo = true;
        component.submit();
        expect(router).toHaveBeenCalled();
    });

    it('convert() should open dialog', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: false });
        matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.convert();
        expect(matdialog).toHaveBeenCalled();
    });
});
