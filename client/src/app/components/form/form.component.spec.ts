// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RouterTestingModule } from '@angular/router/testing';
// import { FormComponent } from './form.component';

// describe('FormComponent', () => {
//     let component: FormComponent;
//     let fixture: ComponentFixture<FormComponent>;
//     let list: string[] = ['dieyna', 'kevin', 'ariane'];
//     let dialog: jasmine.SpyObj<MatDialogRef<FormComponent>> = jasmine.createSpyObj('dialog', ['close']);
//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             declarations: [FormComponent],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA],
//             imports: [
//                 MatRadioModule,
//                 MatCardModule,
//                 MatCheckboxModule,
//                 MatFormFieldModule,
//                 MatInputModule,
//                 RouterTestingModule,
//                 MatSelectModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 MatDialogModule,
//                 BrowserAnimationsModule,
//             ],
//             providers: [{ provide: MatDialogRef, useValue: dialog }],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(FormComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
//     it('should call close() ', () => {
//         component.closeDialog();
//         expect(dialog.close()).toHaveBeenCalled;
//     });
//     it('should call randomPlayer() ', () => {
//         component.selectedPlayer = 'dieyna';
//         const spy = spyOn(component, 'randomPlayer').and.stub();
//         component.name = new FormControl('dieyna');
//         component.changeName(list);
//         expect(spy).toHaveBeenCalled();
//     });
//     it('should not call randomPlayer() ', () => {
//         component.selectedPlayer = 'kevin';
//         const spy = spyOn(component, 'randomPlayer').and.stub();
//         component.name = new FormControl('dieyna');
//         component.changeName(list);
//         expect(spy).not.toHaveBeenCalled;
//     });

//     it('should return a value between the minimum and the maxmimum', () => {
//         const minimum: number = 3;
//         const maximum: number = 10;

//         expect(component.randomNumber(minimum, maximum)).toBeLessThan(maximum);
//         expect(component.randomNumber(minimum, maximum)).toBeGreaterThanOrEqual(minimum);
//     });

//     it('should call randomNumber() method', () => {
//         const spy = spyOn(component, 'randomNumber');
//         component.randomPlayer(list);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('form invalid when empty', () => {
//         expect(component.myForm.valid).toBeFalsy();
//     });

//     it('form valid when submit', () => {
//         const spy = spyOn(component, 'closeDialog');
//         component.myForm.controls['name'].setValue('dieyna');
//         component.myForm.controls['timer'].setValue('1:00');
//         component.myForm.controls['level'].setValue('easy');
//         component.myForm.controls['dictionnary1'].setValue('Francais');
//         component.submit();
//         expect(component.myForm.valid).toBeTrue();
//         expect(spy).toHaveBeenCalled();
//     });
// });
