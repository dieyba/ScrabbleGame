import { HttpClientModule, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BestScoresService } from '@app/services/best-scores.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { of, throwError } from 'rxjs';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let virtualPlayerNameServiceSpy: jasmine.SpyObj<VirtualPlayerNameService>;
    let bestScoreServiceSpy: jasmine.SpyObj<BestScoresService>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;

    beforeEach(async () => {
        virtualPlayerNameServiceSpy = jasmine.createSpyObj('VirtualPlayerNameService', ['reset']);
        bestScoreServiceSpy = jasmine.createSpyObj('BestScoresService', ['resetDbBestScores']);
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['reset']);

        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent],
            imports: [HttpClientModule, HttpClientTestingModule, MatSnackBarModule],
            providers: [
                { provide: VirtualPlayerNameService, useValue: virtualPlayerNameServiceSpy },
                { provide: BestScoresService, useValue: bestScoreServiceSpy },
                { provide: DictionaryService, useValue: dictionaryServiceSpy },
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('resetDataBase should call bestScoreService resetDbBestScores, virtualPlayerNameService reset and dictionaryService reset', () => {
        bestScoreServiceSpy.resetDbBestScores.and.callFake(() => {
            return of({ playerName: 'Riri', score: 1000 });
        });

        virtualPlayerNameServiceSpy.reset.and.callFake(() => {
            return of([{ _id: '4', name: 'Riri' }]);
        });

        dictionaryServiceSpy.reset.and.callFake(() => {
            return of({ _id: '4', title: 'test', description: 'just a test', words: ['Riri'] });
        });

        component.resetDataBase();

        expect(bestScoreServiceSpy.resetDbBestScores).toHaveBeenCalled();
        expect(virtualPlayerNameServiceSpy.reset).toHaveBeenCalled();
        expect(dictionaryServiceSpy.reset).toHaveBeenCalled();
    });

    it('resetDataBase should catch error when getting one', () => {
        const spy = spyOn(component['snack'], 'open');

        const errorResponse = new HttpErrorResponse({ status: HttpStatusCode.Ok });
        bestScoreServiceSpy.resetDbBestScores.and.returnValue(throwError(errorResponse));

        const errorResponse2 = new HttpErrorResponse({ status: HttpStatusCode.Ok });
        virtualPlayerNameServiceSpy.reset.and.returnValue(throwError(errorResponse2));

        const errorResponse3 = new HttpErrorResponse({ status: HttpStatusCode.Ok });
        dictionaryServiceSpy.reset.and.returnValue(throwError(errorResponse3));

        component.resetDataBase();
        expect(spy).toHaveBeenCalledTimes(3);

        const errorResponse4 = new HttpErrorResponse({ status: HttpStatusCode.NotFound });
        bestScoreServiceSpy.resetDbBestScores.and.returnValue(throwError(errorResponse4));

        const errorResponse5 = new HttpErrorResponse({ status: HttpStatusCode.NotFound });
        virtualPlayerNameServiceSpy.reset.and.returnValue(throwError(errorResponse5));

        const errorResponse6 = new HttpErrorResponse({ status: HttpStatusCode.NotFound });
        dictionaryServiceSpy.reset.and.returnValue(throwError(errorResponse6));

        component.resetDataBase();
        expect(spy).toHaveBeenCalledTimes(6);
    });
});
