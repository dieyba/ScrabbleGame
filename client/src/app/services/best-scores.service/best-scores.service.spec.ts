import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BestScoresService } from './best-scores.service';

describe('BestScoresService', () => {
    let service: BestScoresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, MatSnackBarModule],
        });
        service = TestBed.inject(BestScoresService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
