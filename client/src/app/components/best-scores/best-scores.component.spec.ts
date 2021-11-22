import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BestScoresService } from '@app/services/best-scores.service';
import { BestScoresComponent } from './best-scores.component';

describe('BestScoresComponent', () => {
    let component: BestScoresComponent;
    let fixture: ComponentFixture<BestScoresComponent>;
    let bestScoresServiceSpy: jasmine.SpyObj<BestScoresService>;
    beforeEach(async () => {
        bestScoresServiceSpy = jasmine.createSpyObj('BestScoresService', ['getBestScores', 'handleErrorSnackBar']);
        // bestScoresServiceSpy.getBestScores('') = new Observable<BestScores>();
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
});
