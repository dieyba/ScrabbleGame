import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BestScoresService } from './best-scores.service';

describe('BestScoresService', () => {
    let service: BestScoresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, MatSnackBarModule],
        });
        service = TestBed.inject(BestScoresService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
