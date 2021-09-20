import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormComponent],
            imports: [FormsModule, ReactiveFormsModule],
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

    it('should return a value between the minimum and the maxmimum', () => {
        const minimum: number = 3;
        const maximum: number = 10;

        expect(component.randomNumber(minimum, maximum)).toBeLessThan(maximum);
        expect(component.randomNumber(minimum, maximum)).toBeGreaterThanOrEqual(minimum);
    });

    it('should call randomNumber() method', () => {
        const spy = spyOn(component, 'randomNumber');
        let expertNameList: string[] = ['dieyna', 'kevin', 'arianne'];

        component.randomPlayer(expertNameList);
        expect(spy).toHaveBeenCalled();
    });

    it('check initial form value', () => {
        let initialForm = new FormComponent();
        initialForm.name = '';
        initialForm.timer = 60;
        initialForm.bonus = false;
        initialForm.dictionnary = 'Francais(defaut)';
        initialForm.debutantNameList = ['erika', 'etienne', 'sara'];
        initialForm.expertNameList = ['dieyna', 'kevin', 'arianne'];

        //expect(component).toEqual(initialForm);
        expect(component.name).toEqual(initialForm.name);
        expect(component.timer).toEqual(initialForm.timer);
        expect(component.bonus).toEqual(initialForm.bonus);
        expect(component.dictionnary).toEqual(initialForm.dictionnary);
        expect(component.debutantNameList).toEqual(initialForm.debutantNameList);
        expect(component.expertNameList).toEqual(initialForm.expertNameList);
    });
});
