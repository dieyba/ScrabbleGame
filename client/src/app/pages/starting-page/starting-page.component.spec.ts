import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BestScoresComponent } from '@app/components/best-scores/best-scores.component';
import { Observable } from 'rxjs';
import { StartingPageComponent } from './starting-page.component';

/* eslint-disable dot-notation */
describe('StartingPageComponent', () => {
    let component: StartingPageComponent;
    let fixture: ComponentFixture<StartingPageComponent>;
    // let matdialog: jasmine.Spy;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartingPageComponent],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {
                        moduleDef: BestScoresComponent,
                        open: () => new Observable(),
                    },
                },
            ],
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
    it('should call openDialog', () => {
        // const dialogRefSpyObj = jasmine.createSpyObj({ close: false });
        // matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        // component.openDialog();
        // expect(matdialog).toHaveBeenCalled();
        const spy = spyOn(component['dialog'], 'open');
        component.openDialog();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
