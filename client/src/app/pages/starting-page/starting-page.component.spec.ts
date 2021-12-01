import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BestScoresComponent } from '@app/components/best-scores/best-scores.component';
import { Observable } from 'rxjs';
import { StartingPageComponent } from './starting-page.component';

describe('StartingPageComponent', () => {
    let component: StartingPageComponent;
    let fixture: ComponentFixture<StartingPageComponent>;
    // let matdialog: jasmine.Spy;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartingPageComponent],
            imports: [HttpClientModule, MatDialogModule, RouterTestingModule],
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
        // eslint-disable-next-line dot-notation
        const spy = spyOn(component['dialog'], 'open');
        component.openDialog();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
