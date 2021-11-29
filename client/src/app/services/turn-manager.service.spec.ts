import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TurnManagerService } from './turn-manager.service';

describe('TurnManagerService', () => {
    let service: TurnManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, MatSnackBarModule],
        });
        service = TestBed.inject(TurnManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
