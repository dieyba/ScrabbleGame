/* eslint-disable dot-notation */
import { HttpClientModule, HttpStatusCode } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BASE_URL, BestScores, BestScoresService } from '@app/services/best-scores.service';
import { of, throwError } from 'rxjs';
import { BestScoresComponent } from './best-scores.component';
/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
describe('BestScoresComponent', () => {
    let component: BestScoresComponent;
    let fixture: ComponentFixture<BestScoresComponent>;
    let bestScoresServiceSpy: jasmine.SpyObj<BestScoresService>;
    const defaultClassicBestScoresValue = [
        {
            playerName: 'Erika',
            score: 1,
        },
        {
            playerName: 'Sara',
            score: 8,
        },
        {
            playerName: 'Etienne',
            score: 2,
        },
    ] as BestScores[];
    beforeEach(async () => {
        bestScoresServiceSpy = jasmine.createSpyObj('BestScoresService', ['getBestScores', 'handleErrorSnackBar']);
        bestScoresServiceSpy.getBestScores.and.callFake(() => {
            return of(defaultClassicBestScoresValue);
        });
        await TestBed.configureTestingModule({
            declarations: [BestScoresComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {
                        moduleDef: BestScoresComponent,
                        close: () => null,
                    },
                },
                {
                    provide: BestScoresService,
                    useValue: bestScoresServiceSpy,
                },
            ],
            imports: [HttpClientModule, MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BestScoresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getClassicBestScores should handle error when getting', () => {
        bestScoresServiceSpy.getBestScores.and.callFake(() => throwError({ status: HttpStatusCode.NotFound }));
        component.getClassicBestScores(BASE_URL + '/classicMode');
        expect(bestScoresServiceSpy.handleErrorSnackBar).toHaveBeenCalled();
    });
    it('getLog2990BestScores should handle error when getting', () => {
        bestScoresServiceSpy.getBestScores.and.callFake(() => throwError({ status: HttpStatusCode.NotFound }));
        component.getLog2990BestScores(BASE_URL + '/classicMode');
        expect(bestScoresServiceSpy.handleErrorSnackBar).toHaveBeenCalled();
    });

    it('closeDialog shoud close dialog', () => {
        const spy = spyOn(component['dialogRef'], 'close');
        component.closeDialog();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
